import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { withLayoutContext } from "expo-router";

export const Stack = createNativeStackNavigator();
const { Navigator } = Stack;
// This can be used like `<CustomStack />`
export const CustomStack = withLayoutContext(Navigator);
