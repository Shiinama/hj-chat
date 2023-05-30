import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useCallback, memo } from 'react'
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
// import Slider from '@react-native-community/slider'
import { Slider } from '@miblanchard/react-native-slider'
import { Audio, AVPlaybackStatus } from 'expo-av'
import MessagePlay from '../../assets/images/chat/message_play.svg'
import Messagepause from '../../assets/images/chat/message_pause.svg'
import ShellLoading from '../common/loading'
import AudioPayManagerSingle from './audioPlayManager'
import { formatTime } from '../../utils/time'
import { Toast } from '@fruits-chain/react-native-xiaoshu'
import SocketStreamManager from './socketManager'
type AudioType = {
  audioFileUri: string
  showControl?: boolean
  onPlay?: (playing: boolean) => void
}

const AudioMessage = forwardRef(({ audioFileUri, showControl = true, onPlay }: AudioType, ref) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const refPlaying = useRef<boolean>(false)
  const [currentPosition, setCurrentPosition] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [loadFail, setLoadFail] = useState(false)
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  // 全局录音单点播放控制
  const soundManager = useRef(AudioPayManagerSingle())

  useImperativeHandle(ref, () => ({
    handlePlayPause,
    loadRefreshSound,
    playFragment,
    setLoading,
    setSound,
    setIsPlaying,
  }))

  const playFragment = (params: { dur: number; total: number }) => {
    setCurrentPosition(params.dur)
    if (duration < params.total) {
      setDuration(params.total)
    }
  }

  const isStartSoundRefresh = useRef({
    start: false,
    finish: false,
    end: false,
  })

  const loadRefreshSound = async (finish?: boolean) => {
    if (sound) {
      isStartSoundRefresh.current.start = true
      isStartSoundRefresh.current.finish = finish
      try {
        console.log('loadRefreshSound', finish, audioFileUri.length)
        // await sound.unloadAsync()
      } catch (e) {
        console.log('loadRefreshSoundunloadAsyncerror:', e)
      }
    }
  }
  const setSlideFnc = useCallback(status => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0)
    }
    // 100ms执行一次，获取时间也需要加100，遇到一秒钟的录音播放有将近50的误差，再加50
    if (status.isLoaded && refPlaying.current && status.positionMillis - status.durationMillis + 50 >= 0) {
      setIsPlaying(() => false)
      soundManager.current.stop()
      setCurrentPosition(() => {
        return 0
      })
    } else if (status.isLoaded && status.isPlaying) {
      setCurrentPosition(status.positionMillis || 0)
    }
  }, [])
  const loadSound = useCallback(async () => {
    if (!audioFileUri) return
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioFileUri },
        { progressUpdateIntervalMillis: 16 },
        status => {
          setSlideFnc(status)
        }
      )
      soundManager.current.currentSound = sound
      soundManager.current.currentAutoPlayUrl = audioFileUri
      setSound(sound)
      setLoading(false)
    } catch (e) {
      // load sound fail [Error: com.google.android.exoplayer2.audio.AudioSink$InitializationException: AudioTrack init failed 0 Config(22050, 4, 11026)]
      /**
       * 音频解码错误，源于无法创建音轨。手机的音轨资源是有限的，如果每个视频都占用一个音轨并且不释放的话，就会导致上述问题。
       * https://zhuanlan.zhihu.com/p/627702119
       */
      console.log('load sound fail', e, 'url:', audioFileUri)
      setLoading(false)
      setLoadFail(true)
    }
  }, [audioFileUri])

  useEffect(() => {
    loadSound()
  }, [audioFileUri])

  // 每次进来获取状态
  useEffect(() => {
    if (sound !== null) {
      sound.getStatusAsync().then(async status => {
        if (status.isLoaded) {
          setCurrentPosition(status.positionMillis || 0)
          setDuration(status.durationMillis || 0)
        }
      })
    }
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  const playSound = async () => {
    setLoading(false)
    let opSuccess = false
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    })
    // 单点播放控制，第二参数是当点击其他的录音播放是把当前状态设置为false
    opSuccess = await soundManager.current.play(
      sound,
      function () {
        setIsPlaying(false)
      },
      function () {
        setIsPlaying(true)
      }
    )
    return opSuccess
  }

  const handlePlayPause = async () => {
    if (sound !== null) {
      if (isPlaying) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
        })

        soundManager.current.pause()
      } else {
        await playSound()
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
      await soundManager.current.currentSound.setPositionAsync(value)
    }
  }

  if (loadFail)
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={{ paddingHorizontal: 15 }}
        onPress={() => {
          loadSound()
        }}
      >
        <Text style={{ color: '#333' }}>AudioCannotPlay</Text>
      </TouchableOpacity>
    )

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {showControl && (
          <TouchableOpacity onPress={handlePlayPause}>
            {loading ? (
              <ShellLoading></ShellLoading>
            ) : isPlaying ? (
              <Messagepause height={32} width={32} />
            ) : (
              <MessagePlay height={32} width={32} />
            )}
          </TouchableOpacity>
        )}
        <Text style={styles.time}>{formatTime(currentPosition) + '/' + formatTime(duration)}</Text>
      </View>
      <View
        style={{
          flex: 1,
          marginRight: 20,
        }}
      >
        <Slider
          minimumValue={0}
          minimumTrackTintColor={'black'}
          thumbTintColor={'black'}
          maximumValue={duration}
          value={currentPosition}
          thumbStyle={{ width: 5, height: 5 }}
          trackStyle={{ height: 2 }}
          onValueChange={value => {
            handleChange(value[value.length - 1])
          }}
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
    width: 263,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',

    maxHeight: 38,
  },
  slider: {
    height: 5,
    width: 250,
  },
  time: {
    marginHorizontal: 8,
    fontSize: 12,
  },
})

export default memo(AudioMessage)
