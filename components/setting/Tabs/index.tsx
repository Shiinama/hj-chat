import { useControllableValue } from "ahooks";
import type { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface TabsProps {
  value?: string;
  onChange?: (val: string) => void;
  defaultValue?: string;
  data: { label: React.ReactNode; value: string }[];
}
const Tabs: FC<TabsProps> = ({ data, ...valueProps }) => {
  const [state, setState] = useControllableValue(valueProps);
  return (
    <View style={styles.tabs}>
      {data.map((v, i) => {
        return (
          <TouchableOpacity
            onPress={() => {
              setState(v?.value);
            }}
            key={i}
            style={[
              styles.item,
              state === v?.value ? styles.activeItem : null,
              { width: `${((1 / data?.length) * 100).toFixed(2)}%` },
            ]}
          >
            <Text
              style={[
                styles.itemText,
                state === v?.value ? styles.activeItemText : null,
              ]}
            >
              {v?.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default Tabs;

const styles = StyleSheet.create({
  tabs: {
    backgroundColor: "#F6F6F6",
    width: "100%",
    height: 48,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
  },
  item: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  itemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#797979",
  },
  activeItemText: {
    color: "#1F1F1F",
  },
  activeItem: {
    backgroundColor: "#FFF",
  },
});
