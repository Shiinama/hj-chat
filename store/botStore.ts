import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { BotInfo } from "../types/BotTypes";
// Chat列表的Bot信息
const name = "bot-store";

const botStore = create(
  persist<{ botBaseInfo: BotInfo }>(
    () => ({
      botBaseInfo: {} as BotInfo,
    }),
    {
      storage: createJSONStorage(() => AsyncStorage),
      name: name,
    },
  ),
);

export default botStore;
