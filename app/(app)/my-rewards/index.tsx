import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { FunctionComponent, useEffect } from "react";
import { Text, View } from "react-native";

import NoColorLogo from "../../../assets/images/rewards-center/NoColorLogo.png";
interface MyRewardProps {}

const MyReward: FunctionComponent<MyRewardProps> = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "My Rewards",
    });
  }, [navigation]);
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Image style={{ width: 62, height: 40 }} source={NoColorLogo}></Image>
      <Text style={{ fontSize: 28, lineHeight: 36, marginVertical: 16 }}>
        Oops!
      </Text>
      <Text
        style={{
          width: 250,
          fontSize: 14,
          color: "rgb(109, 113, 117)",
          textAlign: "center",
        }}
      >
        There is no reward in your pocket yet. Earn more Shell Points and redeem
        valuable rewards!
      </Text>
    </View>
  );
};

export default MyReward;
