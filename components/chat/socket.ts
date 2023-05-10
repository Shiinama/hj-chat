import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import SysConfig from '../../constants/System'
import { Alert } from 'react-native'

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
  const [message, setMessage] = useState<any>()
  const [resMessage, setResMessage] = useState<any>()
  const [translationMessage, setTranslation] = useState<any>()
  const [updateMessage, setUpdateMessage] = useState<any>()
  const ready = (): boolean => {
    return SocketIoRef.current && SocketIoRef.current.connected
  }
  const init = () => {
    if (ready()) return
    SocketIoRef.current = io(`${SysConfig.baseUrl}/chat`, {
      path: '/ws',
      transports: ['websocket'],
      auth: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeVNoZWxsVGVzdCIsInN1YiI6MzA2LCJhdWQiOiJNeVNoZWxsVGVzdCIsIm5iZiI6MCwiaWF0IjoxNjgzMzM5OTY1MDczLCJqdGkiOiI2MTc1ZDNhMmNjYmE0NWFjYTc2NDc0MDhmYzY1MjllZiIsInNlY3VyaXR5U3RhbXAiOiI1NGMwYWY2Mzk5NTQ0M2EzYjViNGU0MzU4MGNhYjU3NSIsImV4cCI6MTY4MzM0MjU1NzA3M30.C79OLS9eWvDLiEv9ZqDbeoDmJs7AhmnrijHnAnunzx8',
      },
    })
    SocketIoRef.current.on(MsgEvents.MSG_ERROR, onMessageError)
    SocketIoRef.current.on(MsgEvents.EXCEPTION, onException)

    SocketIoRef.current.on(MsgEvents.MSG_SENT, onMessageSent)
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
    setMessage(data)
  }
  const onMessageReplied = ({ reqId, data }: MesageSucessType) => {
    setResMessage(data)
  }
  const onMessageTranslated = ({ reqId, data }: MesageSucessType) => {
    setTranslation(data)
  }
  const onEnergyInfo = ({ reqId, data }: MesageSucessType) => {}
  const onMessageUpdated = ({ data }: MesageSucessType) => {
    setUpdateMessage(data)
  }

  const sendMessage = (ChatEvent, data) => {
    SocketIoRef.current.emit(ChatEvent, data)
  }

  useEffect(() => {
    init()
    return () => SocketIoRef.current.disconnect()
  }, [])
  return [
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
  ]
}
