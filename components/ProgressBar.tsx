import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Animated, Text } from 'react-native'

interface ProgressBarProps {
  progressStartValue?: number
  progressValue: number
  duration?: number
  progressBarColor?: string
  style?: any
}

const ProgressBar = ({
  progressStartValue = 0,
  progressValue,
  duration = 300,
  progressBarColor = '#00c',
  style,
}: ProgressBarProps) => {
  const [progressAnimation] = useState(new Animated.Value(progressStartValue))

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: progressValue,
      duration,
      useNativeDriver: false,
    }).start()
  }, [progressValue])

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.progressBar,
          { backgroundColor: progressBarColor },
          {
            width: progressAnimation.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
          },
        ]}
      ></Animated.View>
      <Text style={styles.progressText}>{progressValue + '/' + '100'}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 61,
    height: 24,
    position: 'relative',
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
  progressBar: {
    height: '100%',
  },
  progressText: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    textAlign: 'center',
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
})

export default ProgressBar
