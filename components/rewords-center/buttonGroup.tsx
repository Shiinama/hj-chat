import { Button } from "@fruits-chain/react-native-xiaoshu";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text } from "react-native";

import { completeTask } from "../../api/task";
import useTaskStore from "../../store/taskStore";
import { UserTaskStatusEnum, UserTaskTypeEnum } from "../../types/task";
import { useTaskRequest } from "./hooks";

interface ButtonGroupProps {
  status: string;
  active: boolean;
  taskType: UserTaskTypeEnum;
  userTaskUid: string;
}

const ButtonGroup: FunctionComponent<ButtonGroupProps> = ({
  active,
  status,
  taskType,
  userTaskUid,
}) => {
  const { queryAll } = useTaskRequest();
  const { clainSound } = useTaskStore();
  const router = useRouter();
  const [claimingSet, setClaimingSet] = useState<string[]>([]);
  const [claimedSet, setClaimedSet] = useState<string[]>([]);

  const playClaimVoice = async () => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    try {
      clainSound.replayAsync();
    } catch (error) {}
  };

  const handleCollectGems = useCallback((): void => {
    setClaimingSet(Array.from(new Set([...claimingSet, taskType])));
    completeTask({ userTaskUid })
      .then(() => {
        playClaimVoice();
        setClaimingSet([
          ...claimingSet.filter((taskType) => taskType !== taskType),
        ]);
        setClaimedSet(Array.from(new Set([...claimedSet, taskType])));
        queryAll();
      })
      .finally(() => {
        setClaimedSet([
          ...claimedSet.filter((taskType) => taskType !== taskType),
        ]);
      })
      .catch((err) => {
        setClaimingSet([
          ...claimingSet.filter((taskType) => taskType !== taskType),
        ]);
      });
  }, [
    claimedSet,
    setClaimingSet,
    setClaimedSet,
    queryAll,
    claimingSet,
    userTaskUid,
    taskType,
    playClaimVoice,
  ]);

  const handleGo = (): void => {
    switch (taskType) {
      case UserTaskTypeEnum.talkToBotWithTag:
        router.push({ pathname: "(tabs)/setting" });
        break;
      case UserTaskTypeEnum.dailyMessage:
      case UserTaskTypeEnum.useAutoPrompt:
      case UserTaskTypeEnum.useCustomVoice:
        router.push({ pathname: "(tabs)" });
        break;
      case UserTaskTypeEnum.validInvitation:
        router.push({ pathname: "invite" });
        break;
      case UserTaskTypeEnum.tgBotInvitation:
        WebBrowser.openBrowserAsync("https://discord.com/invite/myshell");
        break;
      default:
        break;
    }
  };

  const buttonRender = useMemo(() => {
    if (!active) {
      return (
        <Button
          disabled
          style={[styles.baseButton, styles.disabledButton]}
          textStyle={[styles.baseText, styles.disableText]}
        >
          Available Soon
        </Button>
      );
    } else if (status === UserTaskStatusEnum.Claimed) {
      return (
        <Button
          disabled
          style={[styles.baseButton, styles.disabledButton]}
          textStyle={[styles.baseText, styles.disableText]}
        >
          Claimed
        </Button>
      );
    } else if (status === UserTaskStatusEnum.Claimable) {
      return (
        <Button
          style={[
            styles.baseButton,
            claimedSet.includes(taskType) && styles.disabledButton,
          ]}
          loading={claimingSet.includes(taskType)}
          disabled={claimedSet.includes(taskType)}
          textStyle={[styles.baseText]}
          loadingText={"Loading"}
          onPress={() => handleCollectGems()}
        >
          {/* <CheckOutlineIcon color="white" fontSize="16px" /> */}
          <Text style={{ marginLeft: 6 }}>
            {claimedSet.includes(taskType) ? "Claimed" : "Claime"}
          </Text>
        </Button>
      );
    } else {
      return (
        <Button
          disabled={
            taskType === UserTaskTypeEnum.inviteeMessage ||
            taskType === UserTaskTypeEnum.customBotMessage
          }
          textStyle={[
            styles.baseText,
            (taskType === UserTaskTypeEnum.inviteeMessage ||
              taskType === UserTaskTypeEnum.customBotMessage) &&
              styles.disableText,
          ]}
          style={[
            styles.baseButton,
            (taskType === UserTaskTypeEnum.inviteeMessage ||
              taskType === UserTaskTypeEnum.customBotMessage) &&
              styles.disabledButton,
          ]}
          onPress={() => handleGo()}
        >
          {taskType === UserTaskTypeEnum.inviteeMessage ||
          taskType === UserTaskTypeEnum.customBotMessage
            ? "Clain"
            : "Go"}
        </Button>
      );
    }
  }, [claimingSet, claimedSet, handleCollectGems, handleGo]);

  return <>{buttonRender}</>;
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 999,
    backgroundColor: "#FFF",
    width: 120,
    borderColor: "#E4E5E7",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    borderWidth: 1,
    height: 32,
  },
  disabledButton: {
    backgroundColor: "#FAFBFB",
    borderColor: "#D2D5D8",
  },
  baseText: {
    fontSize: 14,
    color: "#3E5CFA",
    lineHeight: 20,
    fontWeight: "600",
  },
  disableText: {
    color: "#8C9196",
  },
});

export default ButtonGroup;
