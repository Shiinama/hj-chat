import React, { useCallback, useEffect, useRef } from 'react'
import { Animated, Keyboard } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/** 动态移动容器 */
const ContainerSlider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const insets = useSafeAreaInsets()
  const AnimatedValue = useRef(new Animated.Value(0)).current

  const setScrollY = useCallback(
    (toValue: number, duration: number) => {
      Animated.timing(AnimatedValue, {
        toValue,
        duration: duration,
        useNativeDriver: true,
      }).start()
    },
    [AnimatedValue],
  )

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', e => {
      setScrollY(-e.endCoordinates.height + insets.bottom, e.duration)
    })
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', e => {
      setScrollY(0, e.duration)
    })
    return () => {
      keyboardWillShow.remove()
      keyboardWillHide.remove()
    }
  }, [AnimatedValue, insets.bottom, setScrollY])

  return (
    <Animated.View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        transform: [{ translateY: AnimatedValue }],
      }}>
      {children}
    </Animated.View>
  )
}

export default ContainerSlider
