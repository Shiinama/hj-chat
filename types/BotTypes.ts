import { MessageDetail } from './MessageTyps'

export enum BotStatusEnum {
  Public = 'Public',
  Active = 'Active',
  Inactive = 'Inactive',
}

// 虽然看似有两个BotStore，但因为相似度太高加上产品的功能设计问题，实际上可能只用得到一个BotInfo

export interface BotInfo {
  userId: number | null
  pinned?: boolean
  id: number
  uid: string
  language: string
  logo?: string
  description: string
  name: string
  token: string
  privateBotId: number
  // bot setting
  botSetting?: {
    inputText: boolean
    inputVoice: boolean
    outputText: boolean
    outputVoice: boolean
    textMasking: boolean
    textDisplay: boolean
    textTranslation: boolean
    imageInput: boolean
    imageOutput: boolean
  }
  energyPerChat: number
  lastMessage?: MessageDetail
  status: BotStatusEnum
  tags?: Array<{ id: number; label: string }>
}

export interface UGCBotInfo {
  id: number
  userId: number
  uid: string
  language: string
  logo?: string
  name: string
  description: string
  privateBotId?: number
  pinned: boolean
  prompt?: string
  // bot setting
  botSetting?: {
    inputText: boolean
    inputVoice: boolean
    outputText: boolean
    outputVoice: boolean
    textMasking: boolean
    textDisplay: boolean
    textTranslation: boolean
    imageInput: boolean
    imageOutput: boolean
    promptAntiTheft: boolean
    isAsrMultiLanguage: boolean
    knowledgeBase: boolean
  }
  ttsUid?: string
  energyPerChat: number
  status: string
  tags: Array<{ id: number }>
}
