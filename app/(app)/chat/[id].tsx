import { Text, View, TouchableOpacity, AppState, FlatList, Alert } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import { useNavigation } from 'expo-router'
import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
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
import { Button, Toast } from '@fruits-chain/react-native-xiaoshu'
import { convert4amToMp3 } from '../../../utils/convert'
import botStore from '../../../store/botStore'
import FlashIcon from '../../../components/flashIcon'
import useUserStore from '../../../store/userStore'
import AudioPayManagerSingle, { AudioPayManager } from '../../../components/chat/audioPlayManager'
import { NativeEventSubscription } from 'react-native'
import CallBackManagerSingle from '../../../utils/CallBackManager'

export type ChatItem = {
  id: number
  uid: string
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
function Chat({}) {
  const { pinned, logo, name, uid, userId, energyPerChat, id } = botStore.getState()
  const { profile } = useUserStore()

  /** 页面数据上下文 */
  const [chatPageValue, setChatPageValue] = useSetState<ChatPageState>({
    pageStatus: 'normal',
    selectedItems: [],
  })
  const navigation = useNavigation()
  const { message, resMessage, sendMessage, translationMessage, updateMessage, isPending } = useSocketIo()
  // 给loading生成一个随机id，这里是用replyUid来判断是否是回复的信息，loading展示为回复数据，所以随便弄一个id当id
  const randomId = useId()

  // const [recording, setRecording] = useState(null)
  // 不需要重新渲染的无需存放useState,造成不必要的渲染
  const recordingRef = useRef<Audio.Recording>()
  const [loading, setLoading] = useState<boolean>(true)
  const [chatData, setChatData] = useState<ChatItem[]>([])
  const [durationMillis, setDurationMillis] = useState(0)
  const [voice, setVoice] = useState(null)
  const flatList = useRef<FlatList>()
  const [showLoadMoring, setShowLoadMoring] = useState(false)
  const chatDataInfo = useRef({
    isTouchList: false, // 用户是否touch了list，用户touch后如果触发list的onEndReached才去加载更多
    pageSize: 10, // 每页加载多少条数据
    hasMore: true,
  })
  useEffect(() => {
    try {
      new Audio.Recording()

      Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
    } catch (err) {
      Toast('Failed to start recording')
    }
    loadData()
    return () => {
      // 单列模式里面的sound销毁
      AudioPayManagerSingle().destory()
      try {
        // 退出的时候录音停止销毁
        recordingRef.current?.stopAndUnloadAsync?.()
        recordingRef.current = undefined
      } catch (error) {}
    }
  }, [])

  async function startRecording() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
      })
      const defaultParam = Audio.RecordingOptionsPresets.HIGH_QUALITY
      const { recording } = await Audio.Recording.createAsync(defaultParam, status => {
        if (status.isRecording) {
          // 主界面不用关心录音的状态，造成过多无用的渲染，交给callBack，谁需要这个数据谁去执行回调
          // setDurationMillis(status.durationMillis)
          CallBackManagerSingle().executeLike('recordingChange', status.durationMillis)
        }
      })
      recordingRef.current = recording
      // setRecording(recording)
      return true
    } catch (err) {
      console.log(err)
      Toast('Failed to start recording')
      return false
    }
  }

  const loadData = (loadMore?: boolean) => {
    if (loadMore) {
      setShowLoadMoring(true)
    }
    chatHistory({
      botUid: uid,
      offset: loadMore ? chatData.length : 0,
      limit: chatDataInfo.current.pageSize,
      beforeId: chatData.length > 0 && loadMore ? chatData[chatData.length - 1].id : undefined,
    })
      .then(({ data }: any) => {
        // fix 手动颠倒顺序滚动位置无法精准的问题以及其他滚动问题 FlatList设置了inverted(倒置，往上滑就是加载更多了 上变为下，数据也是一样)就无需排序和调用scrollEnd了
        // data.sort(
        //   (a, b) =>
        //     new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
        // );
        // chatDataInfo.current.data = data
        setChatData(!loadMore ? data : [...chatData, ...data])
        if (data.length < chatDataInfo.current.pageSize) {
          chatDataInfo.current.hasMore = false
        }
        chatDataInfo.current.isTouchList = false
        setShowLoadMoring(false)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        chatDataInfo.current.isTouchList = false
        setShowLoadMoring(false)
        setLoading(false)
      })
  }

  async function stopRecording() {
    try {
      await recordingRef.current?.stopAndUnloadAsync()
      const uri = recordingRef.current?.getURI()
      const mp3Uri = await convert4amToMp3(uri)
      const buffer = await FileSystem.readAsStringAsync(mp3Uri, {
        encoding: FileSystem.EncodingType.Base64,
      })
      const fileBuffer = Buffer.from(`data:audio/mpeg;base64,${buffer}`, 'base64')
      setVoice(fileBuffer)
      const { exists } = await FileSystem.getInfoAsync(mp3Uri)
      if (exists) {
        try {
          await FileSystem.deleteAsync(mp3Uri)
        } catch (error) {
          console.log(error)
        }
      }
      return uri
    } catch (err) {
      console.error('Failed to stop recording', err)
    }
  }
  function setAuInfo() {
    sendAudio()
  }

  console.log('recording:', recordingRef.current)

  const sendAudio = () => {
    const reqId = uuidv4()
    sendMessage('voice_chat', {
      reqId,
      botUid: uid,
      voice,
    })
    setVoice(null)
  }
  const translationText = messageUid => {
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
              onPress={() => {
                setChatPageValue({ pageStatus: 'normal', selectedItems: [] })
              }}
            />
          )
        )
      },
    })
  }, [navigation, name, chatPageValue.pageStatus])

  useEffect(() => {
    if (!message) return
    setChatData([message.data, ...chatData])
    flatList.current?.scrollToIndex?.({ index: 0 })
    // 刷新聊天主页列表 加个延时  马上去请求数据可能还没更新，如果没有延时的问题可以去掉setTimeout
    setTimeout(() => {
      CallBackManagerSingle().execute('botList')
    }, 300)
  }, [message])

  useEffect(() => {
    if (!resMessage) return
    setChatData([resMessage, ...chatData])
    if (resMessage?.voiceUrl?.length > 0 && !AudioPayManagerSingle().currentAutoPlayUrl) {
      AudioPayManagerSingle().currentAutoPlayUrl = resMessage?.voiceUrl
    }
    // 刷新聊天主页列表
    setTimeout(() => {
      CallBackManagerSingle().execute('botList')
    }, 300)
    flatList.current?.scrollToIndex?.({ index: 0 })
    // 回复消息也需要刷新消息列表
    if (chatData.length <= 1) {
      CallBackManagerSingle().execute('botList')
    }
  }, [resMessage])

  useEffect(() => {
    if (!updateMessage) return
    const index = chatData.findIndex(item => item.uid === updateMessage.uid)
    setChatData(pre => {
      pre[index].text = updateMessage.text
      return [...pre]
    })
  }, [updateMessage])

  useEffect(() => {
    if (!translationMessage) return
    const index = chatData.findIndex(item => item.id === translationMessage.id)
    setChatData(pre => {
      // fix TypeError: undefined is not an object (evaluating 'pre[translationTextIndex].translation = translationMessage.translation')
      if (index > -1) {
        pre[index].translation = translationMessage.translation
      }

      return [...pre]
    })
  }, [translationMessage])

  const loadNextData = () => {
    try {
      if (!chatDataInfo.current.hasMore || !chatDataInfo.current.isTouchList || showLoadMoring) {
        return
      }
      loadData(true)
    } catch (e) {
      console.log(e || 'loadNextData error')
    }
  }

  const listData = useMemo(() => {
    if (isPending && chatData?.length > 0) {
      return [{ type: 'LOADING', id: randomId, replyUid: randomId }, ...chatData]
    } else {
      return chatData
    }
  }, [chatData, isPending, randomId])
  if (loading) return <ShellLoading></ShellLoading>
  console.log('rerender chat')
  return (
    <ChatContext.Provider value={{ value: chatPageValue, setValue: setChatPageValue }}>
      <Container
        haveHistory={chatData.length > 0}
        inputTextProps={
          {
            uid,
            userId,
            pinned,
            setAuInfo,
            durationMillis,
            startRecording,
            stopRecording,
            onSubmitEditing: async (value: any) => {
              if (value.length === 0) {
                Alert.alert('Please enter your message')
                return
              }
              const reqId = uuidv4()
              sendMessage('text_chat', {
                reqId,
                botUid: uid,
                text: value,
              })
            },
          } as any
        }
        flatListRef={flatList}
        flatListProps={{
          data: listData,
          inverted: true,
          onTouchStart: () => {
            // inverted: true 颠倒列表，往上滑就是加载更多了 上变为下，数据也是一样，加载完数据就无需排序和调用scrollEnd了，并且新增一条消息也无需调用scrollEnd
            // 防止进来渲染数据的时候 触发onEndReached去加载更多，用户手动滑动的时候再去加载更多
            chatDataInfo.current.isTouchList = true
          },
          onEndReached: () => {
            // 分页，颠倒列表 inverted为true往上滑就会调用此方法，原来是往下滑调用这个方法，往上滑是调用onRefresh
            loadNextData()
          },
          ListFooterComponent: showLoadMoring ? (
            <View
              style={{
                width: '100%',
                marginVertical: 15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShellLoading />
            </View>
          ) : null,
          onEndReachedThreshold: 0.2,
          renderItem: ({ item }) => {
            return (
              <View key={item.id}>
                <ChatItem me={profile?.avatar} logo={logo} translationText={translationText} item={item}></ChatItem>
              </View>
            )
          },
        }}
      ></Container>
    </ChatContext.Provider>
  )
}

export default React.memo(Chat)
