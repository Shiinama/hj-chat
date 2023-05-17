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
import CallBackManagerSingle from '../../utils/CallBackManager'
const RecordButton = ({
  audioFileUri,
  startRecording,
  stopRecording,
  setIsShow,
  setAuInfo,
  setShowAni,
  setAudioFileUri,
  recordMaxSecond,
  durationMillis,
  isShow,
  AnimationRef,
}) => {
  if (isShow) return null
  const [sound, setSound] = useState(null)
  const [buttonState, setButtonState] = useState('penddingRecording')
  const [isSound, setIsSound] = useState(false)
  const playing = useRef(false)

  function handlestartRecording() {
    Audio.requestPermissionsAsync().then(({ granted }) => {
      if (!granted) {
        alert('请允许访问麦克风以录制音频！请到设置中')
      } else {
        AudioPayManagerSingle().pause(true)
        const success = startRecording()
        if (success) {
          AudioPayManagerSingle().isRecording = true
          setShowAni(false)
          setButtonState('recording')
          setTimeout(() => {
            AnimationRef?.current?.startAnimation()
          }, 100)
        }
      }
    })
  }

  useEffect(() => {
    playing.current = isSound
  }, [isSound])

  const stopRecord = async () => {
    AudioPayManagerSingle().isRecording = false
    const uri = await stopRecording()
    const { sound } = await Audio.Sound.createAsync({ uri }, {}, (status: any) => {
      if (status.positionMillis >= status.durationMillis && status.durationMillis > 0) {
        try {
          setIsSound(false)
          AnimationRef?.current?.stopAnimation?.()
          AnimationRef?.current?.updateDurationMillis?.(status.durationMillis)
          AudioPayManagerSingle().stop()
        } catch (error) {}
        // sound.pauseAsync()
      } else if (playing.current) {
        // 播放时间暂时不显示
        // const offMil = isNaN(status.durationMillis - status.positionMillis)
        //   ? 0
        //   : status.durationMillis - status.positionMillis
        // AnimationRef?.current?.updateDurationMillis?.(offMil < 0 ? 0 : offMil)
      }
    })
    try {
      setSound(sound)
      setAudioFileUri(uri)
      setButtonState('playing')
      AnimationRef?.current?.stopAnimation?.()
    } catch (error) {}
  }

  // useEffect(() => {
  //   if (durationMillis && recordMaxSecond && durationMillis / 1000 >= recordMaxSecond) {
  //     stopRecord()
  //   }
  // }, [durationMillis])

  useEffect(() => {
    CallBackManagerSingle().add('recordingChangeBtn', (durationMill: number) => {
      AnimationRef?.current?.updateDurationMillis?.(durationMill)
      if (durationMill && recordMaxSecond && durationMill >= recordMaxSecond * 1000) {
        CallBackManagerSingle().remove('recordingChangeBtn')
        stopRecord()
      }
    })
    return () => {
      CallBackManagerSingle().remove('recordingChangeBtn')
    }
  }, [])

  const playSound = () => {
    if (!isSound) {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      })
      AudioPayManagerSingle().play(sound, () => {
        console.log('AudioPayManagerSingle sttop')
        setIsSound(() => false)
        AnimationRef?.current?.stopAnimation?.()
      })
      AnimationRef?.current?.startAnimation?.()
    } else {
      AudioPayManagerSingle().pause()
      AnimationRef?.current?.stopAnimation?.()
    }
    setIsSound(!isSound)
  }

  const playOrPauseIcon = () => {
    switch (buttonState) {
      case 'penddingRecording':
        return (
          <>
            <Text style={{ color: '#A0AEC0', paddingTop: 20, paddingBottom: 5 }}>Tap to record</Text>
            <TouchableOpacity style={styles.recordButton} onPress={handlestartRecording}>
              <Huatong height={40} width={40} color="red" />
            </TouchableOpacity>
          </>
        )
      case 'recording':
        return (
          <TouchableOpacity
            style={{ ...styles.recordButton, marginTop: 32 }}
            onPress={async () => {
              stopRecord()
            }}
          >
            <View style={{ backgroundColor: 'red', width: 14, height: 14, borderRadius: 2 }}></View>
          </TouchableOpacity>
        )
      case 'playing':
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 32 }}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={async () => {
                try {
                  if (isSound) {
                    AudioPayManagerSingle().stop()
                    AnimationRef?.current?.stopAnimation?.()
                  }
                } catch (error) {}
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
              style={{ ...styles.palyButton, marginHorizontal: 30 }}
              onPress={async () => {
                playSound()
                //
              }}
            >
              {!isSound ? <Pause></Pause> : <Play></Play>}
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
          </View>
        )
    }
  }
  console.log('isSOund:', isSound)
  return <View style={styles.container}>{playOrPauseIcon()}</View>
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row',
    height: 50,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    width: 50,
    height: 50,
    borderRadius: 40,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  palyButton: {
    width: 50,
    height: 50,
    borderRadius: 40,
    flexDirection: 'row',
    backgroundColor: '#e7d9f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButton: {
    width: 40,
    height: 40,
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

export default React.memo(RecordButton)
