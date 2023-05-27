import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useCallback, memo } from 'react'
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
// import Slider from '@react-native-community/slider'
import { Slider } from '@miblanchard/react-native-slider'
import { Audio, AVPlaybackStatus } from 'expo-av'
import MessagePlay from '../../assets/images/chat/message_play.svg'
import Messagepause from '../../assets/images/chat/message_pause.svg'
import ShellLoading from '../loading'
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
  }))

  const playFragment = (params: { dur: number; total: number }) => {
    setIsPlaying(params.dur - duration >= 0 ? false : true)
    setLoading(false)
    // setCurrentPosition(params.dur - duration >= 0 ? 0 : params.dur)
    // 会回弹
    setCurrentPosition(params.dur)
    isStartSoundRefresh.current.end = params.dur - duration >= 0
    if (!isStartSoundRefresh.current.end) {
      setIsPlaying(true)
    }
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
      try {
        // console.log('loadRefreshSound')
        // const status = await sound.getStatusAsync()
        // console.log(status)
        // if (!isPlaying && !base64Info.current.isLoading) {
        //   reloadBase64()
        // }
        // const status = await sound.loadAsync(
        //   {
        //     uri: audioFileUri,
        //   },
        //   { shouldPlay: true, positionMillis: currentPosition }
        // )
        // // @ts-ignore
        // setDuration(status.durationMillis || 0)
        if (finish) {
          // 完成了就去播放一下
          // playCurrentRecevice()
        }
        // if (!isPlaying) {
        //   const success = await playSound()
        //   success && setIsPlaying(() => !isPlaying)
        // }
        // sound.playFromPositionAsync(currentPosition)
        // loadSound(true)
      } catch (error) {
        // console.log('loadRefreshSoundloadAsyncerror:', error)
      }
    }
  }
  const loadSound = useCallback(async (hideLoading?: boolean) => {
    if (!audioFileUri) return
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioFileUri }).then(res => {
        if (res.status.isLoaded && res.status.durationMillis) {
          setDuration(res.status.durationMillis)
        }
        return res
      })
      setSound(sound)
      setLoading(false)
      return true
    } catch (e) {
      // load sound fail [Error: com.google.android.exoplayer2.audio.AudioSink$InitializationException: AudioTrack init failed 0 Config(22050, 4, 11026)]
      /**
       * 音频解码错误，源于无法创建音轨。手机的音轨资源是有限的，如果每个视频都占用一个音轨并且不释放的话，就会导致上述问题。
       * https://zhuanlan.zhihu.com/p/627702119
       */
      console.log('load sound fail', e, 'url:', audioFileUri)
      setLoading(false)
      setLoadFail(true)
      return false
    }
  }, [])

  const reLoadSound = async () => {
    if (!sound) {
      loadSound()
    } else {
      try {
        await sound.unloadAsync()
      } catch (error) {}
      try {
        const res = await sound.loadAsync({ uri: audioFileUri })
        console.log('res:', res, audioFileUri.indexOf('base64') > 0)
        if (res.isLoaded && res.durationMillis) {
          setDuration(res.durationMillis)
        }
      } catch (error) {}
    }
  }

  useEffect(() => {
    reLoadSound()
  }, [audioFileUri])

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
          setDuration(status.durationMillis || 0)
        }

        // 100ms执行一次，获取时间也需要加100，遇到一秒钟的录音播放有将近50的误差，再加50
        if (status.isLoaded && refPlaying.current && status.positionMillis - status.durationMillis + 150 >= 0) {
          setIsPlaying(() => false)
          soundManager.current.stop()
          soundInterval.current && clearInterval(soundInterval.current)
          setCurrentPosition(() => {
            return 0
          })
        } else if (status.isLoaded && status.isPlaying) {
          setCurrentPosition(status.positionMillis || 0)
        }
      }
    }, 100)
  }

  const playSound = async () => {
    let opSuccess = false
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    })
    // 单点播放控制，第二参数是当点击其他的录音播放是把当前状态设置为false
    opSuccess = await soundManager.current.play(
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
    opSuccess && startPlayInterval()
    return opSuccess
  }

  const handlePlayPause = async () => {
    console.log('handlePlayPause', sound, audioFileUri)
    let opSuccess = false
    if (AudioPayManagerSingle().isRecording) {
      Toast('Recording in progress')
      return opSuccess
    }
    if (isStartSoundRefresh.current.start) {
      console.log(isStartSoundRefresh.current)
      AudioPayManagerSingle()
        .currentSound.getStatusAsync()
        .then(async status => {
          if (status.isLoaded && status.isPlaying) {
            AudioPayManagerSingle().currentSound.pauseAsync()
            setIsPlaying(() => false)
          } else if (status.isLoaded && !status.isPlaying) {
            if (isStartSoundRefresh.current.end) {
              // 文件下载完毕使用完整文件播放，不使用分段播放
              if (sound !== null) {
                AudioPayManagerSingle().currentSound = sound
                await playSound()
                setIsPlaying(() => true)
              } else {
                SocketStreamManager().getPlayFragment().resetPlayIndex()
                SocketStreamManager().getPlayFragment().playSingleSound()
              }
            } else {
              AudioPayManagerSingle().currentSound = SocketStreamManager().getPlayFragment().currentSound
              AudioPayManagerSingle().currentSound.playAsync()
            }

            setIsPlaying(() => true)
          }
        })
      return
    }
    soundInterval.current && clearInterval(soundInterval.current)

    if (sound !== null) {
      if (isPlaying) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
        })

        soundManager.current.pause()
        opSuccess = true
        console.log('handlePlayPause-isPlayingtrue:')
      } else {
        opSuccess = await playSound()
        console.log('handlePlayPause-play:')
      }
      opSuccess && setIsPlaying(() => !isPlaying)
    }
    console.log('handlePlayPause:', opSuccess)
    return opSuccess
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

  // console.log('dur-total', duration, currentPosition)

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
