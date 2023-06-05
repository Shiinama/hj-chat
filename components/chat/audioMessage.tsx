import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useCallback, memo, useMemo } from 'react'
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
// import Slider from '@react-native-community/slider'
import { Slider } from '@miblanchard/react-native-slider'
import { Audio, AVPlaybackStatus } from 'expo-av'
import MessagePlay from '../../assets/images/chat/message_play.svg'
import Messagepause from '../../assets/images/chat/message_pause.svg'
import ShellLoading from '../common/loading'
import AudioPayManagerSingle from './audioPlayManager'
import { formatTime } from '../../utils/time'
import { MessageDetail } from '../../types/MessageTyps'
import SocketStreamManager from './socketManager'

type AudioType = {
  showControl?: boolean
  isDone?: boolean
  item?: MessageDetail
  onPlay?: (playing: boolean) => void
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const AudioMessage = forwardRef(({ item, isDone, showControl = true, onPlay }: AudioType, ref) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const SoundObj = useRef<{
    Sound: Audio.Sound | null
    uri: string
    positionMillis: number
    durationMillis: number
  }>({
    Sound: null,
    uri: '',
    positionMillis: 0,
    durationMillis: 0,
  })
  const [positionMillis, setPositionMillis] = useState<number>(0)
  const [durationMillis, setDurationMillis] = useState<number>(0)
  const refPlaying = useRef<boolean>(false)
  const [loadFail, setLoadFail] = useState(false)
  // const [Sound, setSound] = useState<Audio.Sound | null>(null)
  // 全局录音单点播放控制
  const soundManager = useRef(AudioPayManagerSingle())

  const key = item.botId + '&BOT&' + item.replyUid

  useEffect(() => {
    if (item.type === 'LOADING' && item.replyUid) {
      SocketStreamManager().addAudioStreamCallBack(key, (msg, uri) => {
        SoundObj.current.uri = uri
        if (!SoundObj.current.Sound) {
          refPlaying.current = true
          loadSound()
          setIsPlaying(true)
        } else {
          loadNext()
        }
      })
    }
    return () => {
      SocketStreamManager().removeresMessagesCallBack(key)
      SocketStreamManager().removeAudioStreamCallBack(key)
    }
  }, [item])

  const loadNext = async () => {
    const { positionMillis, Sound, uri } = SoundObj.current
    if (Sound && uri) {
      try {
        // setLoading(true)
        await Sound.stopAsync()
        await Sound.unloadAsync()
        await Sound.loadAsync({ uri: uri }, { positionMillis: positionMillis, progressUpdateIntervalMillis: 16 })
        await Sound.playAsync()
        // setLoading(false)
      } catch (e) {
        console.log(e)
      }
    }
  }
  const setSlideFnc = status => {
    if (status.isLoaded) {
      setDurationMillis(status.durationMillis || 0)
      SoundObj.current.durationMillis = status.durationMillis || 0
    }
    console.log(status.positionMillis, status.durationMillis)
    // 100ms执行一次，获取时间也需要加100，遇到一秒钟的录音播放有将近50的误差，再加50
    if (status.isLoaded && refPlaying.current && status.positionMillis - status.durationMillis >= 0) {
      // loadNext()

      setIsPlaying(() => false)
      soundManager.current.stop()
      setPositionMillis(0)
    } else if (status.isLoaded && status.isPlaying) {
      setPositionMillis(status.positionMillis || 0)
      SoundObj.current.positionMillis = status.positionMillis || 0
    }
  }

  const loadSound = async () => {
    const { uri } = SoundObj.current
    console.log(uri)
    if (!uri) return
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        {
          progressUpdateIntervalMillis: 16,
        },
        status => {
          setSlideFnc(status)
        }
      )

      soundManager.current.currentSound = sound
      soundManager.current.currentAutoPlayUrl = uri
      SoundObj.current.Sound = sound
      setLoading(false)
    } catch (e) {
      // load sound fail [Error: com.google.android.exoplayer2.audio.AudioSink$InitializationException: AudioTrack init failed 0 Config(22050, 4, 11026)]
      /**
       * 音频解码错误，源于无法创建音轨。手机的音轨资源是有限的，如果每个视频都占用一个音轨并且不释放的话，就会导致上述问题。
       * https://zhuanlan.zhihu.com/p/627702119
       */
      console.log('load sound fail', e, 'url:', uri)
      setLoading(false)
      setLoadFail(true)
    }
  }

  useEffect(() => {
    item.voiceUrl && (SoundObj.current.uri = item.voiceUrl)
    loadSound()
  }, [item.voiceUrl])

  const playSound = async () => {
    setLoading(false)
    let opSuccess = false
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    })
    // 单点播放控制，第二参数是当点击其他的录音播放是把当前状态设置为false
    opSuccess = await soundManager.current.play(
      SoundObj.current.Sound,
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
    if (SoundObj.current.Sound !== null) {
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
    if (SoundObj.current.Sound !== null) {
      await soundManager.current.currentSound.setPositionAsync(value)
    }
  }
  if (isDone && loading) return null
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
        <Text style={styles.time}>{formatTime(positionMillis) + '/' + formatTime(durationMillis)}</Text>
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
          maximumValue={durationMillis}
          value={positionMillis}
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
