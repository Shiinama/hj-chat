import type { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

import SearchIcon from "../../../assets/images/setting/Search.svg";
export interface NoDataProps {}
const NoData: FC<NoDataProps> = () => {
  return (
    <View style={styles.box}>
      <SearchIcon style={styles.icon} width={44} height={44} />
      <Text style={styles.mainText}>Nothing found</Text>
      <Text style={styles.text}>
        We couldn't find anything with this criteria
      </Text>
    </View>
  );
};
export default NoData;
const styles = StyleSheet.create({
  box: {
    minHeight: 310,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  icon: {
    marginBottom: 8,
  },
  mainText: {
    color: "#131214",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 8,
  },
  text: {
    color: "#9B9A9D",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
