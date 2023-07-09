import { Loading } from "@fruits-chain/react-native-xiaoshu";
import { View } from "react-native";

function ShellLoading({ backgroundColor = "#F5F7FA" }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loading color="#7A2EF6" type="spinner" />
    </View>
  );
}

export default ShellLoading;
