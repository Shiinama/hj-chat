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
    loadRefreshSound,
    playFragment,
  }))

  const playFragment = (params: { dur: number; end: boolean }) => {
    setIsPlaying(params.end ? false : true)
    setCurrentPosition(params?.end ? 0 : params.dur)
  }

  const loadRefreshSound = async (finish?: boolean) => {
    if (sound) {
      try {
        console.log('loadRefreshSound', finish)
        await sound.unloadAsync()
      } catch (e) {
        console.log('loadRefreshSoundunloadAsyncerror:', e)
      }
      try {
        // console.log('loadRefreshSound')
        const status = await sound.loadAsync({
          uri: audioFileUri,
        })
        setDuration(status.durationMillis || 0)
        if (finish) {
          // 完成了就去播放一下
          playCurrentRecevice()
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
    !hideLoading && setLoading(true)
    setLoadFail(false)
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioFileUri })
      setSound(sound)
      setLoadFail(false)
    } catch (e) {
      // load sound fail [Error: com.google.android.exoplayer2.audio.AudioSink$InitializationException: AudioTrack init failed 0 Config(22050, 4, 11026)]
      /**
       * 音频解码错误，源于无法创建音轨。手机的音轨资源是有限的，如果每个视频都占用一个音轨并且不释放的话，就会导致上述问题。
       * https://zhuanlan.zhihu.com/p/627702119
       */
      console.log('load sound fail', e, 'url:', audioFileUri)
      setLoadFail(true)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!audioFileUri) return
    const loadSounda = async () => {
      setLoading(true)
      setLoadFail(false)
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: audioFileUri })
        setSound(sound)
        setLoadFail(false)
      } catch (e) {
        console.log('load sound fail:', e)
        setLoadFail(true)
      }
      setLoading(false)
    }
    loadSounda()
    return () => {
      soundInterval.current && clearInterval(soundInterval.current)
      if (sound) {
        try {
          // sound.unloadAsync()
          // sound.stopAsync()
        } catch (error) {}
      }
    }
  }, [])

  const playCurrentRecevice = async () => {
    console.log('playCurrentRecevice:', audioFileUri, AudioPayManagerSingle().currentAutoPlayUrl)
    // 如果当前片段没有播放再播放
    if (
      audioFileUri == AudioPayManagerSingle().currentAutoPlayUrl &&
      !SocketStreamManager().getPlayFragment()?.isPlaying()
    ) {
      setIsPlaying(false)
      console.log('playCurrentRecevice:to', audioFileUri, AudioPayManagerSingle().currentAutoPlayUrl)
      const success = await handlePlayPause()
      console.log('handlePlayPause-success:', success)
      // 自动播放后清空自动播放的url
      if (success) {
        AudioPayManagerSingle().currentAutoPlayUrl = undefined
      }
    }
  }

  useEffect(() => {
    console.log(111)
    if (sound !== null) {
      sound.getStatusAsync().then(async status => {
        if (status.isLoaded) {
          setCurrentPosition(status.positionMillis || 0)
          setDuration(status.durationMillis || 0)
          // console.log(
          //   'AudioPayManagerSingle().currentAutoPlayUrl:',
          //   AudioPayManagerSingle().currentAutoPlayUrl,
          //   audioFileUri,
          //   status
          // )
          playCurrentRecevice()
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
          soundInterval.current && clearInterval(soundInterval.current)
          setCurrentPosition(() => {
            return 0
          })
          setIsPlaying(() => false)
          soundManager.current.stop()
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
    let opSuccess = false
    soundInterval.current && clearInterval(soundInterval.current)
    if (AudioPayManagerSingle().isRecording) {
      Toast('Recording in progress')
      return opSuccess
    }

    if (sound !== null) {
      if (isPlaying) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
        })

        soundManager.current.pause()
        opSuccess = true
      } else {
        opSuccess = await playSound()
      }
      opSuccess && setIsPlaying(() => !isPlaying)
    }
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

  if (!loading && loadFail)
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: '100%',

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
