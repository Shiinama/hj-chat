import React, { useImperativeHandle, useRef } from 'react'
import Lottie from 'lottie-react-native'
import { Text, View, StyleSheet } from 'react-native'
import { forwardRef } from 'react'
export default function Animation(props, ref) {
  const animationRef = useRef<Lottie>(null)
  // useImperativeHandle(ref, () => ({
  //   stopAnimation,
  //   startAnimation
  // }))
  function stopAnimation() {
    if (animationRef.current) {
      animationRef.current.reset()
    }
  }
  function startAnimation() {
    if (animationRef.current) {
      animationRef.current.play()
    }
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.animation}>
        <Text style={{ color: 'white', marginRight: 20 }}>30</Text>
        <Lottie
          style={{ height: 52 }}
          ref={animationRef}
          source={require('../../utils/lottie/wave.json')}
          autoPlay
          loop
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  animation: {
    flexDirection: 'row',
    borderRadius: 60,
    width: 240,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
})
// forwardRef(Animation)
