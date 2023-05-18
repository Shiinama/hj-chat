import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'

export default function LinearText({ text, styles, fontSize = 12 }) {
  return (
    <View style={{ width: text.length * fontSize }}>
      <MaskedView style={{ flex: 1 }} maskElement={<Text style={styles}>{text}</Text>}>
        <LinearGradient
          colors={['#7a2ef6', '#f62ee2']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </MaskedView>
    </View>
  )
}
