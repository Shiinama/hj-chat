import { Button, Toast } from "@fruits-chain/react-native-xiaoshu";
import type { FC } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { queryCanCreateUgcBot } from "../../../api/robot";
import createBg from "../../../assets/images/setting/create_bg.png";
import Icon from "../../../assets/images/setting/icon.svg";
import PlusIcon from "../../../assets/images/setting/plus.svg";

export interface CreateCardProps {}
const CreateCard: FC<CreateCardProps> = () => {
  const onCreate = () => {
    queryCanCreateUgcBot({}).then(() => {
      Toast("Please use a desktop browser to create a robot");
    });
  };
  return (
    <ImageBackground source={createBg} resizeMode="cover" style={styles.card}>
      <Icon />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          onCreate();
        }}
      >
        <PlusIcon style={styles.plusIcon} />
        <Text style={styles.text}>Create a Robot</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};
export default CreateCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 12,
    paddingBottom: 20,
  },
  btn: {
    marginHorizontal: 12,
    maxWidth: 252,
    backgroundColor: "#fff",
    borderRadius: 12,
    height: 48,
    width: "100%",
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    marginRight: 8,
  },
  text: {
    color: "#7A2EF6",
    fontSize: 16,
    fontWeight: "700",
  },
});
