import { Stack, useNavigation } from 'expo-router'
import { Platform, TouchableOpacity, StyleSheet } from 'react-native'
import Back from '../../assets/images/tabbar/back.svg'

export default function AppLayout() {
  const navigation = useNavigation()
  return (
    <Stack
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerLeft: () => {
          return (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
              <Back></Back>
            </TouchableOpacity>
          )
        },
      }}
    ></Stack>
  )
}
const styles = StyleSheet.create({
  back: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
