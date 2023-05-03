import React, { useRef } from 'react'
import { StyleSheet, Animated, Easing, TouchableOpacity, Text } from 'react-native'
import Huatong from '../../assets/images/chat/huatong.svg'

const RecordButton = ({ isRecording, startRecording, stopRecording }) => {
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

  function handlePressIn() {
    // onPress()
    animateScaleOut()
    startRecording()
  }

  function handlePressOut() {
    // RecordButton()
    animateScaleIn()
    stopRecording()
  }

  return (
    <TouchableOpacity style={styles.container} onPressIn={handlePressIn} onPressOut={handlePressOut}>
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
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'center',
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
