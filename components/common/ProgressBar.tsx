import React, { useState, useEffect, useMemo } from 'react'
import { View, StyleSheet, Text } from 'react-native'

interface ProgressBarProps {
  progressValue: number
  progressBarColor?: string
  style?: any
  maxRange: number
  size?: 'm' | 's'
}
const ProgressBar = ({
  progressValue = 0,
  progressBarColor = '#FFC03A',
  style,
  size = 'm',
  maxRange = 100,
}: ProgressBarProps) => {
  const textSizeStyle = {
    m: styles.normalText,
    s: styles.smallText,
  }
  const barWidth = useMemo(() => {
    if (progressValue && maxRange) {
      const percentage = ((progressValue / maxRange) * 100).toFixed(2)
      return Number(percentage) > 100 ? '100%' : `${percentage}%`
    } else {
      return 0
    }
    return
  }, [progressValue, maxRange])
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.progressBar,
          { backgroundColor: progressBarColor },
          {
            width: barWidth,
          },
        ]}
      ></View>
      <Text style={[styles.progressText, textSizeStyle?.[size]]}>{progressValue + '/' + maxRange}</Text>
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
  normalText: {
    fontSize: 12,
  },
  smallText: {
    fontSize: 10,
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 3,
    width: '100%',
    lineHeight: 24,
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
})

export default ProgressBar
