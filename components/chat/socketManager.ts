import { io, Socket } from 'socket.io-client'
import {
  MeaageErrorType,
  MesageSucessType,
  MessageDto,
  MessageStreamText,
  MessageStreamTextRes,
  MsgEvents,
} from './type'
import SysConfig from '../../constants/System'
import useUserStore from '../../store/userStore'
import { Alert } from 'react-native'
import CallBackManagerSingle from '../../utils/CallBackManager'
import { arrayBufferToBase64, saveAudio } from '../../utils/audioFile'

export class SocketStream {
  private socket: Socket

  private currentTextStream: { [key: string]: string } = {}

  private currentAudioStream: { [key: string]: string } = {}

  private onTextStreamUpdate: { [key: string]: (item: MessageStreamText) => void } = {}

  private onAudioStreamUpdate: { [key: string]: (item: MessageStreamText, url: string) => void } = {}

  private reqIds: Set<string> = new Set()

  onMessageStreamStart: (item: MessageStreamText) => void

  onResMessage: (item: MessageDto) => void

  onUpdateMessage: (item: MessageDto) => void
  onTransalteMessage: (item: MessageDto) => void

  onSendMessage: (item: MesageSucessType) => void

  onPending: (pending: boolean) => void

  private timeClearPending: NodeJS.Timeout

  currentBot

  constructor() {
    this.currentTextStream = {}
    this.init()
  }

  private init() {
    const { userBaseInfo } = useUserStore.getState()
    const token = userBaseInfo?.token ?? SysConfig.token
    this.socket = io(`${SysConfig.baseUrl}/chat`, {
      path: '/ws',
      transports: ['websocket'],
      auth: {
        token,
      },
    })
    this.socket.on(MsgEvents.MSG_ERROR, e => this.onMessageError(e))
    this.socket.on(MsgEvents.EXCEPTION, e => this.onException(e))

    this.socket.on(MsgEvents.MSG_SENT, e => this.onMessageSent(e))
    this.socket.on(MsgEvents.MSG_TEXT_STREAM, e => this.onMessageTextStream(e))
    this.socket.on(MsgEvents.MSG_AUDIO_STREAM, e => this.onMessageAudioStream(e))
    this.socket.on(MsgEvents.MSG_REPLIED, e => this.onMessageReplied(e))
    this.socket.on(MsgEvents.MSG_UPDATED, e => this.onMessageUpdated(e))
    this.socket.on(MsgEvents.MSG_TRANSLATED, e => this.onMessageTranslated(e))

    this.socket.on(MsgEvents.ENERGY_INFO, e => this.onEnergyInfo(e))
    this.socket.on(MsgEvents.NO_ENOUGH_ENERGY, e => this.onNoEnoughEnergy(e))
  }

  private onMessageError({ message }: MeaageErrorType) {
    Alert.alert(message)
  }

  private onException({ message }: MeaageErrorType) {
    Alert.alert(message)
  }
  private onNoEnoughEnergy({ message }: MeaageErrorType) {
    Alert.alert(message)
  }

  private onMessageSent(data: MesageSucessType) {
    if (this.currentBot?.id !== data.data.botId) return
    if (data?.reqId) {
      // addReqIds(data?.reqId)
      this.addReqIds(data?.reqId)
    }
    this.onSendMessage?.(data)
    CallBackManagerSingle().execute('botList')
    // setMessage(data)
  }

