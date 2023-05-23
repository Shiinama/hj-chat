import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { Text, View, Dimensions } from 'react-native'

export default function LinearText({ text, styles }) {
  return (
    <View>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ ...styles, maxWidth: Dimensions.get('screen').width - 180, height: 0 }}
      >
        {text}
      </Text>
      <MaskedView
        maskElement={
          <Text numberOfLines={1} ellipsizeMode="tail" style={{ ...styles }}>
            {text}
          </Text>
        }
      >
        <View style={{ height: styles.lineHeight, flexDirection: 'row', justifyContent: 'center' }}>
          <LinearGradient
            colors={['#7a2ef6', '#f62ee2']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </View>
      </MaskedView>
    </View>
  )
}
