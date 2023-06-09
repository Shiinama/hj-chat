import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";

import {
  getUserEnergyInfo as queryUserEnergyInfo,
  profile,
} from "../api/index";
import {
  getUserConnectedAccounts,
  UserConnectedAccounts,
} from "../api/proofile";
import systemConfig from "../constants/System";
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
  /** 用户信息，头像名字等 */
  profile: UserProfile;
  /** 用户电力值信息 */
  userEnergyInfo: UserEnergyInfo;
  /** */
  userConnectedAccounts: UserConnectedAccounts;
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
        userConnectedAccounts: null,
        userBaseInfo: null,
        particleInfo: null,
      }),
      {
        storage: createJSONStorage(() => AsyncStorage),
        name: name,
      },
    ),
  ),
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
  },
);
/** 获取用户信息 */
export const getProfile = () => {
  return profile().then((res: any) => {
    useUserStore.setState({ profile: res });
  });
};
/** 获取用户电力值 */
export const getUserEnergyInfo = () => {
  return queryUserEnergyInfo().then((res) => {
    // @ts-ignore
    useUserStore.setState({ userEnergyInfo: res });
  });
};

/** 获取用户已连接的app账号 */
export const getConnections = () => {
  getUserConnectedAccounts().then((res) => {
    // @ts-ignore
    useUserStore.setState({ userConnectedAccounts: res });
  });
};

export default useUserStore;
