import { ScrollView, Image, TouchableOpacity } from 'react-native'
import { Button, TextInput } from '@fruits-chain/react-native-xiaoshu'

import { useSearchParams, useNavigation } from 'expo-router'
import { Text, View } from '../../components/Themed'
import AutoHeightImage from 'react-native-auto-height-image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import me from '@/assets/images/me.jpg'
import axios from 'axios'
import you from '@/assets/images/you.gif'
import { styles } from './style'
import { v4 as uuidv4 } from 'uuid'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { chatTimeFormat } from '../../utils/time'
import ImagePreview from '../../components/full-image'
import Shim from '../../components/full-image/shim'
import { requestEncode, responseDecode } from '../../utils/protobuf'
import ChatItem from '../../components/chat/chatItem'
import FooterInput from '../../components/chat/footer'

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
  const { title, type } = useSearchParams()
  const isTextMode = type === 'text'
  const scrollViewRef = useRef<ScrollView>(null)
  const [chatData, setChatData] = useState<ChatItem[]>([])
  const [currImageIndex, setCurrImageIndex] = useState(0) // 当前预览图片的索引
  const [showImagePreview, setShowImagePreview] = useState(false) // 图片预览与否

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
      title,
    })
  }, [navigation, title])
  /** 图片集 */
  const imgUrls = useMemo(() => {
    let urls = []
    chatData?.forEach(ch => ch?.images?.forEach(img => urls.push({ url: img.url, id: img.imgId })))
    return urls
  }, [chatData])

  const scrollToEnd = useCallback(() => {
    scrollViewRef.current.scrollToEnd()
  }, [])

  const sendMsg = useCallback(
    (m: string) => {
      sendMessage(m)
      // axios
      //   .request<{ data: string | { url: string }[]; success: boolean }>({
      //     url: isTextMode ? 'http://183.67.44.134:5000/findText' : 'http://183.67.44.134:5000/findImg',
      //     method: 'post',
      //     data: { prompt: m },
      //     timeout: 10 * 60 * 1000,
      //   })
      //   .then(data => {
      //     // console.log('data => ', data.data.data)
      //     if (data.data.success) {
      //       const resItem: ChatItem = {
      //         id: uuidv4(),
      //         tag: 1,
      //         time: new Date().getTime(),
      //       }

      //       if (typeof data.data.data === 'string') {
      //         resItem.content = data.data.data
      //       } else {
      //         resItem.images = data.data.data.map(item => ({
      //           imgId: uuidv4(),
      //           url: item.url,
      //         }))
      //       }

      //       setChatData(cd => [...cd, resItem])
      //     } else {
      //       //
      //     }
      //   })
    },
    [isTextMode]
  )

  const onPressImg = useCallback(
    (id: string) => {
      const index = imgUrls.findIndex(img => img.id === id)
      setCurrImageIndex(index)
      setShowImagePreview(true)
    },
    [imgUrls]
  )

  // useEffect(() => {
  //   autoEntryRoom()
  // }, [])
  return (
    <>
      {/* body 滚动区域 */}
      <ScrollView
        keyboardDismissMode="on-drag"
        ref={scrollViewRef}
        style={styles.body}
        onContentSizeChange={() => {
          scrollViewRef.current.scrollToEnd({
            animated: true,
          })
        }}
      >
        <View style={styles.bodyInner}>
          {chatData?.map((item, index) => (
            <View key={item.id}>
              <ChatItem chatData={chatData} item={item} index={index}></ChatItem>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* footer 输入框 */}
      <FooterInput
        sendMessage={async value => {
          setChatData(
            chatData.concat([
              {
                id: uuidv4(),
                tag: 99,
                content: value,
                time: new Date().getTime(),
              },
            ])
          )
          await AsyncStorage.setItem(
            String(type),
            JSON.stringify(
              chatData.concat([
                {
                  id: uuidv4(),
                  tag: 99,
                  content: value,
                  time: new Date().getTime(),
                },
              ])
            )
          )
        }}
        scrollToEnd={scrollToEnd}
      />

      {/* 动态高度组件 */}
      <Shim />

      {/* 图片预览组件 */}
      <ImagePreview
        index={currImageIndex}
        visible={showImagePreview}
        onVisibleChange={visible => setShowImagePreview(visible)}
        photos={imgUrls}
      />
    </>
  )
}
