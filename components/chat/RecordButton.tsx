import React, { useRef, useState } from 'react'
import { StyleSheet, Animated, Easing, TouchableOpacity, Text } from 'react-native'
import Huatong from '../../assets/images/chat/huatong.svg'

const RecordButton = ({ startRecording, stopRecording, setAudioFileUri }) => {
  const [isRecording, setIsRecording] = useState(false)
  const recordButtonScale = useRef(new Animated.Value(1)).current
  function animateScaleOut() {
    Animated.timing(recordButtonScale, {
      toValue: 0.8,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start()
  }

  function animateScaleIn() {
    Animated.timing(recordButtonScale, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start()
  }

  function handlePressIn(e) {
    // onPress()
    setIsRecording(true)
    animateScaleOut()
    startRecording()
  }

  async function handlePressOut(e) {
    setIsRecording(false)
    // RecordButton()
    animateScaleIn()
    if (stopRecording) {
      const uri = await stopRecording()
      setAudioFileUri(uri)
    }
  }

  return (
    <TouchableOpacity style={styles.container} onLongPress={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[styles.recordButton, isRecording && styles.isRecording, { transform: [{ scale: recordButtonScale }] }]}
      >
        <Huatong color="white" />
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  recordButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  isRecording: {
    backgroundColor: '#F44336',
  },
  recordingIndicator: {
    marginTop: 20,
    fontSize: 20,
  },
})

export default RecordButton
