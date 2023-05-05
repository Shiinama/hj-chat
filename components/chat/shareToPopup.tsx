import { ChatContext } from "../../app/chat/chatContext";
import { Popup } from "@fruits-chain/react-native-xiaoshu";
import { FC, useContext } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

import CopyLinkIcon from "../../assets/images/chat/copy_link.svg";
import SaveIcon from "../../assets/images/chat/save_img.svg";
import TwitterIcon from "../../assets/images/chat/twitter.svg";
export interface ShareToPopupProps {}
const ShareToPopup: FC<ShareToPopupProps> = () => {
  const { value } = useContext(ChatContext);
  console.log(value.selectedItems);

  return (
    <Popup
      visible={value?.pageStatus === "sharing"}
      position={"bottom"}
      overlay={false}
    >
      <View style={styles.sharePopup}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Share to</Text>
        </View>
        <View style={styles.itemWrap}>
          <TouchableOpacity style={styles.item}>
            <SaveIcon />
            <Text style={styles.itemText}>Save Img</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <CopyLinkIcon />
            <Text style={styles.itemText}>Copy Link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <TwitterIcon />
            <Text style={styles.itemText}>Twitter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Popup>
  );
};

const styles = StyleSheet.create({
  sharePopup: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E8ECEF",
    backgroundColor: "#F6F6F6",
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
    height: 58,
  },
  titleText: {
    color: "#7A2EF6",
    fontWeight: "bold",
    fontSize: 16,
  },
  itemWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 4,
    paddingBottom: 36,
  },
  item: {
    alignItems: "center",
  },
  itemText: {
    color: "#1F1F1F",
    fontSize: 14,
    marginTop: 2,
    lineHeight: 22,
  },
});
export default ShareToPopup;
