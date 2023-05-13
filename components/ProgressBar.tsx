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
  progressBarColor = '#00c',
  style,
  maxRange = 100,
}: ProgressBarProps) => {
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.progressBar,
          { backgroundColor: progressBarColor },
          {
            width: progressValue,
          },
        ]}
      ></View>
      <Text style={styles.progressText}>{progressValue + '/' + maxRange}</Text>
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
