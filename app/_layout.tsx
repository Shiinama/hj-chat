import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { Slot, SplashScreen, Stack, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import * as eva from '@eva-design/eva'

import { Provider as XiaoshuProvider } from '@fruits-chain/react-native-xiaoshu'
import { Provider as AuthProvider } from '../context/auth'

import Back from '../assets/images/tabbar/back.svg'
import { ApplicationProvider } from '@ui-kitten/components'
import { TouchableOpacity } from 'react-native'
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(auth)',
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  )
}

function RootLayoutNav() {
  const navigation = useNavigation()
  return (
    // <AuthProvider>
    <ApplicationProvider {...eva} theme={eva.light}>
      <XiaoshuProvider>
        <Stack
          screenOptions={{
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Back></Back>
                </TouchableOpacity>
              )
            },
          }}
        >
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </XiaoshuProvider>
    </ApplicationProvider>
  )
}
