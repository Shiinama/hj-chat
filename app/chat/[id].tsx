import { View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import { useSearchParams, useNavigation } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ChatItem from '../../components/chat/chatItem'
import Container from '../../components/chat/container'
import axios from 'axios'
import { chatHistory } from '../../api'
import { Audio } from 'expo-av'
import ShellLoading from '../../components/loading'
import { useSocketIo } from '../../components/chat/socket'
import * as FileSystem from 'expo-file-system'

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
  const navigation = useNavigation()
  const { name, uid } = useSearchParams()
  const [message, resMessage, sendMessage] = useSocketIo()
  const [recording, setRecording] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState<boolean>(true)
  const [chatData, setChatData] = useState<ChatItem[]>([])
  useEffect(() => {
    chatHistory(uid).then(({ data }: any) => {
      setChatData(data)
      setLoading(false)
    })
  }, [])
  useEffect(() => {
    try {
      new Audio.Recording()
      Audio.requestPermissionsAsync().then(({ granted }) => {
        if (!granted) {
          alert('请允许访问麦克风以录制音频！')
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
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      setRecording(recording)
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      const buffer = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      })
      return uri
    } catch (err) {
      console.error('Failed to stop recording', err)
    }
  }
  function setAuInfo(uri) {
    setChatData(chatData.concat([{ id: Math.random(), uid: '47ddd3ac0ca64f5ab6888b14dd9e4458', voiceUrl: uri } as any]))
  }

  const sendAudie = buffer => {
    const reqId = uuidv4()
    sendMessage('voice_chat', {
      reqId,
      botUid: uid,
      voice: buffer,
    })
  }

  useEffect(() => {
    navigation.setOptions({
      title: name,
    })
  }, [navigation, name])

  useEffect(() => {
    if (!message) return
    if (message.reqId === resMessage.reqId) {
      setChatData(chatData.concat([message.data]))
    }
    setChatData(chatData.concat([resMessage.data]))
  }, [message, resMessage])

  if (loading) return <ShellLoading></ShellLoading>
  return (
    <>
      <Container
        inputTextProps={{
          onChangeText: setText,
          value: text,
          setAuInfo,
          startRecording,
          stopRecording,
          onSubmitEditing: async (value: string) => {
            const reqId = uuidv4()
            sendMessage('text_chat', {
              reqId,
              botUid: uid,
              text: value,
            })
            setText('')
          },
        }}
        flatListProps={{
          data: chatData,
          renderItem: ({ item, index }) => {
            return (
              <View>
                <ChatItem chatData={chatData} item={item} index={index}></ChatItem>
              </View>
            )
          },
        }}
      ></Container>
    </>
  )
}
