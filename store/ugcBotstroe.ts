import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
type ListDataItem = {
  id: number
  uid: string
  name: string
  description: string
  userId: number
  language: string
  status: string
  energyPerChat: number
}
const name = 'ugc-bot-store'

const botStore = create(
  persist<ListDataItem>(
    () => ({
      description: null,
      energyPerChat: 2,
      id: 19,
      status: '',
      language: 'Japanese',
      name: '悠介',
      uid: 'd753b21b0167463d9f02e4173eebac18',
      userId: 1,
    }),
    {
      storage: createJSONStorage(() => AsyncStorage),
      name: name,
    }
  )
)

export default botStore
