import { Stack, useNavigation } from 'expo-router'
import { Platform, TouchableOpacity } from 'react-native'
import Back from '../../assets/images/tabbar/back.svg'

export default function AppLayout() {
  const navigation = useNavigation()
  return (
    <Stack
      screenOptions={{
        headerLeft: () => {
          if (Platform.OS === 'android') return null
          return (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Back></Back>
            </TouchableOpacity>
          )
        },
      }}
    ></Stack>
  )
}
