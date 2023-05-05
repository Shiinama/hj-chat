import { Text, View, TouchableOpacity } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import { useSearchParams, useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import ChatItem from '../../components/chat/chatItem'
import Container from '../../components/chat/container'
import { chatHistory } from '../../api'
import { Audio } from 'expo-av'
import ShellLoading from '../../components/loading'
import { useSocketIo } from '../../components/chat/socket'
import * as FileSystem from 'expo-file-system'
import Back from '../../assets/images/tabbar/back.svg'
import Flash from '../../assets/images/tabbar/flash.svg'
import { convert4amToMp3 } from '../../utils/convert'
import botStore from '../../store/botStore'
export type ChatItem = {
  id: number
  uid?: string
  userId?: number
  userUid?: string
  status?: string
  type?: string
  replyUid?: string | null
  text?: string
  translation?: string | null
  voiceUrl?: string | null
  botId?: number
  content?: string
  createdDate?: string
  updatedDate?: string
  botUid?: string
}

export default function Chat({}) {
  console.log(botStore.getState(), '1231231')
  const navigation = useNavigation()
  const { name, uid, userId, energyPerChat } = useSearchParams()
  const [message, resMessage, sendMessage, translationMessage] = useSocketIo()
  const [recording, setRecording] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState<boolean>(true)
  const [chatData, setChatData] = useState<ChatItem[]>([])
  const [voice, setVoice] = useState(null)
  const [translationTextIndex, setTranslationTextIndex] = useState(null)
  useEffect(() => {
    chatHistory(uid).then(({ data }: any) => {
      data.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime())
      setChatData(data)
      setLoading(false)
    })
  }, [])
  useEffect(() => {
    try {
      new Audio.Recording()
      Audio.requestPermissionsAsync().then(({ granted }) => {
        if (!granted) {
          alert('请允许访问麦克风以录制音频！请到设置中')
        }
      })
      Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }, [])
  async function startRecording() {
    try {
      const defaultParam = Audio.RecordingOptionsPresets.HIGH_QUALITY
      const { recording } = await Audio.Recording.createAsync(defaultParam)
      setRecording(recording)
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      const mp3Uri = await convert4amToMp3(uri)
      const buffer = await FileSystem.readAsStringAsync(mp3Uri, {
        encoding: FileSystem.EncodingType.Base64,
      })
      setVoice(buffer)
      return uri
    } catch (err) {
      console.error('Failed to stop recording', err)
    }
  }
  function setAuInfo() {
    sendAudio()
  }

  const sendAudio = () => {
    const reqId = uuidv4()
    sendMessage('voice_chat', {
      reqId,
      botUid: uid,
      voice,
    })
  }
  const translationText = messageUid => {
    const Index = chatData.findIndex(item => item.uid === messageUid)
    if (chatData[Index].translation) return
    setTranslationTextIndex(Index)
    const reqId = uuidv4()
    sendMessage('translate_message', {
      reqId,
      messageUid,
    })
  }
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>{name}</Text>
          <View
            style={{
              // paddingVertical: 2,
              marginLeft: 5,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 2,
              paddingVertical: 1,
              borderRadius: 5,
              borderWidth: 2,
              borderColor: '#EDEDED',
            }}
          >
            <Flash width={18} height={18}></Flash>
            <Text style={{ fontSize: 16, fontWeight: '600', marginRight: 5 }}>{energyPerChat}</Text>
          </View>
        </View>
      ),
      headerLeft: () => {
        return (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Back></Back>
          </TouchableOpacity>
        )
      },
    })
  }, [navigation, name])

  useEffect(() => {
    if (!message) return
    setChatData(chatData.concat(message.data))
  }, [message])

  useEffect(() => {
    if (!resMessage) return
    setChatData(chatData.concat(resMessage))
  }, [resMessage])

  useEffect(() => {
    if (!translationMessage) return
    setChatData(pre => {
      pre[translationTextIndex].translation = translationMessage.translation
      return [...pre]
    })
  }, [translationMessage])

  if (loading) return <ShellLoading></ShellLoading>
  return (
    <>
      <Container
        inputTextProps={
          {
            onChangeText: setText,
            value: text,
            uid,
            userId,
            setAuInfo,
            startRecording,
            stopRecording,
            onSubmitEditing: async (value: any) => {
              const reqId = uuidv4()
              sendMessage('text_chat', {
                reqId,
                botUid: uid,
                text: value,
              })
              setText('')
            },
          } as any
        }
        flatListProps={{
          data: chatData,
          renderItem: ({ item, index }) => {
            return (
              <View>
                <ChatItem translationText={translationText} item={item}></ChatItem>
              </View>
            )
          },
        }}
      ></Container>
    </>
  )
}
