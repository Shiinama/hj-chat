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
import { Alert, Platform } from 'react-native'
import CallBackManagerSingle from '../../utils/CallBackManager'
import { arrayBufferToBase64, concatBuffer } from '../../utils/base64'
import AudioFragmentPlay from './audioFragmentPlay'
import AudioPayManagerSingle from './audioPlayManager'
import { saveAudio } from '../../utils/audioFile'
import debounce from 'lodash/debounce'
export class SocketStream {
  private socket: Socket

  private currentTextStream: { [key: string]: string } = {}

  private currentAudioStream: { [key: string]: ArrayBuffer } = {}

  private onTextStreamUpdate: { [key: string]: (item: MessageStreamText) => void } = {}

  private onAudioStreamUpdate: { [key: string]: (item: MessageStreamText, url: string, timeout?: boolean) => void } = {}

  private onTransalteMessage: { [key: string]: (item: MessageDto) => void } = {}

  private onMessageRes: { [key: string]: (item: MessageDto) => void } = {}

  onResMessage: (item: MessageDto) => void

  onMessageClear: (item: MessageDto) => void

  onResMessageCreated: (item: MessageDto) => void

  onMessageStreamStart: (item: MessageStreamText) => void

  onSendMessage: (item: MesageSucessType) => void

  onUpdateMessage: (item: MessageDto) => void

  private playFragment = new AudioFragmentPlay()

  private audioStreamPlayKeys: Array<string> = []

  private audioStreamIndex = -1

  private streamTimeout: { [key: string]: NodeJS.Timeout } = {}

  currentBot

  constructor() {
    this.currentTextStream = {}
    this.init()
  }

  ready(): boolean {
    return this.socket && this.socket.connected
  }

  init() {
    if (this.ready()) {
      return
    }
    this.socket?.disconnect()
    // 初始化删除本地mp3文件
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
    this.socket.on(MsgEvents.REPLY_MESSAGE_CREATED, e => this.onMessageReplyCreated(e))
    this.socket.on(MsgEvents.RESET_MEMORY, e => this.onMessageContextClear(e))

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

    this.onSendMessage?.(data)
  }

  private onMessageTextStream(data: MessageStreamTextRes) {
    if (this.currentBot?.botBaseInfo.id !== data.data?.replyMessage?.botId) return
    // 其它机器人也接收，如果跟A发起会话，正在接收一个长文，现在又去喝B发起会话，再回到A还需要用到这个消息
    this.addTextStream(data)
  }

  async PlatformAudioSet(data, msgKey) {
    if (Platform.OS === 'ios') {
      return await saveAudio({
        audio: arrayBufferToBase64(this.currentAudioStream[msgKey]),
        botId: data.data?.replyMessage?.botId,
        index: data.data?.index,
        replyUid: data?.data?.replyMessage?.replyUid,
      })
    } else {
      return `data:audio/mp3;base64,${arrayBufferToBase64(this.currentAudioStream[msgKey])}`
    }
  }

  private async onMessageReplyCreated({ data }: MesageSucessType) {
    if (this.currentBot?.botBaseInfo.id !== data.botId) return
    this.onResMessageCreated(data)
  }

