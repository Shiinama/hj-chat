import { Overlay, Toast } from "@fruits-chain/react-native-xiaoshu";
import { useBoolean } from "ahooks";
import { useRouter } from "expo-router";
import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import {
  removeBotFromChatList,
  resetHistory,
  setBotPinnedStatus,
} from "../../api";
import { ChatContext } from "../../app/(app)/chat/chatContext";
import audio from "../../assets/images/audio.jpg";
import Keyborad from "../../assets/images/chat/keyborad.svg";
import Lines from "../../assets/images/chat/lines.svg";
import Send from "../../assets/images/chat/send.svg";
import CallBackManagerSingle from "../../utils/CallBackManager";
import AudioAnimation from "./audioAnimation";
import RecordButton from "./RecordButton";
import ShareToPopup from "./shareToPopup";
import ToolsModal, { ActionType } from "./toolsModal";

export interface MTextInputProps extends TextInputProps {
  onEndEditText?: (value: string) => void;
  startRecording: () => void;
  stopRecording: () => void;
  setAuInfo: (audioFileUri: string) => void;
  uid: string;
  userId: number;
  pinned: boolean;
}

type Props = {
  minInputToolbarHeight: number;
  inputTextProps: MTextInputProps;
  barHeight;
  setBarHeight;
  toolsBottm;
  onInputSizeChanged?: (layout: { width: number; height: number }) => void;
  haveHistory?: boolean;
};

function InputToolsTar({
  setBarHeight,
  barHeight,
  inputTextProps,
  haveHistory,
  toolsBottm,
  minInputToolbarHeight,
}: Props) {
  const {
    startRecording,
    stopRecording,
    setAuInfo,
    onEndEditText,
    pinned: originalPinned,
    uid,
    userId,
    ...inputProps
  } = inputTextProps;
  const { setValue: setChatValue } = useContext(ChatContext);
  const [pinned, setPinned] = useState(originalPinned);
  const [position, setPosition] = useState("absolute");
  const [toolsVisible, { set: setToolsVisible }] = useBoolean(false);
  const [audioFileUri, setAudioFileUri] = useState("");
  const [text, setText] = useState("");
  const [flag, setFlag] = useState<boolean>(false);
  // 控制话筒弹出
  const [isShow, setIsShow] = useState(false);
  const [showAni, setShowAni] = useState(true);
  // 控制send按钮
  const [showSend, setShowSend] = useState(true);
  const inputRef = useRef(null);
  const router = useRouter();
  const AnimationRef = useRef(null);
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      () => {
        if (Platform.OS === "android") return;
        setIsShow(true);
        setPosition("relative");
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        if (Platform.OS === "android") return;
        setPosition("absolute");
      },
    );

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        if (Platform.OS === "ios") return;
        setIsShow(true);
        setPosition("relative");
      },
    );
    const KeyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        if (Platform.OS === "ios") return;
        setPosition("absolute");
      },
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
    if (!haveHistory && key !== "RemoveFromList" && key !== "Pin") {
      Toast("No chat content");
      return;
    }
    switch (key) {
      case "Pin":
        const { close: pinnedClose } = Toast.loading(
          pinned ? "Unpin" : "Pinned",
        );
        setBotPinnedStatus({ botUid: uid, pinned: !pinned }).then(() => {
          setPinned(!pinned);
          pinnedClose();
          CallBackManagerSingle().execute("botList");
        });
        break;
      case "RemoveFromList":
        const { close: removeClose } = Toast.loading("Move...");
        removeBotFromChatList({ botUid: uid }).then(() => {
          removeClose();
          CallBackManagerSingle().execute("botList");
          router.push({ pathname: "(tabs)" });
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

  const inputBottmTollsBar = () => {
    return (
      <RecordButton
        isShow={isShow}
        AnimationRef={AnimationRef}
        recordMaxSecond={90}
        setIsShow={setIsShow}
        setShowAni={setShowAni}
        setAudioFileUri={setAudioFileUri}
        audioFileUri={audioFileUri}
        setAuInfo={setAuInfo}
        startRecording={startRecording}
        stopRecording={stopRecording}
      ></RecordButton>
    );
  };

  const renderLeftInput = () => {
    return (
      <>
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
        <ShareToPopup />
        <TouchableOpacity
          style={styles.toolsIcon}
          onPress={() => {
            setToolsVisible(true);
            /** 底部高度ios获取不正确 */
            if (Platform.OS === "ios") {
              inputRef.current?.blur();
            }
          }}
        >
          <Lines></Lines>
        </TouchableOpacity>
      </>
    );
  };

  const renderRightInput = useMemo(() => {
    if (!showSend)
      return (
        <TouchableOpacity
          style={styles.toolsIcon}
          disabled={flag}
          onPress={async () => {
            if (flag) return;
            if (text.length === 0) {
              Alert.alert("Please enter your message");
            }
            setFlag(true);
            await onEndEditText?.(text);
            setText("");
            setFlag(false);
          }}
        >
          <Send></Send>
        </TouchableOpacity>
      );
    return (
      <>
        {isShow ? (
          <TouchableOpacity
            style={styles.toolsIcon}
            onPress={() => {
              setIsShow(false);
              Keyboard.dismiss();
            }}
          >
            <Image style={styles.Icon} source={audio}></Image>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.toolsIcon}
            onPress={() => {
              setIsShow(true);
              handleButtonPress();
            }}
          >
            <Keyborad fill={"#2D3748"}></Keyborad>
          </TouchableOpacity>
        )}
      </>
    );
  }, [isShow, showSend, text]);
  useEffect(() => {
    setShowSend(!text.length);
  }, [text]);
  return (
    <View
      style={
        [
          styles.container,
          { position },
          { paddingTop: isShow ? 0 : 10 },
        ] as ViewStyle
      }
      onLayout={(e) => {
        setBarHeight(e.nativeEvent.layout.height);
      }}
    >
      <>
        <View
          style={{
            ...styles.primary,
            height: isShow ? minInputToolbarHeight : minInputToolbarHeight / 2,
            marginBottom: toolsBottm,
          }}
        >
          {
            <>
              {showAni ? (
                <>
                  {renderLeftInput()}
                  <View
                    style={{
                      flex: 1,
                      marginHorizontal: 10,
                      borderRadius: 6,
                      backgroundColor: "white",
                    }}
                  >
                    <TextInput
                      ref={inputRef}
                      returnKeyType="default"
                      blurOnSubmit={false}
                      multiline={true}
                      maxLength={500}
                      placeholder="Write a message"
                      style={[styles.textInput]}
                      onTextInput={(e) => {
                        if (!text.length) {
                          setText(e.nativeEvent.text);
                        }
                      }}
                      onChangeText={setText}
                      value={text}
                      {...inputTextProps}
                      {...inputProps}
                    />
                  </View>
                  {renderRightInput}
                </>
              ) : (
                <AudioAnimation ref={AnimationRef}></AudioAnimation>
              )}
            </>
          }
        </View>
        {inputBottmTollsBar()}
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#b2b2b2",
    backgroundColor: "#F6F6F6",
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    // marginBottom: 10,
  },
  toolsIcon: {
    width: 35,
    height: 35,
    borderRadius: 6,
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
    paddingTop: Platform.select({
      ios: 8,
      android: 0,
    }),
    minHeight: 35,
    maxHeight: 105,
    borderRadius: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    fontSize: 16,
  },
});

export default memo(InputToolsTar);
