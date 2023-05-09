import { create } from "zustand";
import {
  createJSONStorage,
  subscribeWithSelector,
  persist,
} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import systemConfig from "../constants/System";
import {
  profile,
  getUserEnergyInfo as queryUserEnergyInfo,
} from "../api/index";
export type UserProfile = {
  id: number;
  uid: string;
  source: string;
  name?: string;
  nameTag: string;
  email?: string;
  publicAddress?: string;
  avatar?: string;
  isNftAvatar: boolean;
  default: false;
  level: number;
  isPasscard: boolean;
  isGenesisPasscard: boolean;
};
export type UserBaseInfo = {
  token: string;
  expiration: number;
  userId: number;
  userUid: string;
};
export type UserEnergyInfo = {
  energy: number;
  dailyEnergy: number;
};
export type UserStore = {
  profile: UserProfile;
  userEnergyInfo: UserEnergyInfo;
  userBaseInfo: UserBaseInfo;
  particleInfo: any;
};
const name = "user-store";

const useUserStore = create(
  subscribeWithSelector(
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
);

/** 监听token改变，改变获取用户相关信息 */
useUserStore.subscribe(
  (state) => state?.userBaseInfo?.token,
  (val) => {
    // 同步token到本地存储
    AsyncStorage.setItem(systemConfig.authKey, val || "");
    if (val) {
      getProfile();
      getUserEnergyInfo();
    }
  },
  {
    fireImmediately: true,
  }
);
/** 获取用户信息 */
export const getProfile = () => {
  return profile().then((res: any) => {
    useUserStore.setState({ profile: res });
  });
};
/** 获取用户电力值 */
export const getUserEnergyInfo = () => {
  return queryUserEnergyInfo().then((res: any) => {
    useUserStore.setState({ userEnergyInfo: res as UserEnergyInfo });
  });
};

export default useUserStore;
