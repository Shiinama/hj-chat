import dayjs from "dayjs";
import duration, { Duration } from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

dayjs.extend(duration);
dayjs.extend(utc);

interface CountDownProps {
  endDate: string | null;
}

export default function CountDown({ endDate }: CountDownProps) {
  const countDownEndDate = dayjs(endDate);
  const [remainingTime, setRemainingTime] = useState<Duration>();

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = dayjs();
      const diffDuration = dayjs.duration(countDownEndDate.diff(currentTime));
      setRemainingTime(diffDuration);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [countDownEndDate]);

  const days =
    remainingTime && remainingTime.days().toString().padStart(2, "0");
  const hours =
    remainingTime && remainingTime.hours().toString().padStart(2, "0");
  const minutes =
    remainingTime && remainingTime.minutes().toString().padStart(2, "0");
  // const seconds = remainingTime && remainingTime.seconds().toString().padStart(2, '0')
  const timeMap = [
    {
      label: "Days",
      value: days,
    },
    {
      label: "hrs",
      value: hours,
    },
    {
      label: "mins",
      value: minutes,
    },
    // {
    //   label: 'secs',
    //   value: seconds,
    // },
  ];
  return (
    <View style={styles.countDown}>
      {timeMap.map((i) => (
        <View key={i.label} style={styles.countDownItem}>
          <Text style={{ fontWeight: "600" }}>{i.value}</Text>
          <Text style={{ fontWeight: "600" }}>{i.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  countDown: {
    marginTop: 16,
    flexDirection: "row",
  },
  countDownItem: {
    justifyContent: "space-between",
    paddingVertical: 4,
    borderRadius: 12,
    width: 44,
    marginRight: 8,
    height: 44,
    backgroundColor: "rgba(255,255,255, 0.6)",
    alignItems: "center",
  },
});
