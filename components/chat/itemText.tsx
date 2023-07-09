import { Loading } from "@fruits-chain/react-native-xiaoshu";
import { BlurView } from "@react-native-community/blur";
import { memo, useEffect, useMemo, useState } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Markdown from "react-native-marked";
import { v4 as uuidv4 } from "uuid";

import Blur from "../../assets/images/chat/blur.svg";
import Svt from "../../assets/images/chat/svt.svg";
import Translate from "../../assets/images/chat/translte.svg";
import { BotInfo } from "../../types/BotTypes";
import { MessageDetail } from "../../types/MessageTyps";
import SocketStreamManager from "./socketManager";
import styles from "./styles";

type Props = {
  item: MessageDetail;
  botSetting: BotInfo["botSetting"];
  isDone: boolean;
};
const MessageText = ({ item, botSetting, isDone }: Props) => {
  const [messageStreamText, setMessageStreamText] = useState<string>();
  const isFail = useMemo(
    () =>
      (isDone &&
        item.text === "I'm too busy, please try again in a few seconds") ||
      (isDone && !messageStreamText && !item.text),
    [isDone, messageStreamText, item.text],
  );
  const [translateMessage, setTranslateMessage] = useState<string>();
  const [viewDisplayState, setViewDisplayState] = useState<number>(
    botSetting?.textMasking && !isFail ? 1 : 2,
  );
  const key = item.botId + "&BOT&" + item.replyUid;
  const isBlur = botSetting?.textMasking && viewDisplayState === 1;
  const renderReply = () => {
    const param = {
      style: { marginRight: 5 },
      width: 10,
      height: 10,
    };
    const data = [
      botSetting?.textMasking &&
        !isFail && {
          id: 1,
          dText: "Blur",
          Icon: (id) => (
            <Blur
              fill={id === viewDisplayState ? "#FFFFFF" : "#6C7275"}
              {...param}
            />
          ),
        },
      {
        id: 2,
        dText: "Text",
        Icon: (id) => (
          <Svt
            fill={id === viewDisplayState ? "#FFFFFF" : "#6C7275"}
            {...param}
          />
        ),
      },
      botSetting?.textTranslation && {
        id: 3,
        dText: "Translate",
        disabled: !isDone,
        Icon: (id) => (
          <Translate
            fill={id === viewDisplayState ? "#FFFFFF" : "#6C7275"}
            width={14}
            height={14}
            style={{ marginRight: 5 }}
          />
        ),
      },
    ].filter(Boolean);
    return data.map(({ Icon, id, dText, disabled }) => (
      <TouchableOpacity
        key={dText}
        disabled={disabled}
        style={[
          styles.button,
          viewDisplayState === id && styles.active,
          { opacity: disabled && 0.5 },
        ]}
        onPress={() => {
          setViewDisplayState(id);
          if (id === 3) {
            if (caluTranslate) return;
            const reqId = uuidv4();
            SocketStreamManager().sendMessage("translate_message", {
              reqId,
              messageUid: item.uid,
            });
          }
        }}
      >
        {Icon && Icon(id)}
        <Text style={{ color: viewDisplayState === id ? "white" : "black" }}>
          {dText}
        </Text>
      </TouchableOpacity>
    ));
  };
  const loadingRender = () => {
    return (
      <View
        style={{
          ...styles.loadingBox,
          backgroundColor: item.replyUid ? "#F6F6F6" : "#F1EAFE",
        }}
      >
        <Text style={styles.loadingText}>Replying</Text>
      </View>
    );
  };

  useEffect(() => {
    if (item.type === "LOADING" && item.replyUid) {
      SocketStreamManager().addTextStreamCallBack(key, (data) => {
        setMessageStreamText(data.text);
        if (data.isFinal) {
          SocketStreamManager().removeTextStreamCallBack(key);
        }
      });
    } else {
      SocketStreamManager().removeTextStreamCallBack(key);
    }
    return () => {
      SocketStreamManager().removeTextStreamCallBack(key);
    };
  }, [item.text, item.replyUid, item.type, key]);
  useEffect(() => {
    SocketStreamManager().addTranslatedCallBack(key, (data) => {
      setTranslateMessage(data.translation);
    });

    return () => {
      SocketStreamManager().removeTranslatedCallBack(key);
    };
  }, []);
  const renderText = useMemo(() => {
    if (isFail) {
      return "I'm too busy, please try again in a few seconds";
    }
    return messageStreamText || item.text;
  }, [messageStreamText, item.text, isFail]);
  const caluTranslate = useMemo(() => {
    return translateMessage || item.translation;
  }, [translateMessage, item.translation]);
  if (!renderText) return loadingRender();
  return (
    <>
      <View style={[styles.content]}>
        {isBlur && item?.replyUid && (
          <TouchableWithoutFeedback onPress={() => setViewDisplayState(2)}>
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={2}
              reducedTransparencyFallbackColor="white"
            />
          </TouchableWithoutFeedback>
        )}

        {(viewDisplayState === 1 || viewDisplayState === 2) && (
          <Markdown
            styles={{
              code: { backgroundColor: "#fff", padding: 16 },
              paragraph: {
                backgroundColor: item.replyUid ? "#F6F6F6" : "#F1EAFE",
              },
            }}
            value={renderText}
            flatListProps={{
              initialNumToRender: 8,
            }}
          />
        )}
        {viewDisplayState === 3 &&
          (caluTranslate ? (
            <Text>{caluTranslate}</Text>
          ) : (
            <Loading color="#7A2EF6">Translating</Loading>
          ))}
      </View>

      {item?.replyUid && (
        <View style={styles.buttonGroup}>{renderReply()}</View>
      )}
    </>
  );
};

export default memo(MessageText);