  private async onMessageAudioStream(data: MessageStreamTextRes) {
    if (this.currentBot?.botBaseInfo.id !== data.data?.replyMessage?.botId) return
    try {
      const msg = data?.data
      // 待回复消息的机器人和哪一条消息
      const msgKey = msg.replyMessage?.botId + '&BOT&' + msg.replyMessage?.replyUid
      if (!msg.isFinal && msg.index === 0) {
        if (this.playFragment.isPlaying() && this.audioStreamIndex < 0) {
          AudioPayManagerSingle().stop()
        }
        if (!this.audioStreamPlayKeys.includes(msgKey)) {
          this.audioStreamPlayKeys.push(msgKey)
        }

        this.playFragment = undefined
        this.playFragment = new AudioFragmentPlay()
        this.currentAudioStream[msgKey] = msg.audio
      } else if (msg.audio) {
        this.currentAudioStream[msgKey] = concatBuffer(this.currentAudioStream[msgKey], msg.audio)
      }
      if (this.streamTimeout[msgKey]) {
        clearTimeout(this.streamTimeout[msgKey])
        this.streamTimeout[msgKey] = undefined
      }
      // 如果没完成继续添加超时检测
      if (!msg.isFinal) {
        this.streamTimeout[msgKey] = setTimeout(() => {
          this.onAudioStreamUpdate[msgKey]?.(resMsg, uri, true)
        }, 1000 * 120)
      }

      const resMsg = { ...msg, msgLocalKey: msgKey }

      // 当前消息的uri
      const uri = await this.PlatformAudioSet(data, msgKey)

      this.onAudioStreamUpdate[msgKey]?.(resMsg, uri)
      if (msg.isFinal) {
        // 下载完到本地就删除缓存
        delete this.currentAudioStream[msgKey]
        delete this.onAudioStreamUpdate[msgKey]
      }
      // if (Object.keys(this.currentAudioStream).length > 0) {
      //   this.playFragment.addSoundUrl(msg.audio ? uri : undefined, data.data?.isFinal)
      // }
    } catch (error) {}
  }
  private onMessageReplied({ data }: MesageSucessType) {
    CallBackManagerSingle().execute('botList')
    if (this.currentBot?.botBaseInfo.id !== data.botId) return
    const msgKey = data?.botId + '&BOT&' + data?.replyUid
    this.onMessageRes[msgKey](data)
  }
  private onMessageTranslated({ data }: MesageSucessType) {
    if (this.currentBot?.botBaseInfo.id !== data.botId) return
    const msgKey = data?.botId + '&BOT&' + data?.replyUid
    this.onTransalteMessage[msgKey](data)
  }
  private onMessageContextClear(data: MesageSucessType['data']) {
    // @ts-ignore
    if (this.currentBot?.botBaseInfo.id !== data.message.botId) return
    // @ts-ignore
    this.onMessageClear?.(data.message)
  }
  private onEnergyInfo({ data }: MesageSucessType) {}

  private onMessageUpdated({ data }: MesageSucessType) {
    if (this.currentBot.botBaseInfo.id !== data.botId) return
    this.onUpdateMessage(data)
  }

  async sendMessage(ChatEvent, data) {
    if (!this.socket || !this.socket?.connected) {
      this.init()
    }
    this.socket.emit(ChatEvent, data)
  }

  playStreamNext1 = debounce(this.playStreamNext, 200)

  playStreamNext() {
    if (this.audioStreamPlayKeys?.length > 0 && this.audioStreamIndex < this.audioStreamPlayKeys.length - 1) {
      this.audioStreamIndex += 1
      CallBackManagerSingle().execute('play_' + this.audioStreamPlayKeys[this.audioStreamIndex])
    } else {
      this.audioStreamIndex = -1
      this.audioStreamPlayKeys = []
    }
  }

  isPlayStreaming() {
    return this.audioStreamIndex >= 0
  }

  getCurrentPlayStream() {
    if (this.audioStreamIndex < this.audioStreamPlayKeys.length) {
      return this.audioStreamPlayKeys[this.audioStreamIndex]
    }
    return undefined
  }

  resetPlayStream() {
    this.audioStreamIndex = -1
    this.audioStreamPlayKeys = []
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

  addAudioStreamCallBack(key: string, callBack: (item: MessageStreamText, url: string, timeout?: boolean) => void) {
    delete this.onAudioStreamUpdate[key]
    this.onAudioStreamUpdate[key] = callBack
  }

  addResMessagesCallBack(key: string, callBack: (item: MessageDto) => void) {
    delete this.onMessageRes[key]
    this.onMessageRes[key] = callBack
  }

  addTranslatedCallBack(key: string, callBack: (item: MessageDto) => void) {
    delete this.onTransalteMessage[key]
    this.onTransalteMessage[key] = callBack
  }

  removeTextStreamCallBack(key: string) {
    delete this.onTextStreamUpdate[key]
  }

  removeresMessagesCallBack(key: string) {
    delete this.onMessageRes[key]
  }

  removeTranslatedCallBack(key: string) {
    delete this.onTransalteMessage[key]
  }

  removeAudioStreamCallBack(key: string) {
    delete this.onAudioStreamUpdate[key]
    delete this.currentAudioStream[key]
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
    // 没有用户信息就取消初始化
    if (destory && instance) {
      instance.destory()
      // 销毁删除本地mp3文件
      return instance
    }
    if (instance) return instance
    instance = new SocketStream()
    return instance
  }
})()

export default SocketStreamManager
