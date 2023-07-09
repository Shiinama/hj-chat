import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import arrowIcon from "../../assets/images/profile/arrow.png";
import Chart from "../../assets/images/rewards-center/Chart.svg";
import Circle from "../../assets/images/rewards-center/Circle.png";
import Earn from "../../assets/images/rewards-center/Earn.svg";
import RewardRedemption from "../../assets/images/rewards-center/RewardRedemption.svg";
import TabBg from "../../assets/images/rewards-center/TabBg.png";
import { useTaskRequest } from "../../components/rewords-center/hooks";
import MyShellPoints from "../../components/rewords-center/MyShellPoints";
import useTaskStore from "../../store/taskStore";
const Screenwidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    flex: 1,
    padding: 12,
  },
  background: {
    alignItems: "center",
    height: 222,
    width: Screenwidth - 24,
    position: "relative",
  },
  image: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  actionItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingLeft: 15,
    paddingRight: 12,
    marginBottom: 20,
    backgroundColor: "#FFF",
    borderRadius: 12,
  },
  actionItemInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 30,
  },
  actionItemInfoText: {
    fontSize: 16,
    marginLeft: 8,
    // flex: 1,
    fontWeight: "500",
    color: "#1F1F1F",
  },
});

const Rewords = () => {
  const router = useRouter();
  const { points } = useTaskStore();
  const { queryPoints } = useTaskRequest();
  useEffect(() => {
    queryPoints();
  }, [queryPoints]);
  const actionList = [
    {
      name: "Earn Shell Points",
      icon: <Earn></Earn>,
      onPress: () => router.push({ pathname: "earn" }),
    },
    {
      name: "Reward Redemption",
      icon: <RewardRedemption></RewardRedemption>,
      onPress: () => router.push({ pathname: "reward-redemption" }),
    },
    {
      name: "My Rewards",
      icon: <Chart></Chart>,
      onPress: () => router.push({ pathname: "my-rewards" }),
    },
  ];
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.background}>
          <Image style={styles.image} source={TabBg}></Image>
          <View style={{ alignItems: "center" }}>
            <Image style={{ width: 150, height: 150 }} source={Circle}></Image>
            <Text style={{ color: "#95A6FF", marginBottom: 12 }}>
              MyShell Points
            </Text>
            <MyShellPoints value={points}></MyShellPoints>
          </View>
        </View>
      </View>
      <View style={{ width: "100%", marginTop: 16 }}>
        {actionList.map((i) => (
          <TouchableOpacity
            key={i.name}
            style={styles.actionItem}
            onPress={i.onPress}
          >
            <View style={styles.actionItemInfo}>
              {i.icon}
              <Text style={styles.actionItemInfoText}>{i.name}</Text>
            </View>
            <Image source={arrowIcon} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Rewords;
