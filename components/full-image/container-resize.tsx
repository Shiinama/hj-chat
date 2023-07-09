import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ContainerResize: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const insets = useSafeAreaInsets();
  const [height, setHeight] = useState(0);
  const AnimatedHeight = useRef(new Animated.Value(height)).current;

  const setAnimatedHight = useCallback(
    (toValue: number, duration: number) => {
      Animated.timing(AnimatedHeight, {
        toValue,
        duration: duration,
        useNativeDriver: true,
      }).start();
    },
    [AnimatedHeight],
  );

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", (e) => {
      setAnimatedHight(height - e.endCoordinates.height, e.duration);
    });
    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", (e) => {
      setAnimatedHight(height, e.duration);
    });
    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [AnimatedHeight, height, insets.bottom, setAnimatedHight]);

  return (
    <Animated.View
      onLayout={(e) => {
        setHeight(e.nativeEvent.layout.height);
      }}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        paddingBottom: insets.bottom,
        height: AnimatedHeight,
      }}
    >
      {children}
    </Animated.View>
  );
};

export default ContainerResize;
