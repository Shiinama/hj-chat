import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { Slot, SplashScreen, Stack, useNavigation, useSegments } from 'expo-router'
import { useEffect } from 'react'
import * as eva from '@eva-design/eva'

import { Provider as XiaoshuProvider } from '@fruits-chain/react-native-xiaoshu'
import { Provider as AuthProvider } from '../context/auth'

import { ApplicationProvider } from '@ui-kitten/components'
import { TouchableOpacity, Platform, StatusBar } from 'react-native'
import { CustomStack } from './CustomStack'
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(auth)',
}

export default function RootLayout() {
  console.log(useSegments())
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
  return (
    <AuthProvider>
      <ApplicationProvider {...eva} theme={eva.light}>
        <XiaoshuProvider>
          <CustomStack
            screenOptions={{
              header: () => null,
              headerShown: false,
            }}
          >
            <Slot></Slot>
          </CustomStack>
        </XiaoshuProvider>
      </ApplicationProvider>
    </AuthProvider>
  )
}
