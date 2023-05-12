import React, { useImperativeHandle, useRef } from 'react'
import Lottie from 'lottie-react-native'
import { Text, View, StyleSheet } from 'react-native'
import { forwardRef } from 'react'
function AudioAnimation(props, ref) {
  const animationRef = useRef<Lottie>(null)
  useImperativeHandle(ref, () => ({
    stopAnimation,
    startAnimation,
    resumeAnimation,
  }))
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
  function resumeAnimation() {
    if (animationRef.current) {
      animationRef.current.resume()
    }
  }
  return (
    <View style={styles.animation}>
      <Text style={{ color: 'white', marginRight: 20 }}>30</Text>
      <Lottie
        style={{ height: 52 }}
        ref={animationRef}
        source={require('../../utils/lottie/wave.json')}
        // autoPlay
        loop
      />
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
export default forwardRef(AudioAnimation)
