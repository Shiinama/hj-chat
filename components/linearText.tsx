import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'

export default function LinearText({ text, styles }) {
  return (
    <View>
      <Text numberOfLines={1} ellipsizeMode="tail" style={{ ...styles, maxWidth: '70%', height: 0, opacity: 0 }}>
        {text}
      </Text>
      <MaskedView
        style={{ height: '100%', flex: 1 }}
        maskElement={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles}>
              {text}
            </Text>
          </View>
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
