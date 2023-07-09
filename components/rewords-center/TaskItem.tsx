import { Popover } from "@fruits-chain/react-native-xiaoshu";
import dayjs from "dayjs";
import { Image } from "expo-image";
import { FunctionComponent, memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import Circle from "../../assets/images/rewards-center/Circle.png";
import Tooltip from "../../assets/images/rewards-center/Tooltip.svg";
import { TASK_EMOJI_MAP, TaskDesc } from "../../constants/task";
import { Task, UserTaskStatusEnum, UserTaskTypeEnum } from "../../types/task";
import { camelToSnake } from "../../utils";
import ButtonGroup from "./buttonGroup";
interface TaskItemProps {
  item: Task;
  endDate: string;
}

const TaskItem: FunctionComponent<TaskItemProps> = ({
  item,
  endDate = Date.now(),
}) => {
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Text style={{ fontSize: 30 }}>
          {TASK_EMOJI_MAP[item.taskType] || ""}
        </Text>
        <View style={{ maxWidth: 200 }}>
          <View style={{ flexDirection: "row" }}>
            <Popover
              statusBarTranslucent
              dark
              disabled={item.taskType !== UserTaskTypeEnum.dailyMessage}
              arrow={false}
              content={
                <Popover.Text
                  style={{ maxWidth: 200 }}
                  text={`Refreshed daily at ${dayjs(endDate).format("HH:mmA")}`}
                />
              }
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{ fontSize: 14, color: "#202223", lineHeight: 24 }}
                >
                  {TaskDesc[camelToSnake(item.taskType)].title}
                </Text>
                {item.taskType === UserTaskTypeEnum.dailyMessage && (
                  <Tooltip width={20} fill={"#F5F7FA"} height={20}></Tooltip>
                )}
              </View>
            </Popover>
          </View>
          <Popover
            statusBarTranslucent
            dark
            arrow={false}
            content={
              <Popover.Text
                style={{ maxWidth: 200 }}
                text={TaskDesc[camelToSnake(item.taskType)].desc}
              />
            }
          >
            <Text
              style={{ fontSize: 14, color: "#6D7175", lineHeight: 20 }}
              numberOfLines={2}
            >
              {TaskDesc[camelToSnake(item.taskType)].desc}
            </Text>
          </Popover>
        </View>
      </View>
      <View style={styles.itemRight}>
        <View style={styles.itemRightText}>
          <Image source={Circle} style={{ width: 36, height: 36 }}></Image>
          <Text style={{ fontSize: 12, color: "rgb(62, 92, 250)" }}>
            +{" "}
            {item.status === UserTaskStatusEnum.Claimed
              ? item.claimedGemCount
              : item.status === UserTaskStatusEnum.Claimable
              ? item.claimableGemCount
              : item.gemCount}
          </Text>
        </View>
        <View>
          <ButtonGroup
            userTaskUid={item.userTaskUid}
            status={item.status}
            active={item.active}
            taskType={item.taskType}
          ></ButtonGroup>
        </View>
        {item.status !== UserTaskStatusEnum.Claimed && (
          <Text
            style={{
              marginTop: 2,
              fontSize: 12,
              lineHeight: 16,
              color: "#6D7175",
            }}
          >
            {item.currentTaskProgress || 0}/{item.requiredCount}
          </Text>
        )}
      </View>
    </View>
  );
};

export default memo(TaskItem);

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    borderColor: "#E4E9F0",
    borderWidth: 1,
    borderStyle: "solid",
  },
  itemLeft: {},
  itemRight: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  itemRightText: {
    flexDirection: "row",
    alignItems: "center",
  },
});
