import { Text, View, TouchableOpacity, AppState, FlatList, Alert } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import { useNavigation } from 'expo-router'
import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import ChatItem from '../../../components/chat/chatItem'
import Container from '../../../components/chat/container'
import { chatHistory } from '../../../api'
import { Audio } from 'expo-av'
import { useSetState } from 'ahooks'
import { useRouter } from 'expo-router'
import ShellLoading from '../../../components/loading'
import * as FileSystem from 'expo-file-system'
import { Buffer } from 'buffer'
import { ChatContext, ChatPageState } from './chatContext'
import { Button, Toast } from '@fruits-chain/react-native-xiaoshu'
import { convert4amToMp3 } from '../../../utils/convert'
import botStore from '../../../store/botStore'

import Back from '../../../assets/images/tabbar/back.svg'
import To from '../../../assets/images/chat/to.svg'
import useUserStore from '../../../store/userStore'
import AudioPayManagerSingle, { AudioPayManager } from '../../../components/chat/audioPlayManager'
import CallBackManagerSingle from '../../../utils/CallBackManager'
import { TagFromType, useTagList } from '../../../constants/TagList'
import Tag from '../../../components/tag'
import SocketStreamManager from '../../../components/chat/socketManager'
import { MesageSucessType, MessageDto } from '../../../components/chat/type'

