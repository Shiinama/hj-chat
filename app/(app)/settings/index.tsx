import { Button, Dialog, Toast } from '@fruits-chain/react-native-xiaoshu'
import { useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'
import { useAuth } from '../../../context/auth'
import Signout from '../../../assets/images/profile/signout.svg'
import Deactivate from '../../../assets/images/profile/deactivate.svg'
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
        style={{ alignItems: 'center' }}
        renderLeftIcon={() => <Signout></Signout>}
        type="ghost"
        text="Sign Out"
        onPress={signOut}
        danger
      />
      <Button
        style={{ alignItems: 'center', marginTop: 10 }}
        renderLeftIcon={() => <Deactivate></Deactivate>}
        type="ghost"
        text="Deactivate Account"
        onPress={() => {
          Dialog.confirm({
            title: 'Warning',
            message:
              'Are you sure to deactivate this account? Be aware that all associated data will be permanently removed upon deactivation.',
            confirmButtonColor: '#F30',
            confirmButtonText: 'confrim',
            cancelButtonText: 'cancel',
          }).then(action => {
            if (action === 'confirm') {
              const { close } = Toast.loading({ message: 'Deactivating', duration: 0 })
              signOut()
              close()
            }
          })
        }}
        danger
      />
    </View>
  )
}
