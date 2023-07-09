import React, { useEffect, useMemo, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface MyShellPointsProps {
  value: number;
  claimedPoints?: number;
}

const MyShellPoints = ({ value }: MyShellPointsProps) => {
  const [currentValue, setCurrentValue] = useState<number>(value);
  const animatedValue = useMemo(
    () => new Animated.Value(currentValue),
    [currentValue],
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentValue === value) {
        clearInterval(intervalId);
      } else {
        setCurrentValue((prevValue) => {
          const increment = Math.sign(value - prevValue);
          const nextValue = prevValue + increment;
          return increment === 0 ||
            (increment > 0 && nextValue > value) ||
            (increment < 0 && nextValue < value)
            ? value
            : nextValue;
        });
      }
    }, 32);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentValue, value]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: currentValue,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [currentValue, animatedValue]);

  return (
    <View style={styles.container}>
      <Animated.Text style={styles.text}>{animatedValue}</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  claimedPointsText: {
    color: "#01B789",
    marginLeft: 5,
    fontSize: 12,
  },
  text: {
    fontSize: 24,
    lineHeight: 32,
    color: "#3E5CFA",
  },
});

export default React.memo(MyShellPoints);
