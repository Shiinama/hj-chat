import { Text, View, TouchableOpacity, AppState } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import { useSearchParams, useNavigation, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import ChatItem from '../../../components/chat/chatItem'
import Container from '../../../components/chat/container'
import { chatHistory } from '../../../api'
import { Audio } from 'expo-av'
import { useSetState } from 'ahooks'
import ShellLoading from '../../../components/loading'
import { useSocketIo } from '../../../components/chat/socket'
import * as FileSystem from 'expo-file-system'
import { Buffer } from 'buffer'
import { ChatContext, ChatPageState } from './chatContext'
import { Button } from '@fruits-chain/react-native-xiaoshu'
import { convert4amToMp3 } from '../../../utils/convert'
import botStore from '../../../store/botStore'
import FlashIcon from '../../../components/flashIcon'
import useUserStore from '../../../store/userStore'
import AudioPayManagerSingle, { AudioPayManager } from '../../../components/chat/audioPlayManager'
import { NativeEventSubscription } from 'react-native'

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
  const botStorage = botStore.getState()
  const { profile } = useUserStore()

  const eventAppState = useRef<{
    appState?:NativeEventSubscription;
    audioManager: AudioPayManager;
    prev?: string;
  }>({
    audioManager: AudioPayManagerSingle()
  })

  /** 页面数据上下文 */
  const [chatPageValue, setChatPageValue] = useSetState<ChatPageState>({
    pageStatus: 'normal',
    selectedItems: [],
  })
  const navigation = useNavigation()
  const { name, uid, userId, energyPerChat } = useSearchParams()
  const [message, resMessage, sendMessage, translationMessage, updateMessage] = useSocketIo()
  const [recording, setRecording] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState<boolean>(true)
  const [chatData, setChatData] = useState<ChatItem[]>([])
  const [voice, setVoice] = useState(null)
  const [translationTextIndex, setTranslationTextIndex] = useState(null)
  useEffect(() => {
    try {
      new Audio.Recording()
      
      Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
    } catch (err) {
      console.error('Failed to start recording', err)
    }
    chatHistory(uid).then(({ data }: any) => {
      data.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime())
      console.log("data", data)
      setChatData(data)
      setLoading(false)
    })
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
      const fileBuffer = Buffer.from(`data:audio/mpeg;base64,${buffer}`, 'base64')
      setVoice(fileBuffer)
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
          <FlashIcon energyPerChat={energyPerChat} />
        </View>
      ),
      headerRight: () => {
        return (
          chatPageValue.pageStatus === 'sharing' && (
            <Button
              type="ghost"
              text="Cancel"
              color="#7A2EF6"
              size="s"
              style={{ borderRadius: 8 }}
              onPress={() => setChatPageValue({ pageStatus: 'normal' })}
            />
          )
        )
      },
    })
  }, [navigation, name, chatPageValue.pageStatus])

  useEffect(() => {
    if (!message) return
    setChatData(chatData.concat(message.data))
  }, [message])

  useEffect(() => {
    if (!resMessage) return
    setChatData(chatData.concat(resMessage))
  }, [resMessage])

  useEffect(() => {
    if (!updateMessage) return
    const index = chatData.findIndex(item => item.uid === updateMessage.uid)
    console.log(index)
    setChatData(pre => {
      pre[index].text = updateMessage.text
      return [...pre]
    })
  }, [updateMessage])

  useEffect(() => {
    if (!translationMessage) return
    setChatData(pre => {
      // fix TypeError: undefined is not an object (evaluating 'pre[translationTextIndex].translation = translationMessage.translation')
      if (pre[translationTextIndex]) {
        pre[translationTextIndex].translation = translationMessage.translation
      }
      
      return [...pre]
    })
  }, [translationMessage])

  // 处理播放录音退到后台的问题
  useEffect(()=>{
    if (eventAppState.current.appState) {
      eventAppState.current.appState.remove()
    }
    eventAppState.current.appState = AppState.addEventListener("change", (state)=> {
      // 如果进入后台或者重新进入就停止播放
      if (state === 'background') {
        eventAppState.current.audioManager.pause(true)
      }
      eventAppState.current.prev = state
    })
    return ()=> {
      if (eventAppState.current.appState) {
        eventAppState.current.appState.remove()
      }
    }
  }, [])

  if (loading) return <ShellLoading></ShellLoading>
  return (
    <ChatContext.Provider value={{ value: chatPageValue, setValue: setChatPageValue }}>
      <Container
        inputTextProps={
          {
            onChangeText: setText,
            value: text,
            uid,
            userId,
            pinned: botStorage.pinned,
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
                <ChatItem
                  me={profile?.avatar}
                  logo={botStorage.logo}
                  translationText={translationText}
                  item={item}
                ></ChatItem>
              </View>
            )
          },
        }}
      ></Container>
    </ChatContext.Provider>
  )
}
