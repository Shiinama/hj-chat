import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native'
import { useSnapshot } from 'valtio'

import { ModalCtrl } from '@web3modal/react-native/src/controllers/ModalCtrl'
import { LightTheme } from '@web3modal/react-native/src/constants/Colors'
import { AccountCtrl } from '@web3modal/react-native/src/controllers/AccountCtrl'
import { ClientCtrl } from '@web3modal/react-native/src/controllers/ClientCtrl'

interface Props {
  style?: StyleProp<ViewStyle>
}

export function WallectButton({ style }: Props) {
  const { isConnected } = useSnapshot(AccountCtrl.state)
  const { initialized } = useSnapshot(ClientCtrl.state)

  return (
    <TouchableOpacity onPress={() => ModalCtrl.open()} style={[styles.container, style]} disabled={!initialized}>
      <Text style={styles.text}>Connect</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    width: 150,
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
  },
  text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
})
