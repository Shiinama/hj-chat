import { useContext, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  View,
  TextInput,
  ViewStyle,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import audio from "../../assets/images/audio.jpg";
import Lines from "../../assets/images/chat/lines.svg";
import Keyborad from "../../assets/images/chat/keyborad.svg";
import Send from "../../assets/images/chat/send.svg";
import Delete from "../../assets/images/chat/delete.svg";
import MessagePlay from "../../assets/images/chat/message_play.svg";
import Messagepause from "../../assets/images/chat/message_pause.svg";
import RecordButton from "./RecordButton";
import { StyleSheet } from "react-native";
import AudioMessage from "./audioMessage";
import * as FileSystem from "expo-file-system";
import ToolsModal, { ActionType } from "./toolsModal";
import ShareToPopup from "./shareToPopup";
import { ChatContext } from "../../app/(app)/chat/chatContext";
import { Overlay, Toast } from "@fruits-chain/react-native-xiaoshu";
import {
  removeBotFromChatList,
  resetHistory,
  setBotPinnedStatus,
} from "../../api";
import { useBoolean } from "ahooks";
type Props = {
  minInputToolbarHeight: number;
  inputTextProps: TextInput["props"] & {
    startRecording: () => void;
    stopRecording: () => void;
    setAuInfo: (audioFileUri: string) => void;
    uid: string;
    userId: number;
    pinned: boolean;
  };
  onInputSizeChanged?: (layout: { width: number; height: number }) => void;
};

function InputToolsTar({
  inputTextProps,
  onInputSizeChanged,
  minInputToolbarHeight,
}: Props) {
  const {
    value,
    onChangeText,
    startRecording,
    stopRecording,
    setAuInfo,
    onSubmitEditing,
    pinned: originalPinned,
    uid,
    userId,
    ...inputProps
  } = inputTextProps;

  const { setValue: setChatValue } = useContext(ChatContext);
  const [pinned, setPinned] = useState(originalPinned);
  const [position, setPosition] = useState("absolute");
  const [barHeight, setBarHeight] = useState(0);
  const [toolsVisible, { set: setToolsVisible }] = useBoolean(false);
  const [audioFileUri, setAudioFileUri] = useState("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isShow, setIsShow] = useState(true);
  const [showSend, setShowSend] = useState(true);
  const inputRef = useRef(null);
  const audioMessageRef = useRef(null);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      () => {
        if (Platform.OS === "android") return;
        setShowSend(false);
        setPosition("relative");
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        if (Platform.OS === "android") return;
        setShowSend(true);
        setPosition("absolute");
      }
    );

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        if (Platform.OS === "ios") return;
        setShowSend(false);
        setPosition("relative");
      }
    );
    const KeyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        if (Platform.OS === "ios") return;
        setShowSend(true);
        setPosition("absolute");
      }
    );
    return () => {
      keyboardDidShowListener?.remove();
      KeyboardDidHideListener?.remove();
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);
  const handleButtonPress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toolsAction = (key: ActionType) => {
    switch (key) {
      case "Pin":
        const { close: pinnedClose } = Toast.loading(
          pinned ? "Unpin" : "Pinned"
        );
        setBotPinnedStatus({ botUid: uid, pinned: !pinned }).then(() => {
          setPinned(!pinned);
          pinnedClose();
        });
        break;
      case "RemoveFromList":
        const { close: removeClose } = Toast.loading("Move...");
        removeBotFromChatList({ botUid: uid }).then(() => {
          removeClose();
        });
        break;
      case "ClearMemory":
        const { close: clearClose } = Toast.loading("Clear Contenxt");
        resetHistory({ botUid: uid }).then(() => {
          clearClose();
        });
        break;
      case "ShareChatRecords":
        setChatValue({ pageStatus: "sharing" });
        break;

      default:
        break;
    }
    setToolsVisible(false);
  };

  return (
    <View
      style={[styles.container] as ViewStyle}
      onLayout={(e) => {
        setBarHeight(e.nativeEvent.layout.height);
      }}
    >
      <View style={[styles.wrap, { position }] as ViewStyle}>
        {!audioFileUri ? (
          <View style={{ ...styles.primary, height: minInputToolbarHeight }}>
            <Overlay
              visible={toolsVisible}
              backgroundColor="transparent"
              onPress={() => {
                setToolsVisible(false);
              }}
            >
              <ToolsModal
                bottom={barHeight}
                userId={userId}
                pinned={pinned}
                toolsAction={toolsAction}
              />
            </Overlay>
            <TouchableOpacity
              style={styles.toolsIcon}
              onPress={() => {
                setToolsVisible(true);
                /** 底部高度ios获取不正确 */
                if (Platform.OS === "ios") {
                  inputRef.current.blur();
                }
              }}
            >
              <Lines></Lines>
            </TouchableOpacity>
            <ShareToPopup />
            {isShow ? (
              <TextInput
                ref={inputRef}
                returnKeyType="default"
                blurOnSubmit={false}
                multiline={true}
                maxLength={500}
                placeholder="Wite a message"
                style={styles.textInput}
                enablesReturnKeyAutomatically
                onChangeText={(inputText) => {
                  onChangeText(inputText);
                }}
                {...inputTextProps}
                {...inputProps}
              />
            ) : (
              <RecordButton
                setAudioFileUri={setAudioFileUri}
                startRecording={startRecording}
                stopRecording={stopRecording}
              ></RecordButton>
            )}
            <TouchableOpacity
              style={styles.toolsIcon}
              onPress={() => {
                setIsShow((pre) => {
                  if (!pre) {
                    handleButtonPress();
                  }
                  return !pre;
                });
              }}
            >
              {isShow ? (
                showSend ? (
                  <Image style={styles.Icon} source={audio}></Image>
                ) : (
                  <TouchableOpacity
                    onPress={() => onSubmitEditing(value as any)}
                  >
                    <Send></Send>
                  </TouchableOpacity>
                )
              ) : (
                <Keyborad fill={"#2D3748"}></Keyborad>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ height: "100%" }}>
            <AudioMessage
              ref={audioMessageRef}
              showControl={false}
              slideWidth={500}
              audioFileUri={audioFileUri}
              onPlay={(playing) => {
                setIsPlaying(playing);
              }}
            ></AudioMessage>
            <View style={styles.accessory}>
              <TouchableOpacity
                onPress={async () => {
                  const { exists } = await FileSystem.getInfoAsync(
                    audioFileUri
                  );

                  if (exists) {
                    try {
                      await FileSystem.deleteAsync(audioFileUri);
                      Toast("Deleted recording file");
                    } catch (error) {
                      Toast("Failed to delete recording file");
                    }
                  }
                  setAudioFileUri("");
                }}
              >
                <Delete></Delete>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setIsPlaying((pre) => {
                    audioMessageRef.current.handlePlayPause();
                    return !pre;
                  })
                }
              >
                {isPlaying ? <Messagepause /> : <MessagePlay />}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setAuInfo(audioFileUri);
                  setAudioFileUri("");
                }}
              >
                <Send></Send>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#b2b2b2",
    backgroundColor: "#F6F6F6",
    position: "relative",
    height: "100%",
  },
  wrap: {
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
  },
  primary: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-around",
    paddingHorizontal: 20,
    height: 40,
  },
  accessory: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  toolsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    position: "relative",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  Icon: {
    width: 18,
    height: 18,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 8,
    // marginVertical: 12,
    textAlignVertical: "center",
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    lineHeight: 26,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: Platform.select({
      ios: 40,
      android: 40,
      web: 34,
    }),
    // marginTop: Platform.select({
    //   ios: 6,
    //   android: 0,
    //   web: 6,
    // }),
    // marginBottom: Platform.select({
    //   ios: 8,
    //   android: 8,
    //   web: 4,
    // }),
  },
});

export default InputToolsTar;
