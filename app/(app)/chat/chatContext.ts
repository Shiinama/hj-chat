import { createContext } from "react";

export type ChatPageState = {
  selectedItems?: string[];
  pageStatus?: "normal" | "sharing";
};

export const ChatContext = createContext<{
  value: ChatPageState;
  setValue: (val: ChatPageState) => void;
}>(null);
