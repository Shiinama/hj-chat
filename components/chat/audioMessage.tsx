import React, { useState, useEffect } from 'react'
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
import Slider from '@react-native-community/slider'
import { Audio, AVPlaybackStatus } from 'expo-av'
import heidian from '../../assets/images/heidian.png'
import MessagePlay from '../../assets/images/chat/message_play.svg'
import Messagepause from '../../assets/images/chat/message_pause.svg'

const Player = ({ audioFileUri }: { audioFileUri: string }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentPosition, setCurrentPosition] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  useEffect(() => {
    if (!audioFileUri) return
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync({ uri: audioFileUri })
      setSound(sound)
    }
    loadSound()
  }, [audioFileUri])

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound')
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
        if (status.isLoaded && status.isPlaying && currentPosition >= duration) {
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
        await sound.pauseAsync()
      } else {
        await sound.playAsync()
      }
      setIsPlaying(!isPlaying)
    }
  }

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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePlayPause}>
        {isPlaying ? <Messagepause height={18} width={18} /> : <MessagePlay height={18} width={18} />}
      </TouchableOpacity>
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

export default Player