  private onMessageTextStream(data: MessageStreamTextRes) {
    // console.log('onMessageTextStream-----', data, this.currentBot?.id !== data?.data?.data?.botId)
    // 其它机器人也接收，如果跟A发起会话，正在接收一个长文，现在又去喝B发起会话，再回到A还需要用到这个消息
    this.addTextStream(data)
    // if (this.currentBot?.id !== data?.data?.replyMessage?.botId) {
    //   return
    // } else {
    //   this.addTextStream(data)
    // }
  }
  private async onMessageAudioStream(data: MessageStreamTextRes) {
    console.log('----audio', data)
    try {
      // const msg = data?.data
      // const msgKey = msg.replyMessage?.botId + '&BOT&' + msg.replyMessage?.replyUid
      // msg?.audio.blob?.().then(blob => {
      //   const fileReader = new FileReader()
      //   fileReader.onload = e => {
      //     const base64Img = e.target?.result
      //     console.log(e)
      //   }
      //   fileReader.readAsDataURL(blob)
      // })
      // if (!msg.isFinal && msg.index === 0) {
      //   this.currentAudioStream[msgKey] = arrayBufferToBase64(msg.audio)
      // } else {
      //   this.currentAudioStream[msgKey] += arrayBufferToBase64(msg.audio)
      // }
      // const resMsg = { ...msg, text: this.currentTextStream[msgKey], msgLocalKey: msgKey }
      // const res = await saveAudio({
      //   audio: data.data?.audio,
      //   botId: data.data?.replyMessage?.botId,
      //   replyUid: data?.data?.replyMessage?.replyUid,
      // })
      // console.log('mp3res:', res)
      // this.onAudioStreamUpdate[msgKey]?.(resMsg, res)
      // if (msg.index === 0) {
      //   this.onMessageStreamStart?.(resMsg)
      // }
      // // console.log('addTextStream', msgKey, this.onTextStreamUpdate, resMsg)
      // if (msg.isFinal) {
      //   delete this.currentAudioStream[msgKey]
      //   delete this.onAudioStreamUpdate[msgKey]
      // }
    } catch (error) {}
    // if (this.currentBot?.id !== data.data.botId) return
  }
  private onMessageReplied({ data, reqId }: MesageSucessType) {
    if (this.currentBot.id !== data.botId) return
    if (reqId) {
      // removeReqIds(reqId)
      this.removeReqIds(reqId)
    }
    this.onResMessage?.(data)
    CallBackManagerSingle().execute('botList')
    // setResMessage(data)
  }
  private onMessageTranslated({ reqId, data }: MesageSucessType) {
    if (this.currentBot.id !== data.botId) return
    // setTranslation(data)
    this.onTransalteMessage(data)
  }
  private onEnergyInfo({ reqId, data }: MesageSucessType) {}

  private onMessageUpdated({ data }: MesageSucessType) {
    if (this.currentBot.id !== data.botId) return
    // setUpdateMessage(data)
    this.onUpdateMessage(data)
  }

  private removeReqIds(reqId: string) {
    this.reqIds.delete(reqId)
    this.onPending?.(this.reqIds.size > 0)
  }

  private addReqIds(reqId: string) {
    this.reqIds.add(reqId)
    this.onPending?.(true)
    this.timeClearPending && clearTimeout(this.timeClearPending)
    this.timeClearPending = setTimeout(() => {
      this.reqIds.clear()
      this.onPending?.(false)
    }, 10000)
  }

  sendMessage(ChatEvent, data) {
    if (!this.socket || !this.socket?.connected) {
      this.init()
    }
    this.socket.emit(ChatEvent, data)
  }

  private addTextStream(msgRes: MessageStreamTextRes) {
    const msg = msgRes?.data
    const msgKey = msg.replyMessage?.botId + '&BOT&' + msg.replyMessage?.replyUid
    if (!msg.isFinal && msg.index === 0) {
      this.currentTextStream[msgKey] = ''
    }
    this.currentTextStream[msgKey] += msg.text
    const resMsg = { ...msg, text: this.currentTextStream[msgKey], msgLocalKey: msgKey }
    this.onTextStreamUpdate[msgKey]?.(resMsg)
    if (msg.index === 0) {
      this.onMessageStreamStart?.(resMsg)
    }
    // console.log('addTextStream', msgKey, this.onTextStreamUpdate, resMsg)
    if (msg.isFinal) {
      delete this.currentTextStream[msgKey]
      delete this.onTextStreamUpdate[msgKey]
    }
  }

  getMessageTextStream(key: string) {
    return this.currentTextStream[key]
  }

  getMessageAudioStream(key: string) {
    return this.currentAudioStream[key]
  }

  addTextStreamCallBack(key: string, callBack: (item: MessageStreamText) => void) {
    delete this.onTextStreamUpdate[key]
    this.onTextStreamUpdate[key] = callBack
  }

  addAudioStreamCallBack(key: string, callBack: (item: MessageStreamText, url: string) => void) {
    delete this.onAudioStreamUpdate[key]
    this.onAudioStreamUpdate[key] = callBack
  }

  removeTextStreamCallBack(key: string) {
    delete this.onTextStreamUpdate[key]
  }

  removeAudioStreamCallBack(key: string) {
    delete this.onTextStreamUpdate[key]
  }

  destory() {
    if (this.socket?.connected) {
      this.socket?.disconnect()
      this.socket = undefined
    }
  }
}

const SocketStreamManager = (function () {
  let instance: SocketStream
  return function (destory?: boolean) {
    if (destory && instance) {
      instance.destory()
      return instance
    }
    if (instance) return instance
    instance = new SocketStream()
    return instance
  }
})()

export default SocketStreamManager
