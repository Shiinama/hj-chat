import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
type ListDataItem = {
  id: number
  uid: string
  name: string
  description: string
  userId: number
  logo: string
  language: string
  energyPerChat: number
  pinned: boolean
  lastInteractionDate: string
}
const name = 'bot-store'

const botStore = create(
  persist<ListDataItem>(() => ({} as any), {
    storage: createJSONStorage(() => AsyncStorage),
    name: name,
  })
)

export default botStore
