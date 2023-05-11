export type ListItem = {
  id: number
  uid: string
  userId?: number
  userUid?: string
  status?: string
  type?: string
  replyUid?: string | null
  text?: string
  translation?: string | null
  voiceUrl?: string | null
  botId?: number
  content?: string
  createdDate?: string
  updatedDate?: string
  botUid?: string
}
export type List = ListItem[]
