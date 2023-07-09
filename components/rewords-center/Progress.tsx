import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import systemConfig from "../../constants/System";
import UserStore from "../../store/userStore";

enum Progress {
  Zero = "0%",
  Fifty = "50%",
  Ninty = "⭐️",
  Hundred = "100%",
}

interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const gradientColors = ["#3E5CFA", "#FF8E25", "#FF34D2"];
  const progress = useRef(new Animated.Value(0));
  const [barWidth, setBarWidth] = useState(0);
  useEffect(() => {
    Animated.timing(progress.current, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, []);

  const scaleValues: Progress[] = [
    Progress.Zero,
    undefined,
    undefined,
    undefined,
    undefined,
    Progress.Fifty,
    undefined,
    undefined,
    undefined,
    Progress.Ninty,
    Progress.Hundred,
  ];
  const avatar = `${systemConfig?.avatarImgHost}${
    UserStore.getState().profile.avatar
  }`;
  return (
    <View style={styles.container}>
      <View
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        style={styles.progressWrapper}
      >
        <Animated.Text
          style={[
            styles.tumbText,
            {
              left: progress.current.interpolate({
                inputRange: [0, 1],
                outputRange: [0, (barWidth * value) / 100 - 17 - value],
              }),
            },
          ]}
        >
          {`Over ${value}% of users`}
        </Animated.Text>
        <Animated.View
          style={[
            styles.tumb,
            {
              left: progress.current.interpolate({
                inputRange: [0, 1],
                outputRange: [0, (barWidth * value) / 100 - 17],
              }),
            },
          ]}
        >
          <Image style={styles.tumbImage} source={{ uri: avatar }} />
        </Animated.View>
        <Animated.View
          style={[
            {
              width: progress.current.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", `${value}%`],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            style={[styles.progress]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          ></LinearGradient>
        </Animated.View>
      </View>
      <View style={styles.scaleWrapper}>
        {scaleValues.map((scaleValue, index) => (
          <Text key={index} style={[styles.scaleText]}>
            {scaleValue}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  progressWrapper: {
    flexDirection: "row",
    position: "relative",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "rgb(237, 240, 245)",
  },
  tumb: {
    position: "absolute",
    justifyContent: "center",
    zIndex: 10,
    alignItems: "center",
  },
  tumbText: {
    position: "absolute",
    bottom: 24,
    width: 200,
    flexWrap: "nowrap",
    color: "rgb(62, 92, 250)",
  },
  tumbImage: {
    width: 34,
    height: 34,
    borderRadius: 15,
  },
  progress: {
    height: 10,
    borderRadius: 5,
  },
  scaleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  scaleText: {
    color: "#34495e",
    fontSize: 14,
  },
});

export default ProgressBar;
