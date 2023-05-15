import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useCallback } from 'react'
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
import Slider from '@react-native-community/slider'
import { Audio, AVPlaybackStatus } from 'expo-av'
import MessagePlay from '../../assets/images/chat/message_play.svg'
import Messagepause from '../../assets/images/chat/message_pause.svg'
import ShellLoading from '../loading'
import AudioPayManagerSingle from './audioPlayManager'
import { formatTime } from '../../utils/time'
type AudioType = {
  audioFileUri: string
  slideWidth?: number
  showControl?: boolean
  onPlay?: (playing: boolean) => void
}

const AudioMessage = forwardRef(({ audioFileUri, showControl = true, onPlay, slideWidth = 140 }: AudioType, ref) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const refPlaying = useRef<boolean>(false)
  const [currentPosition, setCurrentPosition] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [loadFail, setLoadFail] = useState(false)
  // 全局录音单点播放控制
  const soundManager = useRef(AudioPayManagerSingle())
  useImperativeHandle(ref, () => ({
    handlePlayPause,
  }))
  const loadSound = useCallback(async () => {
    setLoading(true)
    setLoadFail(false)
    console.log('aaa')
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioFileUri })
      setSound(sound)
      setLoadFail(false)
    } catch (e) {
      console.log('load sound fail', e, 'url:', audioFileUri)
      setLoadFail(true)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!audioFileUri) return
    // const loadSound = async () => {
    //   setLoading(true)
    //   setLoadFail(false)
    //   try {
    //     const { sound } = await Audio.Sound.createAsync({ uri: audioFileUri })
    //     setSound(sound)
    //     setLoadFail(false)
    //   } catch (e) {
    //     setLoadFail(true)
    //   }
    //   setLoading(false)
    // }
    loadSound()
    return () => {
      soundInterval.current && clearInterval(soundInterval.current)
    }
  }, [])

  useEffect(() => {
    if (sound !== null) {
      sound.getStatusAsync().then(status => {
        if (status.isLoaded) {
          setCurrentPosition(status.positionMillis || 0)
          setDuration(status.durationMillis || 0)
          if (audioFileUri == AudioPayManagerSingle().currentAutoPlayUrl) {
            handlePlayPause()
            // 自动播放后清空自动播放的url
            AudioPayManagerSingle().currentAutoPlayUrl = undefined
          }
        }
      })
    }
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  const soundInterval = useRef<NodeJS.Timer>()

  /**
   * 从sound初始化完成就开始计时器 修改为 只有当播放的时候一个才启用计时器，停止播放就注销计时器，
   * 不然有多少条数据就会有多少个计时器，会卡主线程和内存持续上涨 会崩溃
   */
  const startPlayInterval = () => {
    soundInterval.current && clearInterval(soundInterval.current)
    soundInterval.current = setInterval(async () => {
      if (sound !== null) {
        const status: AVPlaybackStatus = await sound.getStatusAsync()
        if (status.isLoaded) {
          setCurrentPosition(status.positionMillis || 0)
          setDuration(status.durationMillis || 0)
        }
        if (status.isLoaded && refPlaying.current && status.positionMillis - status.durationMillis + 20 >= 0) {
          soundInterval.current && clearInterval(soundInterval.current)
          setCurrentPosition(() => {
            return 0
          })
          setIsPlaying(() => false)
          soundManager.current.stop()
        }
      }
    }, 100)
  }

  const handlePlayPause = async () => {
    soundInterval.current && clearInterval(soundInterval.current)
    if (sound !== null) {
      if (isPlaying) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
        })

        soundManager.current.pause()
      } else {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        })
        // 单点播放控制，第二参数是当点击其他的录音播放是把当前状态设置为false
        soundManager.current.play(
          sound,
          function () {
            setIsPlaying(false)
            soundInterval.current && clearInterval(soundInterval.current)
          },
          function () {
            setIsPlaying(true)
            startPlayInterval()
          }
        )
        startPlayInterval()
      }
      setIsPlaying(() => !isPlaying)
    }
  }

  useEffect(() => {
    onPlay?.(isPlaying)
    refPlaying.current = isPlaying
  }, [isPlaying])

  const handleChange = async (value: number) => {
    if (sound !== null) {
      await sound.setPositionAsync(value)
      setCurrentPosition(value)
    }
  }

  if (!loading && loadFail)
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={{ paddingHorizontal: 15 }}
        onPress={() => {
          loadSound()
        }}
      >
        <Text style={{ color: '#333' }}>Reload</Text>
      </TouchableOpacity>
    )

  if (loading) return <ShellLoading></ShellLoading>
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {showControl && (
          <TouchableOpacity onPress={handlePlayPause}>
            {isPlaying ? <Messagepause height={32} width={32} /> : <MessagePlay height={32} width={32} />}
          </TouchableOpacity>
        )}
        <Text style={styles.time}>{formatTime(currentPosition) + '/' + formatTime(duration)}</Text>
      </View>
      <View
        style={{
          position: 'relative',
          left: -55,
          transform: [{ scale: 0.5 }],
        }}
      >
        <Slider
          style={styles.slider}
          minimumValue={0}
          minimumTrackTintColor={'black'}
          thumbTintColor={'black'}
          maximumValue={duration}
          value={currentPosition}
          onValueChange={handleChange}
        />
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: '100%',

    maxHeight: 38,
  },
  slider: {
    height: 10,
    width: 250,
  },
  time: {
    marginHorizontal: 8,
    fontSize: 12,
  },
})

export default AudioMessage
