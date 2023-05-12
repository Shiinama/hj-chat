import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Animated, Easing, TouchableOpacity, Text } from 'react-native'
import Huatong from '../../assets/images/chat/huatong.svg'
import { Audio } from 'expo-av'
import Delete from '../../assets/images/chat/delete.svg'
import * as FileSystem from 'expo-file-system'
import { View } from 'react-native'
import Pause from '../../assets/images/chat/pause.svg'
import Play from '../../assets/images/chat/play.svg'
import Send from '../../assets/images/chat/send.svg'
import { Toast } from '@fruits-chain/react-native-xiaoshu'
import { useIntervalTime } from '../../utils/time'
import AudioPayManagerSingle from './audioPlayManager'
const RecordButton = ({
  audioFileUri,
  startRecording,
  stopRecording,
  setIsShow,
  setAuInfo,
  setShowAni,
  setAudioFileUri,
  isShow,
  AnimationRef,
}) => {
  if (isShow) return null
  const [sound, setSound] = useState(null)
  const [buttonState, setButtonState] = useState('penddingRecording')
  const [isSound, setIsSound] = useState(true)

  function handlestartRecording() {
    Audio.requestPermissionsAsync().then(({ granted }) => {
      if (!granted) {
        alert('请允许访问麦克风以录制音频！请到设置中')
      } else {
        AudioPayManagerSingle().pause(true)
        setShowAni(false)
        startRecording()
        setButtonState('recording')
        setTimeout(() => {
          AnimationRef?.current?.startAnimation()
        }, 100)
      }
    })
  }

  const playOrPauseIcon = () => {
    switch (buttonState) {
      case 'penddingRecording':
        return (
          <View style={{ alignItems: 'center' }}>
            {/* <Text style={{ color: '#A0AEC0' }}>Tap to record</Text> */}
            <TouchableOpacity style={styles.recordButton} onPress={handlestartRecording}>
              <Huatong color="red" />
            </TouchableOpacity>
          </View>
        )
      case 'recording':
        return (
          <TouchableOpacity
            style={styles.recordButton}
            onPress={async () => {
              const uri = await stopRecording()
              const { sound } = await Audio.Sound.createAsync({ uri }, {}, (status: any) => {
                if (status.positionMillis >= status.durationMillis) {
                  setIsSound(true)
                  AnimationRef.current.stopAnimation()
                  sound.stopAsync()
                  // sound.pauseAsync()
                }
              })
              setSound(sound)
              setAudioFileUri(uri)
              setButtonState('playing')
              AnimationRef.current.stopAnimation()
            }}
          >
            <View style={{ backgroundColor: 'red', width: 14, height: 14, borderRadius: 2 }}></View>
          </TouchableOpacity>
        )
      case 'playing':
        return (
          <>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={async () => {
                const { exists } = await FileSystem.getInfoAsync(audioFileUri)
                if (exists) {
                  try {
                    await FileSystem.deleteAsync(audioFileUri)
                    Toast('Deleted recording file')
                  } catch (error) {
                    Toast('Failed to delete recording file')
                  }
                }
                setAudioFileUri('')
                setIsShow(true)
                setShowAni(true)
              }}
            >
              <Delete height={20} width={20}></Delete>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.palyButton, marginHorizontal: 90 }}
              onPress={async () => {
                setIsSound(pre => {
                  if (pre) {
                    console.log(21312)
                    sound.playAsync()
                    AnimationRef.current.startAnimation()
                  } else {
                    sound.pauseAsync()
                    AnimationRef.current.stopAnimation()
                  }
                  return !pre
                })
                //
              }}
            >
              {isSound ? <Pause></Pause> : <Play></Play>}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={async () => {
                setAuInfo()
                setIsShow(true)
                setShowAni(true)
              }}
            >
              <Send height={20} width={20}></Send>
            </TouchableOpacity>
          </>
        )
    }
  }
  return <View style={styles.container}>{playOrPauseIcon()}</View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  palyButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    flexDirection: 'row',
    backgroundColor: '#e7d9f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButton: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // isRecording: {
  //   backgroundColor: '#F44336',
  // },
  recordingIndicator: {
    marginTop: 20,
    fontSize: 20,
  },
})

export default RecordButton
