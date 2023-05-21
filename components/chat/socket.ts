import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import SysConfig from '../../constants/System'
import { Alert } from 'react-native'
import useUserStore from '../../store/userStore'
import botStore from '../../store/botStore'
import { useDebounceEffect, useSet } from 'ahooks'

export enum MsgEvents {
  AUTH_FAIL = 'auth_fail',
  MSG_ERROR = 'message_error',
  MSG_SENT = 'message_sent',
  MSG_UPDATED = 'message_updated',
  MSG_TRANSLATED = 'message_translated',
  MSG_REPLIED = 'message_replied',
  ENERGY_INFO = 'energy_info',
  NO_ENOUGH_ENERGY = 'no_enough_energy',
  EXCEPTION = 'exception',
  MSG_TEXT_STREAM = 'text_stream',
  MSG_AUDIO_STREAM = 'audio_stream',
}

interface MessageDto {
  id: number

  uid: string

  userId: number

  userUid: string

  status: string

  type: string

  replyUid?: string

  text?: string

  translation?: string

  voiceUrl?: string

  botId: number

  createdDate: Date

  updatedDate: Date

  botUid: string
}

type messageStreamDataType = {
  data: {
    replyMessage: MessageDto
    index: number
    text: string
    isFinal: boolean
  }
}
type MeaageErrorType = {
  reqId?: string
  message?: string
}

type MesageSucessType = {
  reqId: string
  data: MessageDto
}

export const useSocketIo = () => {
  const SocketIoRef = useRef(null)
  const currentBot = botStore.getState()
  const [message, setMessage] = useState<any>()
  // 请求队列逻辑
  const [reqIdsQueue, { add: addReqIds, remove: removeReqIds, reset: resetReqIds }] = useSet([])
  // 是否处于请求状态
  const isPending = useMemo(() => {
    return reqIdsQueue?.size > 0
  }, [reqIdsQueue])
  // 10s状态没改变就清除队列
  useDebounceEffect(
    useCallback(() => {
      if (reqIdsQueue?.size > 0) {
        resetReqIds()
      }
    }, []),
    [reqIdsQueue],
    {
      wait: 10000,
    }
  )

  const [resMessage, setResMessage] = useState<any>()
  const [translationMessage, setTranslation] = useState<any>()
  const [updateMessage, setUpdateMessage] = useState<any>()
  const { userBaseInfo } = useUserStore.getState()
  const token = userBaseInfo?.token ?? SysConfig.token
  const ready = (): boolean => {
    return SocketIoRef.current && SocketIoRef.current.connected
  }
  const init = () => {
    if (ready()) return
    SocketIoRef.current = io(`${SysConfig.baseUrl}/chat`, {
      path: '/ws',
      transports: ['websocket'],
      auth: {
        token,
      },
    })
    SocketIoRef.current.on(MsgEvents.MSG_ERROR, onMessageError)
    SocketIoRef.current.on(MsgEvents.EXCEPTION, onException)

    SocketIoRef.current.on(MsgEvents.MSG_SENT, onMessageSent)
    SocketIoRef.current.on(MsgEvents.MSG_TEXT_STREAM, onMessageTextStream)
    SocketIoRef.current.on(MsgEvents.MSG_AUDIO_STREAM, onMessageAudioStream)
    SocketIoRef.current.on(MsgEvents.MSG_REPLIED, onMessageReplied)
    SocketIoRef.current.on(MsgEvents.MSG_UPDATED, onMessageUpdated)
    SocketIoRef.current.on(MsgEvents.MSG_TRANSLATED, onMessageTranslated)

    SocketIoRef.current.on(MsgEvents.ENERGY_INFO, onEnergyInfo)
    SocketIoRef.current.on(MsgEvents.NO_ENOUGH_ENERGY, onNoEnoughEnergy)
  }

  const onMessageError = ({ message }: MeaageErrorType) => {
    Alert.alert(message)
  }

  const onException = ({ message }: MeaageErrorType) => {
    Alert.alert(message)
  }
  const onNoEnoughEnergy = ({ message }: MeaageErrorType) => {
    Alert.alert(message)
  }

  const onMessageSent = (data: MesageSucessType) => {
    if (currentBot.id !== data.data.botId) return
    if (data?.reqId) {
      addReqIds(data?.reqId)
    }
    setMessage(data)
  }

  const onMessageTextStream = ({ data }: messageStreamDataType) => {
    if (currentBot.id !== data?.replyMessage?.botId) {
      return
    } else {
      console.log('-----', { data })
    }
  }
  const onMessageAudioStream = (data: MesageSucessType) => {
    if (currentBot.id !== data.data.botId) return
    console.log(data)
  }
  const onMessageReplied = ({ data, reqId }: MesageSucessType) => {
    if (currentBot.id !== data.botId) return
    if (reqId) {
      removeReqIds(reqId)
    }
    setResMessage(data)
  }
  const onMessageTranslated = ({ reqId, data }: MesageSucessType) => {
    if (currentBot.id !== data.botId) return
    setTranslation(data)
  }
  const onEnergyInfo = ({ reqId, data }: MesageSucessType) => {}
  const onMessageUpdated = ({ data }: MesageSucessType) => {
    if (currentBot.id !== data.botId) return
    setUpdateMessage(data)
  }

  const sendMessage = (ChatEvent, data) => {
    SocketIoRef.current.emit(ChatEvent, data)
  }

  useEffect(() => {
    init()
    return () => SocketIoRef.current.disconnect()
  }, [])
  return {
    isPending,
    message,
    resMessage,
    sendMessage,
    translationMessage,
    updateMessage,
    onMessageUpdated,
    onEnergyInfo,
    onMessageTranslated,
    onMessageReplied,
    onMessageSent,
    onException,
    onNoEnoughEnergy,
    onMessageError,
    onMessageTextStream,
  }
}
