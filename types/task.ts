import { Audio } from 'expo-av'

export enum UserTaskTypeEnum {
  dailyMessage = 'dailyMessage',
  talkToBotWithTag = 'talkToBotWithTag',
  validInvitation = 'validInvitation',
  twitterInteraction = 'twitterInteraction',
  dcLevel = 'dcLevel',
  useAutoPrompt = 'useAutoPrompt',
  useCustomVoice = 'useCustomVoice',
  tgBotInvitation = 'tgBotInvitation',
  inviteeMessage = 'inviteeMessage',
  customBotMessage = 'customBotMessage',
}

export enum UserTaskStatusEnum {
  InProgress = 'in_progress',
  Claimable = 'claimable',
  Claimed = 'claimed',
}
export interface Task {
  userId: number
  userTaskId: number
  userTaskUid: string
  seasonId: number
  taskType: UserTaskTypeEnum
  name: string
  description: string
  gemCount: number
  order: number
  active: boolean
  requiredCount: number
  status: UserTaskStatusEnum
  claimableCount?: number
  claimableGemCount?: number
  currentTaskProgress?: number
  claimedCount?: number
  claimedGemCount?: number
}

export interface SeasonInfo {
  id: number
  uid: string
  name: string
  active: boolean
  startDate: string
  endDate: string
}
export type TaskState = {
  seasonInfo: SeasonInfo | null
  setSeasonInfo(season: SeasonInfo): void
  taskList: Task[]
  seasonEndDate: string | null
  hasClaimableTask: boolean
  setTaskList(taskList: Task[]): void
  createdClainSound(): void
  clearClainSound(): void
  points: number
  setPoints: (points: number, addToClaimed?: boolean) => void
  ranking: number
  clainSound: Audio.Sound
  setRanking: (ranking: number) => void
  claimedPoints: number
  setClaimedPoints: (points: number) => void
  clearClaimedPoints: () => void
}
