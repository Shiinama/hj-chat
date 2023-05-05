import { View } from 'react-native'
import { Loading } from '@fruits-chain/react-native-xiaoshu'

function ShellLoading() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Loading color="#7A2EF6" type="spinner" />
    </View>
  )
}

export default ShellLoading
