import dayjs from "dayjs";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Pined from "../../assets/images/tabbar/pin.svg";
import RootStyles from "../../constants/RootStyles";
import { renderImage } from "../profileInfo/helper";

function BotCard({ ld, onShowDetail, showPined }: any) {
  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        onShowDetail(ld);
      }}
    >
      {renderImage(ld.logo, styles.avatar)}
      <View
        style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}
      >
        <View style={styles.listItemTop}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
              {ld.name}
            </Text>
          </View>
          <Text style={styles.time}>
            {ld.lastMessage
              ? dayjs().isSame(dayjs(ld.lastMessage.createdDate), "day")
                ? dayjs(ld.lastMessage.createdDate).format("HH:mm")
                : dayjs().isSame(dayjs(ld.lastMessage.createdDate), "year")
                ? dayjs(ld.lastMessage.createdDate).format("MM-DD")
                : dayjs(ld.lastMessage.createdDate).format("YYYY-MM-DD")
              : ""}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "95%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.message}>
            {ld?.lastMessage?.text}
          </Text>
          {showPined && <Pined></Pined>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: RootStyles.flexCenter,
  listContainer: {
    width: "100%",
    height: "100%",
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 99,
    marginHorizontal: 12,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    padding: 12,
    gap: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    height: 76,
    marginBottom: 12,
    flexDirection: "row",
  },
  listItemTop: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },

  listItemMid: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#F6F6F6",
    paddingVertical: 2,
    marginRight: 12,
  },

  name: {
    fontWeight: "bold",
    fontSize: 16,
    // maxWidth: '80%',
    color: "#1F1F1F",
    // backgroundColor: 'red',
  },

  message: {
    // marginTop: 5,
    color: "#B9B9B9",
  },

  time: {
    color: "#B9B9B9",
    lineHeight: 12,
    fontSize: 12,
  },

  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export default BotCard;
