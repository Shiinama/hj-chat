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
import { arrayBufferToBase64, concatBuffer, deleteAll, getAudioFileUrl, saveAudio } from '../../utils/audioFile'
import AudioFragmentPlay from './audioFragmentPlay'
import AudioPayManagerSingle from './audioPlayManager'

export class SocketStream {
  private socket: Socket

  private currentTextStream: { [key: string]: string } = {}

  private currentAudioStream: { [key: string]: ArrayBuffer } = {}

  private onTextStreamUpdate: { [key: string]: (item: MessageStreamText) => void } = {}

  private onAudioStreamUpdate: { [key: string]: (item: MessageStreamText, url: string) => void } = {}

  private onTransalteMessage: { [key: string]: (item: MessageDto) => void } = {}

  private onUpdateMessage: { [key: string]: (item: MessageDto) => void } = {}

  private reqIds: Set<string> = new Set()

  onMessageStreamStart: (item: MessageStreamText) => void

  onResMessage: (item: MessageDto) => void

  onSendMessage: (item: MesageSucessType) => void

  onPending: (pending: boolean) => void

  private playFragment = new AudioFragmentPlay()

  private timeClearPending: NodeJS.Timeout

  currentBot

  constructor() {
    this.currentTextStream = {}
    this.init()
  }

  private init() {
    // 初始化删除本地mp3文件
    deleteAll()
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

  getPlayFragment() {
    return this.playFragment
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
    if (this.currentBot?.botBaseInfo.id !== data.data.botId) return
    if (data?.reqId) {
      this.addReqIds(data?.reqId)
    }
    this.onSendMessage?.(data)
    CallBackManagerSingle().execute('botList')
  }

  private onMessageTextStream(data: MessageStreamTextRes) {
    // console.log('onMessageTextStream-----', data, this.currentBot?.id !== data?.data?.data?.botId)
    // 其它机器人也接收，如果跟A发起会话，正在接收一个长文，现在又去喝B发起会话，再回到A还需要用到这个消息
    this.addTextStream(data)
  }

  async saveSingleAudio(data: MessageStreamTextRes) {
    if (!data.data?.audio) {
      return
    }
    try {
      const res = await saveAudio({
        audio: arrayBufferToBase64(data.data?.audio),
        botId: data.data?.replyMessage?.botId,
        replyUid: data?.data?.replyMessage?.replyUid + '_' + data?.data?.index,
      })
      this.playFragment.addSoundUrl(res)
    } catch (error) {}
  }

  private async onMessageAudioStream(data: MessageStreamTextRes) {
    try {
      const msg = data?.data
      // 待回复消息的机器人和哪一条消息
      const msgKey = msg.replyMessage?.botId + '&BOT&' + msg.replyMessage?.replyUid
      // 存储当前视频
      if (!msg.isFinal && msg.index === 0) {
        if (this.playFragment.isPlaying()) {
          AudioPayManagerSingle().stop()
        }
        this.playFragment = undefined
        this.playFragment = new AudioFragmentPlay()

        // const base64 = await arrayBufferToBase64(msg.audio)
        this.currentAudioStream[msgKey] = msg.audio
      } else if (msg.audio) {
        this.currentAudioStream[msgKey] = concatBuffer(this.currentAudioStream[msgKey], msg.audio)
      }
      this.saveSingleAudio(data)
      const resMsg = { ...msg, text: this.currentTextStream[msgKey], msgLocalKey: msgKey }
      if (msg.audio) {
        try {
          const res = await saveAudio({
            audio: arrayBufferToBase64(this.currentAudioStream[msgKey]),
            botId: data.data?.replyMessage?.botId,
            replyUid: data?.data?.replyMessage?.replyUid,
          })
          // console.log('mp3res:', res)
        } catch (e) {
          console.log('mp3error:', e)
        }
      }
      // 回调给单独某一条消息
      this.onAudioStreamUpdate[msgKey]?.(
        resMsg,
        getAudioFileUrl(data.data?.replyMessage?.botId, data?.data?.replyMessage?.replyUid)
      )
      // if (msg.index === 0) {
      //   this.onMessageStreamStart?.(resMsg)
      // }
      // console.log('addTextStream', msgKey, this.onTextStreamUpdate, resMsg)
      if (msg.isFinal) {
        // 下载完到本地就删除缓存
        delete this.currentAudioStream[msgKey]
        delete this.onAudioStreamUpdate[msgKey]
      }
    } catch (error) {
      console.log('error:', error)
    }
  }
  private onMessageReplied({ data, reqId }: MesageSucessType) {
    if (this.currentBot?.botBaseInfo.id !== data.botId) return
    if (reqId) {
      // removeReqIds(reqId)
      this.removeReqIds(reqId)
    }
    this.onResMessage?.(data)
    CallBackManagerSingle().execute('botList')
  }
  private onMessageTranslated({ reqId, data }: MesageSucessType) {
    if (this.currentBot?.botBaseInfo.id !== data.botId) return
    const msgKey = data?.botId + '&BOT&' + data?.replyUid
    this.onTransalteMessage[msgKey](data)
  }
  private onEnergyInfo({ reqId, data }: MesageSucessType) {}

  private onMessageUpdated({ data }: MesageSucessType) {
    if (this.currentBot?.botBaseInfo.id !== data.botId) return
    const msgKey = data?.botId + '&BOT&' + data?.replyUid
    this.onUpdateMessage[msgKey](data)
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
    // console.log(msgKey, 'msgKey')
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

  addTranslatedCallBack(key: string, callBack: (item: MessageDto) => void) {
    delete this.onTransalteMessage[key]
    this.onTransalteMessage[key] = callBack
  }
  addUpdateMessageCallBack(key: string, callBack: (item: MessageDto) => void) {
    delete this.onUpdateMessage[key]
    this.onUpdateMessage[key] = callBack
  }

  removeTextStreamCallBack(key: string) {
    delete this.onTextStreamUpdate[key]
  }

  removeTranslatedCallBack(key: string) {
    delete this.onTransalteMessage[key]
  }

  removeUpdateMessageCallBack(key: string) {
    delete this.onUpdateMessage[key]
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
      // 销毁删除本地mp3文件
      deleteAll()
      return instance
    }
    if (instance) return instance
    instance = new SocketStream()
    return instance
  }
})()

export default SocketStreamManager
