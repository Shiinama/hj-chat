import { Button, StyleSheet, Text, View } from 'react-native'

import { Audio } from 'expo-av'
import { Recording } from 'expo-av/build/Audio'
import { useState } from 'react'
import AudioMessage from '../../components/chat/audioMessage'
export default function TabAudioScreen() {
  const [audioUrl, setAudioUrl] = useState<string>()
  const [recording, setRecording] = useState<Recording>()
  /** 录音 */
  async function startRecording() {
    try {
      /** 获取权限 */
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      console.log('Starting recording..')
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      setRecording(recording)
      console.log('Recording started')
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }
  /** 录音结束 */
  async function stopRecording() {
    setRecording(undefined)
    await recording.stopAndUnloadAsync()
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    })
    const uri = recording.getURI()
    setAudioUrl(uri)
  }

  async function playSounds(url) {
    const { sound: playbackObject } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true })
    playbackObject.playAsync()
  }
  console.log()
  return (
    <View style={styles.container}>
      {audioUrl ? (
        <View>
          <Text style={styles.title}>{audioUrl}</Text>
          <Button
            title="播放"
            onPress={() => {
              console.log(audioUrl)
              playSounds(audioUrl)
            }}
          />
        </View>
      ) : null}

      <Button title={recording ? '录音结束' : '开始录音'} onPress={recording ? stopRecording : startRecording} />
      <AudioMessage audioFileUri={audioUrl} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
