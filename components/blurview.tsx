import React from 'react'
import { View, StyleSheet, Text, TextStyle } from 'react-native'

interface BlurTextProps {
  text: string
  blurRadius: number
  fontSize?: number
  fontWeight?: TextStyle['fontWeight']
}

const BlurText: React.FC<BlurTextProps> = ({ text, blurRadius, fontSize = 18, fontWeight = 'normal' }) => {
  return (
    <View style={styles.container}>
      {/* 普通文字 */}
      <Text style={[{ fontSize, fontWeight }, styles.text]}>{text}</Text>
      {/* 使用模糊文字 */}
      <Text
        style={[
          { fontSize, fontWeight, color: '#fff' },
          styles.text,
          styles.overlayText,
          { textShadowRadius: blurRadius, textShadowColor: '#000', opacity: 0.4 },
        ]}
      >
        {text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    overflow: 'hidden',
  },
  text: {
    color: '#333',
    textShadowOffset: { width: 0, height: 0 },
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  overlayText: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
})

export default BlurText
