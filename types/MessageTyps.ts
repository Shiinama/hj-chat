interface StreamDetail {
  replyMessage: MessageDetail
  index: number
  isFinal: boolean
}
export interface TextStreamDetail extends StreamDetail {
  text: string
}

export interface AudioStreamDetail extends StreamDetail {
  audio: ArrayBuffer
}

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

export enum MessageStatusEnum {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export enum MessageTypeEnum {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  REPLY = 'REPLY',
  RESET = 'RESET',
  LOADING = 'LOADING',
}

export interface MessageDetail {
  id: number
  uid: string
  userId: number
  userUid: string
  status: MessageStatusEnum
  type: MessageTypeEnum
  text: string
  translation?: string
  botId: number
  botUid: string
  streaming?: boolean
  voiceUrl?: string
  replyUid?: string
  createTimeStamp?: number
  textStream?: TextStreamDetail[]
  audioStream?: AudioStreamDetail[]
}

export type MeaageErrorType = {
  reqId?: string
  message?: string
}

export type MesageSucessType = {
  reqId: string
  data: MessageDetail
}
