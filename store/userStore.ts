import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
export type UserEnergyInfo = {
  energy: number;
  dailyEnergy: number;
};
export type UserStore = {
  profile: UserProfile;
  userEnergyInfo: UserEnergyInfo;
};
const name = "user-store";

const useUserStore = create(
  persist<UserStore>(
    () => ({
      profile: null,
      userEnergyInfo: null,
    }),
    {
      storage: createJSONStorage(() => AsyncStorage),
      name: name,
    }
  )
);

export default useUserStore;
