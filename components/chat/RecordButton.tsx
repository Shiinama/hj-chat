import React, { useRef, useState } from 'react'
import { StyleSheet, Animated, Easing, TouchableOpacity, Text } from 'react-native'
import Huatong from '../../assets/images/chat/huatong.svg'
import { Audio } from 'expo-av'

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

  function handlePressIn() {
    Audio.requestPermissionsAsync().then(({ granted }) => {
      if (!granted) {
        alert('请允许访问麦克风以录制音频！请到设置中')
      } else {
        // 如果手速过快正在录音再去点会录音失败
        if (!isRecording) {
          setIsRecording(true)
          animateScaleOut()
          startRecording()
        }
      }
    })
  }

  async function handlePressOut() {
    if (isRecording) {
      setIsRecording(false)
      animateScaleIn()
      if (stopRecording) {
        const uri = await stopRecording()
        console.log(uri)
        setAudioFileUri(uri)
      }
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
