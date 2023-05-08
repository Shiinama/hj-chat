import React, { useEffect, useRef, useCallback } from 'react'
import { Keyboard, Animated, View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/** 动态高度组件 */
const Shim: React.FC<{ offsetHeight?: number }> = ({ offsetHeight }) => {
  const AnimatedValue = useRef(new Animated.Value(0)).current

  const setHeight = useCallback(
    (toValue: number, duration: number) => {
      Animated.timing(AnimatedValue, {
        toValue,
        duration: duration,
        useNativeDriver: false,
      }).start()
    },
    [AnimatedValue]
  )

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', e => {
      setHeight(e.endCoordinates.height + offsetHeight, e.duration)
    })
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', e => {
      setHeight(0, e.duration)
    })

    // const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
    //   console.log(e, 111)
    // })
    return () => {
      // keyboardDidShowListener.remove()
      keyboardWillShow.remove()
      keyboardWillHide.remove()
    }
  }, [AnimatedValue, setHeight])

  return (
    <Animated.View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ backgroundColor: '#f5f5f5', height: AnimatedValue }}
    />
  )
}

export default Shim
