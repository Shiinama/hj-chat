import { Button } from "@fruits-chain/react-native-xiaoshu";
import dayjs from "dayjs";
import { Audio } from "expo-av";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { claimAll } from "../../api/task";
import useTaskStore from "../../store/taskStore";
import { useTaskRequest } from "./hooks";
import TaskItem from "./TaskItem";

const TaskList = () => {
  const [claiming, setClaiming] = useState(false);
  const { taskList, hasClaimableTask, clainSound, seasonEndDate } =
    useTaskStore();
  const { queryAll } = useTaskRequest();
  const playClaimVoice = async () => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    try {
      clainSound?.replayAsync();
    } catch (error) {}
  };
  const handleClaimAll = () => {
    setClaiming(true);
    claimAll()
      .then(() => {
        playClaimVoice();
        queryAll();
      })
      .finally(() => setClaiming(false))
      .catch(() => setClaiming(false));
  };

  return (
    <View style={{ marginBottom: 50 }}>
      <View style={styles.container}>
        <Text
          style={{
            flex: 1,
            color: "rgb(232, 169, 0)",
            lineHeight: 20,
            fontSize: 14,
          }}
        >
          {`*Shell Points can be claimed until ${dayjs(seasonEndDate)
            .add(-3, "day")
            .add(-1, "minute")
            .format(
              "YYYY-MM-DD HH:mmA",
            )}. When reward redemption starts, new eligible Shell
          Points from task completions will only be claimable in the next season.`}
        </Text>
        <View>
          <Button
            disabled={!hasClaimableTask}
            loading={claiming}
            onPress={handleClaimAll}
            textStyle={[
              styles.buttonText,
              !hasClaimableTask && styles.disableText,
            ]}
            round
            style={[
              styles.actionMain,
              !hasClaimableTask && styles.disableButton,
            ]}
          >
            Claim All
          </Button>
        </View>
      </View>
      {taskList
        .filter((t) => t.active)
        .map((task) => (
          <TaskItem
            key={`${task?.userTaskUid}-${task?.status}`}
            item={task}
            endDate={seasonEndDate}
          ></TaskItem>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 14,
    color: "#3E5CFA",
    lineHeight: 20,
    fontWeight: "600",
  },
  disableButton: {
    borderColor: "#D2D5D8",
    backgroundColor: "#FAFBFB",
  },
  disableText: {
    color: "#8C9196",
  },
  actionMain: {
    height: 32,
    width: 100,
    borderWidth: 1,
    borderColor: "#E4E5E7",
    backgroundColor: "white",
  },
  item: {
    borderRadius: 12,
    padding: 12,
    borderColor: "#E4E9F0",
    borderWidth: 1,
    borderStyle: "solid",
  },
});

export default TaskList;
