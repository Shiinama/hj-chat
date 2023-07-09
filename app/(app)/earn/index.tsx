import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getActiveSeason } from "../../../api/task";
import ShellLoading from "../../../components/common/loading";
import { useTaskRequest } from "../../../components/rewords-center/hooks";
import Ranking from "../../../components/rewords-center/Ranking";
import RewordsHeader from "../../../components/rewords-center/RewordsHeader";
import TaskList from "../../../components/rewords-center/TaskList";
import useTaskStore from "../../../store/taskStore";

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
});

const Earn = () => {
  const safeTop = useSafeAreaInsets().top;
  const navigation = useNavigation();
  const { setSeasonInfo, seasonEndDate } = useTaskStore();
  const { loading, queryTaskList } = useTaskRequest();

  useEffect(() => {
    queryTaskList(true);
  }, [queryTaskList]);
  useEffect(() => {
    getActiveSeason().then((res) => {
      setSeasonInfo(res);
    });
  }, [setSeasonInfo]);
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
        endDate={seasonEndDate}
        desc="Earn Shell Points to redeem valuable rewards!"
      ></RewordsHeader>
      <View style={{ padding: 12 }}>
        <Text style={styles.title}>Ranking</Text>
        <Ranking></Ranking>
        <Text style={styles.title}>Task List</Text>
        <TaskList></TaskList>
      </View>
    </ScrollView>
  );
};

export default Earn;
