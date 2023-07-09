import { Checkbox } from "@fruits-chain/react-native-xiaoshu";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

import { ChatContext } from "../../app/(app)/chat/chatContext";
import CheckIcon from "../../assets/images/chat/check.svg";
import CheckedIcon from "../../assets/images/chat/checked.svg";
import { renderImage } from "../../components/profileInfo/helper";
import botStore from "../../store/botStore";
import { MessageDetail } from "../../types/MessageTyps";
import AudioMessage from "./audioMessage";
import ItemText from "./itemText";
import SocketStreamManager from "./socketManager";
import styles from "./styles";
type Props = {
  item: MessageDetail & number;
  children?: (() => React.ReactNode) | React.ReactNode;
  logo: string;
  me: string;
};

function ChatItem({ item, me, logo }: Props) {
  const msgKey = item.botId + "&BOT&" + item.replyUid;
  const AudioRef = useRef(null);
  const botState = botStore.getState().botBaseInfo;
  // 回复状态是否已经完成
  const [isDone, setIsDone] = useState<boolean>(false);
  const { value: chatValue, setValue: setChatValue } = useContext(ChatContext);

  useEffect(() => {
    if (item.status === "DONE") {
      setIsDone(true);
    }
  }, [item.status]);
  useEffect(() => {
    if (item.type === "LOADING" && item.replyUid) {
      SocketStreamManager().addResMessagesCallBack(msgKey, (item) => {
        if (item.status === "DONE") {
          setIsDone(true);
        }
      });
    }
    return () => {
      SocketStreamManager().removeresMessagesCallBack(msgKey);
    };
  }, [item, msgKey]);

  if (item.uid === "1231") return null;
  const tag = item?.replyUid;

  const checkboxJSX = chatValue.pageStatus === "sharing" && (
    <Checkbox
      style={styles.checkbox}
      value={chatValue?.selectedItems?.includes(item?.uid)}
      onChange={(val) => {
        if (val) {
          setChatValue({
            selectedItems: [...(chatValue?.selectedItems || []), item?.uid],
          });
        } else {
          setChatValue({
            selectedItems: chatValue?.selectedItems?.filter(
              (v) => v !== item.uid,
            ),
          });
        }
      }}
      renderIcon={({ active, onPress }) => {
        return active ? (
          <CheckedIcon onPress={onPress} />
        ) : (
          <CheckIcon onPress={onPress} />
        );
      }}
    />
  );
  if (item.type === "RESET") {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View
          style={[
            styles.contentBox,
            {
              padding: 12,
              borderRadius: 6,
              backgroundColor: "#FFF5E2",
              marginBottom: 20,
            },
          ]}
        >
          <Text>
            The memory has been cleared, your chat history is still preserved
            for you, but the robot will no longer remember the content of these
            conversations.
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.itemWrap}>
      <View style={[styles.msgBox, tag ? styles.you : styles.me]}>
        <View style={styles.avatar}>
          {renderImage(tag ? logo : me, styles.avatar)}
        </View>

        <View
          style={[
            styles.contentBox,
            { flexDirection: tag ? "row" : "row-reverse" },
          ]}
        >
          <View style={[tag ? styles.youContent : styles.meContent]}>
            {(item.type === "VOICE" ||
              (botState?.botSetting?.outputVoice && item.replyUid)) && (
              <AudioMessage item={item} isDone={isDone} ref={AudioRef} />
            )}
            <ItemText
              item={item}
              isDone={isDone}
              botSetting={botState?.botSetting}
            ></ItemText>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>
      {checkboxJSX}
    </View>
  );
}

export default memo(ChatItem);
