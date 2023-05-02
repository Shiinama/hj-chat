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

export type ChatItem = {
  /** @param
   * tag：1对方，99我方
   */
  id: string
  tag: number
  time: number
  avatar?: string
  content?: string
  images?: { imgId: string; url: string }[]
}
// 请将useWsService函数补充完整
const useWsService = () => {
  const wsRef = useRef<WebSocket>(new WebSocket('ws://127.0.0.1:8000/im'))
  const [response, setResponse] = useState(null)
  const wsRefisOpen = useRef(false)
  wsRef.current.onopen = () => {
    wsRefisOpen.current = true
  }
  wsRef.current.onmessage = e => {
    const msg = JSON.parse(e.data)
    if (msg?.msg.sender !== '111') return
    const { msg: data } =
      e.data instanceof ArrayBuffer ? responseDecode('im.chat.ChatMsgResp', new Uint8Array(e.data)) : JSON.parse(e.data)
    setResponse(data)
  }
  wsRef.current.onclose = () => {
    wsRefisOpen.current = false
  }
  wsRef.current.onerror = () => {
    wsRefisOpen.current = false
  }

  const param = {
    send_type: 0,
    sender: 'yuyuyu',
    receiver_type: 1,
    receiver: 'group1',
    time: new Date().getTime(),
    content_type: 1,
    content: '',
  }

  const joinRoom = room => {
    param.send_type = 1
    param.receiver = room
    param.content = '加入房间'
    const messageRequest = requestEncode('im.chat.ChatMsgReq', { msg: param }) as Uint8Array
    wsRef.current.send(messageRequest)
  }

  const sendMessage = message => {
    param.content = message
    wsRef.current.send(JSON.stringify({ msg: param }))
  }

  return { wsRefisOpen, response, sendMessage, joinRoom }
}

export default function Chat({}) {
  const navigation = useNavigation()
  const { name, type, uid, id } = useSearchParams()
  const isTextMode = type === 'text'
  const [chatData, setChatData] = useState<ChatItem[]>([])
  const [currImageIndex, setCurrImageIndex] = useState(0) // 当前预览图片的索引
  const [showImagePreview, setShowImagePreview] = useState(false) // 图片预览与否
  useEffect(() => {
    chatHistory(uid).then(({ data }) => {
      console.log(data)
    })
  }, [])
  const { response, sendMessage, joinRoom } = useWsService()
  useEffect(() => {
    if (!response) return
    setChatData(preVal => [
      ...preVal,
      { content: response.sendType === 1 ? '进入房间' : response.content, id: response.id, tag: 1, time: Date.now() },
    ])
  }, [response])
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
  /** 图片集 */
  const imgUrls = useMemo(() => {
    let urls = []
    chatData?.forEach(ch => ch?.images?.forEach(img => urls.push({ url: img.url, id: img.imgId })))
    return urls
  }, [chatData])

  const sendMsg = useCallback(
    (m: string) => {
      sendMessage(m)
    },
    [isTextMode]
  )
  const [text, setText] = useState('')
  const onPressImg = useCallback(
    (id: string) => {
      const index = imgUrls.findIndex(img => img.id === id)
      setCurrImageIndex(index)
      setShowImagePreview(true)
    },
    [imgUrls]
  )
  return (
    <>
      <Container
        inputTextProps={{
          onChangeText: setText,
          value: text,
          onKeyPress: e => {
            if (e.nativeEvent.key === 'Backspace') {
              console.log(11)
            }
          },
          onSubmitEditing: async e => {
            const { nativeEvent } = e
            setChatData(
              chatData.concat([
                {
                  id: String(Math.random()),
                  tag: 99,
                  content: nativeEvent.text,
                  time: new Date().getTime(),
                },
              ])
            )
            await AsyncStorage.setItem(
              String(type),
              JSON.stringify(
                chatData.concat([
                  {
                    id: String(Math.random()),
                    tag: 99,
                    content: nativeEvent.text,
                    time: new Date().getTime(),
                  },
                ])
              )
            )
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
      {/* <Button onPress={() => console.log(containerRef.current)}></Button> */}
      <ImagePreview
        index={currImageIndex}
        visible={showImagePreview}
        onVisibleChange={visible => setShowImagePreview(visible)}
        photos={imgUrls}
      />
      {/* body 滚动区域 */}
    </>
  )
}
