import Banner1 from "@assets/images/rewards-center/earn/Banner1.png";
import Banner2 from "@assets/images/rewards-center/earn/Banner2.png";
import Back from "@assets/images/tabbar/back.svg";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { FunctionComponent } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import CountDown from "./CountDown";
const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  banner: {
    height: 234,
    position: "relative",
    flexShrink: 0,
  },
  banner1Image: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  banner2Image: {
    height: "100%",
    width: "75%",
    position: "absolute",
    top: 0,
    right: 0,
  },
  bannerBottom: {
    position: "absolute",
    bottom: 0,
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "column",
    padding: 16,
  },
  bottomEnd: {
    marginTop: 16,
  },
});
interface RewordsHeaderProps {
  desc: string;
  endDate: string;
}

const RewordsHeader: FunctionComponent<RewordsHeaderProps> = ({
  desc,
  endDate,
}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        position: "relative",
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 16,
          zIndex: 9,
          left: 16,
          height: 24,
          width: 24,
        }}
      >
        <Back fontSize={24}></Back>
      </TouchableOpacity>
      <View style={styles.banner}>
        <Image style={styles.banner1Image} source={Banner1}></Image>
        <Image style={styles.banner2Image} source={Banner2}></Image>
        <View style={styles.bannerBottom}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: "800",
              color: "rgb(62, 92, 250)",
            }}
          >
            Season 1
          </Text>
          <Text style={{ marginTop: 6, color: "rgb(62, 92, 250)" }}>
            {desc}
          </Text>
          <View style={styles.bottomEnd}>
            <Text style={{ color: "rgb(140, 145, 150)" }}>Ends in</Text>
            <CountDown endDate={endDate}></CountDown>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RewordsHeader;
