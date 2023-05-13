import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Animated, Text } from 'react-native'

interface ProgressBarProps {
  progressStartValue?: number
  progressValue: number
  duration?: number
  progressBarColor?: string
  style?: any
  maxRange: number
}

const ProgressBar = ({
  progressStartValue = 0,
  progressValue,
  duration = 300,
  progressBarColor = '#FFC03A',
  style,
  maxRange = 100,
}: ProgressBarProps) => {
  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.progressBar,
          { backgroundColor: progressBarColor },
          {
            width: progressValue,
          },
        ]}
      ></Animated.View>
      <Text style={styles.progressText}>{progressValue + '/' + maxRange}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 24,
    position: 'relative',
    backgroundColor: '#694802',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    lineHeight: 24,
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
})

export default ProgressBar
