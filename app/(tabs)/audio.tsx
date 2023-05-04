import React from 'react'
import { StyleSheet, View } from 'react-native'
import BlurText from '../../components/blurview'

export default function App() {
  return (
    <View style={styles.container}>
      <BlurText text="这是一段模糊的文本" blurRadius={10} fontSize={24} fontWeight="bold" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
