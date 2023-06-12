import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import Lottie from 'lottie-react-native'
import { Text, View, StyleSheet } from 'react-native'
import { forwardRef } from 'react'
import { formatTime } from '../../utils/time'

function AudioAnimation(_, ref) {
  // console.log('aare-render:', 'AudioAnimation')
  const [durMills, setDurMills] = useState(0)
  const animationRef = useRef<Lottie>(null)
  useImperativeHandle(ref, () => ({
    stopAnimation,
    startAnimation,
    resumeAnimation,
    updateDurationMillis,
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

  function updateDurationMillis(durationMillis: number) {
    setDurMills(durationMillis)
  }

  return (
    <View style={styles.animation}>
      <Text style={{ color: 'white', marginRight: 20 }}>{formatTime(durMills)}</Text>
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
    marginTop: 15,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
})
export default forwardRef(AudioAnimation)
