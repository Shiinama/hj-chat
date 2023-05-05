import { View } from 'react-native'
import { Spinner } from '@ui-kitten/components'
function ShellLoading() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Spinner size="large" />
    </View>
  )
}

export default ShellLoading
