import { Button } from '@fruits-chain/react-native-xiaoshu'
import { useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'
import { useAuth } from '../../../context/auth'
import Signout from '../../../assets/images/profile/signout.svg'
export default function Settings() {
  const { signOut } = useAuth()
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      title: 'Setting',
      headerTitleAlign: 'center',
    })
  }, [])
  return (
    <View style={{ margin: 20 }}>
      <Button
        style={{ alignItems: 'flex-start' }}
        renderLeftIcon={() => <Signout></Signout>}
        type="ghost"
        text="Sign Out"
        onPress={signOut}
        danger
      />
    </View>
  )
}
