import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
import Slider from '@react-native-community/slider'
import { Audio, AVPlaybackStatus } from 'expo-av'
import heidian from '../../assets/images/heidian.png'
import MessagePlay from '../../assets/images/chat/message_play.svg'
import Messagepause from '../../assets/images/chat/message_pause.svg'
import ShellLoading from '../loading'
import AudioPayManagerSingle from './audioPlayManager'

const AudioMessage = forwardRef(
  ({ audioFileUri, showControl = true, onPlay }: { audioFileUri: string; showControl?: boolean; onPlay?: (playing: boolean)=> void }, ref) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [currentPosition, setCurrentPosition] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)
    const [sound, setSound] = useState<Audio.Sound | null>(null)
    // 全局录音单点播放控制
    const soundManager = useRef(AudioPayManagerSingle())
    useImperativeHandle(ref, () => ({
      handlePlayPause,
    }))
    useEffect(() => {
      if (!audioFileUri) return
      const loadSound = async () => {
        setLoading(true)
        const { sound } = await Audio.Sound.createAsync({ uri: audioFileUri })
        setSound(sound)
        setLoading(false)
      }
      loadSound()
    }, [])

    useEffect(() => {
      return sound
        ? () => {
            sound.unloadAsync()
          }
        : undefined
    }, [sound])

    useEffect(() => {
      let interval = setInterval(async () => {
        if (sound !== null) {
          const status: AVPlaybackStatus = await sound.getStatusAsync()
          if (status.isLoaded) {
            setCurrentPosition(status.positionMillis || 0)
            setDuration(status.durationMillis || 0)
          }
          if (status.isLoaded && isPlaying && (status.positionMillis - status.durationMillis >= 0)) {
            await sound.stopAsync()
            setCurrentPosition(0)
            setIsPlaying(false)
          }
        }
      })
      return () => clearInterval(interval)
    }, [sound, currentPosition, duration])

    const handlePlayPause = async () => {
      if (sound !== null) {
        if (isPlaying) {
          soundManager.current.pause()
        } else {
          // 单点播放控制，第二参数是当点击其他的录音播放是把当前状态设置为false
          soundManager.current.play(sound, function(){
            setIsPlaying(false)
          })
        }
        setIsPlaying(!isPlaying)
      }
    }

    useEffect(()=>{
      onPlay?.(isPlaying)
    }, [isPlaying])

    const handleChange = async (value: number) => {
      if (sound !== null) {
        await sound.setPositionAsync(value)
        setCurrentPosition(value)
      }
    }

    const formatTime = (ms: number): string => {
      const minutes: number = Math.floor(ms / 60000)
      // @ts-ignore
      const seconds: number = ((ms % 60000) / 1000).toFixed(0)
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }
    if (loading) return <ShellLoading></ShellLoading>
    return (
      <View style={styles.container}>
        {showControl && (
          <TouchableOpacity onPress={handlePlayPause}>
            {isPlaying ? <Messagepause height={20} width={20} /> : <MessagePlay height={20} width={20} />}
          </TouchableOpacity>
        )}
        <Text style={styles.time}>{formatTime(currentPosition) + '/' + formatTime(duration)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          minimumTrackTintColor={'black'}
          maximumValue={duration}
          value={currentPosition}
          thumbImage={heidian}
          onValueChange={handleChange}
        />
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  slider: {
    flex: 1,
    height: 5,
  },
  time: {
    marginHorizontal: 8,
    fontSize: 12,
  },
})

export default AudioMessage