export type ChatItem = MessageDto
function Chat({}) {
  const { pinned, logo, name, uid, userId, id } = botStore.getState().botBaseInfo

  const { profile } = useUserStore()
  const router = useRouter()
  const tags = useTagList(botStore.getState().botBaseInfo, TagFromType.Chat)
  const safeTop = useSafeAreaInsets().top
  /** 页面数据上下文 */
  const [chatPageValue, setChatPageValue] = useSetState<ChatPageState>({
    pageStatus: 'normal',
    selectedItems: [],
  })
  const navigation = useNavigation()
  const isPending = useRef(false)
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
  const currentSendMsgInfo = useRef<MesageSucessType>()
  useEffect(() => {
    try {
      new Audio.Recording()

      Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
    } catch (err) {
      console.log(err)
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
      .then(({ data }: { data: Array<MessageDto> }) => {
        // fix 手动颠倒顺序滚动位置无法精准的问题以及其他滚动问题 FlatList设置了inverted(倒置，往上滑就是加载更多了 上变为下，数据也是一样)就无需排序和调用scrollEnd了
        // data.sort(
        //   (a, b) =>
        //     new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
        // );
        // chatDataInfo.current.data = data
        data?.map(item => {
          // 查找正在接收的内容，type置为loading
          const msgKey = item.botId + '&BOT&' + item.replyUid
          const messageText = SocketStreamManager().getMessageTextStream(msgKey)
          if (messageText) {
            item.type = 'LOADING'
            item.text = messageText
          }
        })
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

  const sendAudio = () => {
    if (!AudioPayManagerSingle().netInfo?.isConnected) {
      Alert.alert('Please check your network connection')
      return
    }
    const reqId = uuidv4()

    SocketStreamManager().sendMessage('voice_chat', {
      reqId,
      botUid: uid,
      voice,
    })
    setVoice(null)
  }

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          style={{
            backgroundColor: 'white',
            paddingTop: safeTop,
            paddingHorizontal: 10,
            borderBottomWidth: 1,
            position: 'relative',
            borderColor: '#E0E0E0',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                position: 'absolute',
                left: 0,
                height: 24,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Back></Back>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: `robot/${uid}`,
                })
              }}
              style={{ flexDirection: 'row', alignItems: 'center', maxWidth: 200 }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ marginRight: 5, fontSize: 20, lineHeight: 30, fontWeight: '700' }}
              >
                {name}
              </Text>
              <To width={12} height={14}></To>
            </TouchableOpacity>
            <View style={{ position: 'absolute', right: 0 }}>
              {chatPageValue.pageStatus === 'sharing' && (
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
              )}
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'center' }}>
            {tags.map(tag => (
              <Tag key={tag.bgColor} {...tag}></Tag>
            ))}
          </View>
        </View>
      ),
    })
  }, [navigation, name, chatPageValue.pageStatus])

  // socket回调
  useEffect(() => {
    SocketStreamManager().onPending = pending => {
      isPending.current = pending
    }
    SocketStreamManager().onSendMessage = data => {
      console.log('onSendMessagedata:', data)
      currentSendMsgInfo.current = data
      if (!data?.data) return
      setChatData(list => {
        // 发送消息成功添加一个待回复的item
        return [
          {
            type: 'LOADING',
            ...data.data,
            uid: currentSendMsgInfo.current?.data?.uid + id,
          },
          ...list,
        ]
      })
      flatList.current?.scrollToIndex?.({ index: 0 })
    }
    SocketStreamManager().onMessageStreamStart = data => {
      setChatData(list => {
        // 开始接收流 更新或新增一个回复的item
        let have = false
        const newList = list.map(item => {
          if (item.replyUid === data.replyMessage?.replyUid) {
            have = true
            item = { ...data.replyMessage, type: 'LOADING' }
          }
          return item
        })
        return !have ? [{ ...data.replyMessage, type: 'LOADING' }, ...newList] : [...newList]
      })
    }
    SocketStreamManager().onResMessage = resMessage => {
      if (!resMessage) return
      // 新回复
      // if (resMessage.type === 'REPLY' && resMessage.voiceUrl) {
      //   AudioPayManagerSingle().currentAutoPlayUrl = resMessage.voiceUrl
      // }
      let have = false
      setChatData(list => {
        const newList = []
        list.map(item => {
          if (item.replyUid === resMessage.replyUid) {
            console.log('reitem:', item, resMessage)
            item = { ...resMessage }
            if (!have) {
              newList.push(item)
            }
            have = true
          } else {
            newList.push(item)
          }
        })
        // console.log('reitem:', newList)
        return have ? [...newList] : [resMessage, ...newList]
      })
      if (
        !have &&
        resMessage.type === 'REPLY' &&
        resMessage?.voiceUrl?.length > 0 &&
        !AudioPayManagerSingle().currentAutoPlayUrl
      ) {
        AudioPayManagerSingle().currentAutoPlayUrl = resMessage?.voiceUrl
      }
      flatList.current?.scrollToIndex?.({ index: 0 })
    }
    SocketStreamManager().currentBot = botStore.getState()
  }, [])

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
    return chatData
    if (isPending.current && chatData?.length > 0) {
      const newList = [
        { type: 'LOADING', id: randomId, replyUid: currentSendMsgInfo.current?.data?.uid, botId: id },
        ...chatData,
      ]
      console.log('addResponse:', newList)
      return newList
    } else {
      return chatData
    }
  }, [chatData, isPending.current, randomId])
  if (loading) return <ShellLoading></ShellLoading>
  return (
    <ChatContext.Provider value={{ value: chatPageValue, setValue: setChatPageValue }}>
      <Container
        haveHistory={chatData.length > 0}
        inputTextProps={{
          uid,
          userId,
          pinned,
          setAuInfo,
          durationMillis,
          startRecording,
          stopRecording,
          onSubmitEditing: v => {},
          onEndEditText: (value: any) => {
            if (value.length === 0) {
              Alert.alert('Please enter your message')
              return true
            }
            if (!AudioPayManagerSingle().netInfo?.isConnected) {
              Alert.alert('Please check your network connection')
              return false
            }
            const reqId = uuidv4()
            SocketStreamManager().sendMessage('text_chat', {
              reqId,
              botUid: uid,
              text: value,
            })
            return true
          },
        }}
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
                <ChatItem me={profile?.avatar} logo={logo} item={item}></ChatItem>
              </View>
            )
          },
        }}
      ></Container>
    </ChatContext.Provider>
  )
}

export default React.memo(Chat)
