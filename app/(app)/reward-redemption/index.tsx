import { Button, Notify } from "@fruits-chain/react-native-xiaoshu";
import dayjs from "dayjs";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Circle from "../../../assets/images/rewards-center/Circle.png";
import Reward1 from "../../../assets/images/rewards-center/reward-redemption/Reward1.png";
import Reward2 from "../../../assets/images/rewards-center/reward-redemption/Reward2.png";
import Reward3 from "../../../assets/images/rewards-center/reward-redemption/Reward3.png";
import ShellLoading from "../../../components/common/loading";
import { useTaskRequest } from "../../../components/rewords-center/hooks";
import RewordsHeader from "../../../components/rewords-center/RewordsHeader";
import useTaskStore from "../../../store/taskStore";
const Rewards = [
  {
    id: 1,
    title: "Season 1 Mystery Box",
    img: Reward1,
    points: "???",
  },
  {
    id: 2,
    title: "1-Month Standard Battle Pass",
    img: Reward2,
    points: "???",
  },
  {
    id: 3,
    title: "Genesis Pass",
    img: Reward3,
    points: "???",
  },
];
const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  rewordCard: {
    borderColor: "#E4E9F0",
    padding: 24,
    marginBottom: 24,
    borderRadius: 12,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1,
    alignItems: "center",
    borderWidth: 1,
  },
  rewordCardText: {
    fontWeight: "600",
    fontSize: 16,
  },
});

const RewordRedemption = () => {
  const safeTop = useSafeAreaInsets().top;
  const navigation = useNavigation();
  const { seasonEndDate } = useTaskStore();
  const { loading } = useTaskRequest();
  const redemptionOpenDate: string | null = useMemo(() => {
    if (seasonEndDate) {
      return dayjs(seasonEndDate)
        .utc()
        .subtract(3, "day")
        .format("YYYY-MM-DDTHH:mm:ss[Z]");
    } else {
      return null;
    }
  }, [seasonEndDate]);

  useEffect(() => {
    navigation.setOptions({
      header: () => null,
    });
  }, [navigation]);

  if (loading) return <ShellLoading></ShellLoading>;
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff", marginTop: safeTop }}
    >
      <RewordsHeader
        endDate={redemptionOpenDate}
        desc="Redeem rewards with Shell Points, available in the season’s final 3 days."
      ></RewordsHeader>
      <View style={{ padding: 12 }}>
        {Rewards.map((i) => (
          <View key={i.id} style={styles.rewordCard}>
            <Text style={styles.rewordCardText}>{i.title}</Text>
            <Image
              style={{
                width: 300,
                height: 300,
                borderRadius: 12,
                marginTop: 12,
              }}
              source={i.img}
            ></Image>
            <Button
              onPress={() =>
                Notify({
                  message: "Coming soon!",
                  backgroundColor: "#7A2EF6",
                })
              }
              round
              renderLeftIcon={() => (
                <Image style={{ width: 24, height: 24 }} source={Circle} />
              )}
              textStyle={{
                color: "#202223",
                fontSize: 18,
              }}
              style={{
                marginTop: 24,
                height: 44,
                width: 200,
                backgroundColor: "#FFF",
                borderWidth: 1,
                borderColor: "#E4E5E7",
              }}
            >
              <Text style={{ marginLeft: 5 }}>{i.points}</Text>
            </Button>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default RewordRedemption;
