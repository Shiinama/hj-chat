import { forwardRef, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Clear from "../../assets/images/chat/clear.svg";
import Pin from "../../assets/images/chat/pin.svg";
import Remove from "../../assets/images/chat/remove.svg";
import Share from "../../assets/images/chat/share.svg";

export type ActionType =
  | "ClearMemory"
  | "ShareChatRecords"
  | "Pin"
  | "RemoveFromList";

const ToolsModal = forwardRef(
  (
    {
      userId,
      toolsAction,
      bottom,
      pinned,
    }: {
      userId: number;
      bottom: number;
      pinned: boolean;
      toolsAction: (val: ActionType) => void;
    },
    ref,
  ) => {
    const actionList = useMemo(() => {
      return [
        ...(userId
          ? [
              { name: pinned ? "Unpin" : "Pin", icon: <Pin />, key: "Pin" },
              {
                name: "Remove from list",
                icon: <Remove />,
                key: "RemoveFromList",
              },
            ]
          : []),

        { name: "Clear Memory", icon: <Clear />, key: "ClearMemory" },
        {
          name: "Share Chat Records",
          icon: <Share />,
          key: "ShareChatRecords",
        },
      ];
    }, [userId]);
    return (
      <View style={{ bottom, ...styles.popupWrap }}>
        <View style={styles.popupBody}>
          {actionList?.map((v) => {
            return (
              <TouchableOpacity
                key={v?.key}
                onPress={() => {
                  toolsAction(v?.key as ActionType);
                }}
                style={styles.iconC}
              >
                <View style={{ flexDirection: "row" }}>
                  {v.icon}
                  <Text style={{ marginLeft: 4, fontSize: 16 }}>{v?.name}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ height: 6 }} />
      </View>
    );
  },
);
ToolsModal.displayName = "ToolsModal";
const styles = StyleSheet.create({
  popupWrap: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 20,
  },
  iconC: {
    padding: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginBottom: 5,
  },
  popupBody: {
    backgroundColor: "#F6F6F6",
    borderRadius: 12,
    borderColor: "#EDEDED",
    borderWidth: 1,
    padding: 8,
  },
});

export default ToolsModal;
