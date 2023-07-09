import { StyleSheet, View } from "react-native";

import useTaskStore from "../../store/taskStore";
import Progress from "./Progress";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F7FA",
    width: "100%",
    borderRadius: 12,
    height: 116,
    padding: 20,
    justifyContent: "center",
    marginBottom: 32,
  },
});

const Ranking = () => {
  const { ranking } = useTaskStore();
  return (
    <View style={styles.container}>
      <Progress value={ranking}></Progress>
    </View>
  );
};

export default Ranking;
