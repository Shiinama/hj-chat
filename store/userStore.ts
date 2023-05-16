import { create } from 'zustand'
import { createJSONStorage, subscribeWithSelector, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image } from 'expo-image'
import systemConfig from '../constants/System'
import { profile, getUserEnergyInfo as queryUserEnergyInfo } from '../api/index'
import { genAvatarUrl } from '../components/profileInfo/helper'
import { getUserConnectedAccounts, UserConnectedAccounts } from '../api/proofile'
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
  /** 用户信息，头像名字等 */
  profile: UserProfile
  /** 用户电力值信息 */
  userEnergyInfo: UserEnergyInfo
  /** */
  userConnectedAccounts: UserConnectedAccounts
  userBaseInfo: UserBaseInfo
  particleInfo: any
}
const name = 'user-store'

const useUserStore = create(
  subscribeWithSelector(
    persist<UserStore>(
      () => ({
        profile: null,
        userEnergyInfo: null,
        userConnectedAccounts: null,
        userBaseInfo: null,
        particleInfo: null,
      }),
      {
        storage: createJSONStorage(() => AsyncStorage),
        name: name,
      }
    )
  )
)

/** 监听token改变，改变获取用户相关信息 */
useUserStore.subscribe(
  state => state?.userBaseInfo?.token,
  val => {
    // 同步token到本地存储
    AsyncStorage.setItem(systemConfig.authKey, val || '')
    if (val) {
      getProfile()
      getUserEnergyInfo()
    }
  },
  {
    fireImmediately: true,
  }
)
/** 获取用户信息 */
export const getProfile = () => {
  return profile()
    .then((res: any) => {
      try {
        if (res?.avatar) {
          Image.prefetch(genAvatarUrl(res?.avatar))
        }
      } catch (error) {
        console.log(error)
      }
      useUserStore.setState({ profile: res })
    })
    .catch(e => {
      console.log(e)
    })
}
/** 获取用户电力值 */
export const getUserEnergyInfo = () => {
  return queryUserEnergyInfo().then((res: any) => {
    useUserStore.setState({ userEnergyInfo: res as UserEnergyInfo })
  })
}

/** 获取用户已连接的app账号 */
export const getConnections = () => {
  getUserConnectedAccounts().then(res => {
    useUserStore.setState({ userConnectedAccounts: res })
  })
}

export default useUserStore
