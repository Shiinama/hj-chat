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
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeVNoZWxsU3RhZ2luZyIsInN1YiI6MzExLCJhdWQiOiJNeVNoZWxsU3RhZ2luZyIsIm5iZiI6MCwiaWF0IjoxNjgzMTk4MjY3NzQ4LCJqdGkiOiJmMDEyYjE4NzdhZDc0MGI4OTVkNzZiMWE5ZGUxY2RiMiIsInNlY3VyaXR5U3RhbXAiOiJiZWFlYzA5Y2YwOTA0NjgyODk2NGU4N2JhYjcyZTBkZCIsImV4cCI6MTY4MzIwMDg1OTc0OH0.9cFaSIpmZt0Pw0A9sR9NNAPqKxr-_08JC4i5IvU0A2U',
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
    console.log(message, 'onMessageError')
    // Alert.alert(message)
  }

  const onException = ({ message }: MeaageErrorType) => {
    console.log(message, 'onException')
    Alert.alert(message)
  }
  const onNoEnoughEnergy = ({ message }: MeaageErrorType) => {
    console.log(message, 'onNoEnoughEnergy')
    Alert.alert(message)
  }

  const onMessageSent = (data: MesageSucessType) => {
    console.log(data, 'onMessageSent')
    setMessage(data)
  }
  const onMessageReplied = ({ reqId, data }: MesageSucessType) => {
    console.log(reqId, data, 'onMessageReplied')
    setResMessage(data)
  }
  const onMessageTranslated = ({ reqId, data }: MesageSucessType) => {
    console.log(reqId, data, 'onMessageTranslated')
    setTranslation(data)
  }
  const onEnergyInfo = ({ reqId, data }: MesageSucessType) => {
    console.log(reqId, data, 'onEnergyInfo')
  }
  const onMessageUpdated = ({ reqId, data }: MesageSucessType) => {
    console.log(reqId, data, 'onMessageUpdated')
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
