import { useFonts } from 'expo-font'
import { SplashScreen } from 'expo-router'
import { useEffect, useMemo } from 'react'
import { Provider as XiaoshuProvider, Toast } from '@fruits-chain/react-native-xiaoshu'
import { Provider as AuthProvider } from '../context/auth'
import NetInfo from '@react-native-community/netinfo'
import { CustomStack } from './CustomStack'
import { customThemeVar } from '../constants/theme'
import { ensureDirExists } from '../utils/filesystem'
import AudioPayManagerSingle from '../components/chat/audioPlayManager'
import * as Updates from 'expo-updates'
import { Alert } from 'react-native'
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(auth)',
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SF-Pro.ttf'),
  })
  const eventListener = async event => {
    if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
      Alert.alert('Update available', 'Keep your app up to date to enjoy the latest features', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Install',
          onPress: async () => {
            try {
              await Updates.fetchUpdateAsync()
              await Updates.reloadAsync()
            } catch (error) {
              alert(`Error fetching latest Expo update: ${error}`)
            }
          },
        },
      ])
    }
  }
  Updates.useUpdateEvents(eventListener)

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])
  // 添加useMemo

  useEffect(() => {
    // 虽然这里没有问题，但是如果使用了Vpn后，判断就失效了,只能接口检查
    const unsubscribe = NetInfo.addEventListener(state => {
      AudioPayManagerSingle().netInfo = state
      if (!state.isConnected) {
        Toast('Please check your network connection')
      }
    })
    ensureDirExists()
    return () => unsubscribe()
  }, [])

  const RootLayoutView = useMemo(() => {
    return <RootLayoutNav />
  }, [])

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && RootLayoutView}
    </>
  )
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
  )
}
