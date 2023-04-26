import React, { useEffect, useRef, useCallback } from 'react'
import { Keyboard, Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/** 动态高度组件 */
const Shim: React.FC = () => {
  const insets = useSafeAreaInsets()

  // 1 height 动态变化  键盘收起的时候是 insets.bottom  键盘弹出的时候是键盘的高度
  // 2 View 动画的方式高度变化
  // 3 调试：键盘和主体部分的推动丝滑，避免生硬

  const AnimatedValue = useRef(new Animated.Value(insets.bottom)).current

  const setHeight = useCallback(
    (toValue: number, duration: number) => {
      Animated.timing(AnimatedValue, {
        toValue,
        duration: duration,
        useNativeDriver: false,
      }).start()
    },
    [AnimatedValue],
  )

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', e => {
      setHeight(e.endCoordinates.height, e.duration)
    })
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', e => {
      setHeight(insets.bottom, e.duration)
    })
    return () => {
      keyboardWillShow.remove()
      keyboardWillHide.remove()
    }
  }, [AnimatedValue, insets.bottom, setHeight])

  return (
    <Animated.View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ backgroundColor: '#f5f5f5', height: AnimatedValue }}
    />
  )
}

export default Shim
