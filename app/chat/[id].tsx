import { View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import { useSearchParams, useNavigation } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ImagePreview from '../../components/full-image'
import { requestEncode, responseDecode } from '../../utils/protobuf'
import ChatItem from '../../components/chat/chatItem'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Container from '../../components/chat/container'
import { Button } from '@fruits-chain/react-native-xiaoshu'
import axios from 'axios'
import { chatHistory } from '../../api'
import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system'
import ShellLoading from '../../components/loading'

export type ChatItem = {
  id: number
  uid: string
  userId: number
  userUid: string
  status: string
  type: string
  replyUid: string | null
  text: string
  translation: string | null
  voiceUrl: string | null
  botId: number
  createdDate: string
  updatedDate: string
  botUid: string
}

export default function Chat({}) {
  const navigation = useNavigation()
  const { name, type, uid, userId } = useSearchParams()
  const [recording, setRecording] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
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
      setIsRecording(true)
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      setChatData(
        chatData.concat([{ id: Math.random(), uid: '47ddd3ac0ca64f5ab6888b14dd9e4458', voiceUrl: uri } as any])
      )
      // const buffer = await FileSystem.readAsStringAsync(uri, {
      //   encoding: FileSystem.EncodingType.Base64,
      // })
      // await uploadRecording(buffer)
      setIsRecording(false)
    } catch (err) {
      console.error('Failed to stop recording', err)
    }
  }

  async function uploadRecording(buffer) {
    // console.log(buffer)
    return
    try {
      const response = await axios.post('https://my-server.com/api/upload', {
        data: buffer,
      })
      console.log('Upload success', response.data)
    } catch (err) {
      console.error('Upload failed', err)
    }
  }

  useEffect(() => {
    const getStorageData = async () => {
      return JSON.parse(await AsyncStorage.getItem(String(type)))
    }

    getStorageData().then(r => {
      setChatData(r || [])
    })
  }, [type])
  useEffect(() => {
    navigation.setOptions({
      title: name,
    })
  }, [navigation, name])

  const [text, setText] = useState('')
  if (loading) return <ShellLoading></ShellLoading>
  return (
    <>
      <Container
        inputTextProps={{
          onChangeText: setText,
          value: text,
          isRecording,
          startRecording,
          stopRecording,
          onKeyPress: e => {
            if (e.nativeEvent.key === 'Backspace') {
              console.log(11)
            }
          },
          onSubmitEditing: async e => {
            const { nativeEvent } = e
            // setChatData(
            //   chatData.concat([
            //     {
            //       id: String(Math.random()),
            //       tag: 99,
            //       content: nativeEvent.text,
            //       time: new Date().getTime(),
            //     },
            //   ])
            // )
            // await AsyncStorage.setItem(
            //   String(type),
            //   JSON.stringify(
            //     chatData.concat([
            //       {
            //         id: String(Math.random()),
            //         tag: 99,
            //         content: nativeEvent.text,
            //         time: new Date().getTime(),
            //       },
            //     ])
            //   )
            // )
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
