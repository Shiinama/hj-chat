import { Popup, Toast } from "@fruits-chain/react-native-xiaoshu";
import Clipboard from "@react-native-clipboard/clipboard";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as WebBrowser from "expo-web-browser";
import { FC, useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { createSharedConversation } from "../../api";
import { ChatContext } from "../../app/(app)/chat/chatContext";
import CopyLinkIcon from "../../assets/images/chat/copy_link.svg";
import SaveIcon from "../../assets/images/chat/save_img.svg";
import TwitterIcon from "../../assets/images/chat/twitter.svg";
import systemConfig from "../../constants/System";
import { ensureDirExists, imageDir } from "../../utils/filesystem";
// import { ensureDirExists } from '../../utils/filesystem
type shareAction = "save" | "link" | "twitter";
const ShareToPopup = () => {
  const { value, setValue } = useContext(ChatContext);
  const saveImage = async (uri) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status != "granted") {
      return;
    }
    await MediaLibrary.saveToLibraryAsync(uri);
    Toast("Image successfully saved");
  };
  const action = (key: shareAction) => {
    if (value?.selectedItems?.length <= 0) {
      Toast("Please select at least one chat!");
      return false;
    }
    const { close: clearClose } = Toast.loading("Sharing");
    // https://share.vinstic.com/share/101952a812444b22a83fd4e4dcb99a46/download
    createSharedConversation(value.selectedItems).then(async (res) => {
      switch (key) {
        case "save":
          const isExists = await ensureDirExists();
          if (!isExists) {
            Toast("File system error!");
            return;
          }
          const { uri } = await FileSystem.downloadAsync(
            `${systemConfig.downloadHost}/${res}/download`,
            `${imageDir}` + `${res}.png`,
          );
          await saveImage(uri);

          break;
        case "link":
          Clipboard.setString(`${systemConfig.shareLink}${res}`);
          clearClose();
          Toast("Copied!");
          break;
        case "twitter":
          WebBrowser.openBrowserAsync(
            `https://twitter.com/intent/tweet?url=${systemConfig.shareLink}${res}&text=@myshell_ai`,
          );
          break;
        default:
          break;
      }
    });

    setValue({ selectedItems: [], pageStatus: "normal" });
  };
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
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              action("save");
            }}
          >
            <SaveIcon />
            <Text style={styles.itemText}>Save Img</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              action("link");
            }}
          >
            <CopyLinkIcon />
            <Text style={styles.itemText}>Copy Link</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              action("twitter");
            }}
          >
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
