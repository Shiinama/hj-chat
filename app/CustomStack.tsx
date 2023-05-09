import {
  // Import the creation function
  createStackNavigator,
  // Import the types
  StackNavigationOptions,
} from "@react-navigation/stack";

import { withLayoutContext } from "expo-router";

const { Navigator } = createStackNavigator();

// This can be used like `<CustomStack />`
export const CustomStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator
>(Navigator);
