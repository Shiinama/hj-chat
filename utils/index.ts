import { Platform } from "react-native";

export function camelToSnake(camelCase: string): string {
  return camelCase.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export const isAndroid = Platform.OS === "android";
export const isIos = Platform.OS === "ios";
