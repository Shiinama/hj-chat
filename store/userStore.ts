import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
export type UserProfile = {
  id: number
  uid: string
  source: string
  name?: string
  nameTag: string
  email?: string
  publicAddress?: string
  avatar?: string
  isNftAvatar: boolean
  default: false
  level: number
  isPasscard: boolean
  isGenesisPasscard: boolean
}
export type UserBaseInfo = {
  token: string
  expiration: number
  userId: number
  userUid: string
}
export type UserEnergyInfo = {
  energy: number
  dailyEnergy: number
}
export type UserStore = {
  profile: UserProfile
  userEnergyInfo: UserEnergyInfo
  userBaseInfo: UserBaseInfo
  particleInfo: any
}
const name = 'user-store'

const useUserStore = create(
  persist<UserStore>(
    () => ({
      profile: null,
      userEnergyInfo: null,
      userBaseInfo: null,
      particleInfo: null,
    }),
    {
      storage: createJSONStorage(() => AsyncStorage),
      name: name,
    }
  )
)

export default useUserStore
