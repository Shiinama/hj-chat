import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from 'react-native'

export default function LinearText({ text, styles }) {
  console.log(text, styles)
  return (
    <MaskedView style={{ height: 32, flexDirection: 'row' }} maskElement={<Text style={styles}>{text}</Text>}>
      <LinearGradient colors={['#7a2ef6', '#f62ee2']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
    </MaskedView>
  )
}
