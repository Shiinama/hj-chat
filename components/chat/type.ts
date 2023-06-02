export interface MessageDto {
  streaming?: boolean
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

export interface MessageStreamText {
  data: MessageDto
  replyMessage?: MessageDto
  audio?: ArrayBuffer
  index?: number
  isFinal?: boolean
  text?: string
  msgLocalKey?: string
}

export interface MessageStreamTextRes {
  data: MessageStreamText
  reqId: string
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
  REPLY_MESSAGE_CREATED = 'reply_message_created',
}

export type MeaageErrorType = {
  reqId?: string
  message?: string
}

export type MesageSucessType = {
  reqId: string
  data: MessageDto
}
