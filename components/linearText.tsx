import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { Text, View, Dimensions } from 'react-native'

const width = Dimensions.get('window').width - 150
export default function LinearText({ text, styles }) {
  return (
    <View>
      <Text numberOfLines={1} ellipsizeMode="tail" style={{ ...styles, height: 0 }}>
        {text}
      </Text>
      <MaskedView
        style={{ height: styles.lineHeight }}
        maskElement={
          <Text numberOfLines={1} ellipsizeMode="tail" style={{ ...styles, width }}>
            {text}
          </Text>
        }
      >
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
