import Myshell from "@assets/images/myshell.png";
import {
  Button,
  Provider as XiaoshuProvider,
  Toast,
} from "@fruits-chain/react-native-xiaoshu";
import useUpdateChecker from "@hooks/useUpdateChecker";
import NetInfo from "@react-native-community/netinfo";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { SplashScreen } from "expo-router";
import * as Updates from "expo-updates";
import { useEffect, useMemo } from "react";
import { Text } from "react-native";
import { Screen } from "react-native-screens";

import AudioPayManagerSingle from "../components/chat/audioPlayManager";
import { customThemeVar } from "../constants/theme";
import { Provider as AuthProvider } from "../context/auth";
import { ensureDirExists } from "../utils/filesystem";
import { CustomStack } from "./CustomStack";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SF-Pro.ttf"),
  });
  const { newSoftUpdate } = useUpdateChecker();

  useEffect(() => {
    if (error) throw error;
  }, [error]);
  // 添加useMemo

  useEffect(() => {
    // 虽然这里没有问题，但是如果使用了Vpn后，判断就失效了,只能接口检查
    const unsubscribe = NetInfo.addEventListener((state) => {
      AudioPayManagerSingle().netInfo = state;
      if (!state.isConnected) {
        Toast("Please check your network connection");
      }
    });
    ensureDirExists();
    return () => unsubscribe();
  }, []);

  const RootLayoutView = useMemo(() => {
    if (newSoftUpdate) {
      return (
        <Screen
          style={{
            backgroundColor: "transitionScreen",
            padding: 20,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 20, fontWeight: "600", textAlign: "center" }}
          >
            Hay una nueva versión disponible
          </Text>
          <Image style={{ width: 200, height: 200 }} source={Myshell}></Image>
          <Button
            round
            style={{ width: 200 }}
            onPress={Updates.reloadAsync}
            type="primary"
          >
            Actualizar
          </Button>
        </Screen>
      );
    }
    return <RootLayoutNav />;
  }, [newSoftUpdate]);

  return (
    <>
      {!loaded && <SplashScreen />}
      {loaded && RootLayoutView}
    </>
  );
}

function RootLayoutNav() {
  return (
    <XiaoshuProvider theme={customThemeVar}>
      <AuthProvider>
        <CustomStack
          screenOptions={{
            header: () => null,
            headerShown: false,
          }}
        />
      </AuthProvider>
    </XiaoshuProvider>
  );
}
