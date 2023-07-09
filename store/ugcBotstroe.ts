import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { UGCBotInfo } from "../types/BotTypes";

// 创意工坊的Bot信息
const name = "ugc-bot-store";

const botStore = create(
  persist<UGCBotInfo>(() => ({} as UGCBotInfo), {
    storage: createJSONStorage(() => AsyncStorage),
    name: name,
  }),
);

export default botStore;
