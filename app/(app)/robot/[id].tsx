import { Toast } from "@fruits-chain/react-native-xiaoshu";
import Clipboard from "@react-native-clipboard/clipboard";
import { useNavigation, useRouter, useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import {
  postAddBotToChatList,
  postPublishBot,
  setBotPrivate,
} from "../../../api/robot";
import { getBotSharingCode } from "../../../api/setting";
import chat from "../../../assets/images/setting/chat.png";
import editIcon from "../../../assets/images/setting/edit.png";
import publishIcon from "../../../assets/images/setting/publish.png";
import share from "../../../assets/images/setting/share.png";
import xiajia from "../../../assets/images/setting/xiajia.png";
import Back from "../../../assets/images/tabbar/back.svg";
import LinearText from "../../../components/common/linearText";
import Tag from "../../../components/common/tag";
import { renderImage } from "../../../components/profileInfo/helper";
import System from "../../../constants/System";
import { TagFromType, useTagList } from "../../../constants/TagList";
import usebotStore from "../../../store/botStore";
import useUserStore from "../../../store/userStore";
import CallBackManagerSingle from "../../../utils/CallBackManager";
import { styles } from "./style";

export default function Robot() {
  const router = useRouter();
  const navigation = useNavigation();
  const botStore = usebotStore().botBaseInfo;
  const userStore = useUserStore.getState().profile;
  const tags = useTagList(botStore, TagFromType.Robot);
  const isMinme = userStore?.id === botStore?.userId;
  useEffect(() => {
    navigation.setOptions({
      title: "Robot",
      headerLeft: () => {
        return (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 24,
              height: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Back></Back>
          </TouchableOpacity>
        );
      },
    });
  }, []);

  const renderButton = () => {
    if (isMinme) {
      if (botStore?.privateBotId) {
        if (botStore?.status === "Public") {
          return (
            <TouchableOpacity
              onPress={() => {
                const { close, setMessage } = Toast.loading({
                  message: "Waiting",
                  duration: 0,
                });
                setBotPrivate({ botUid: botStore?.uid })
                  .then(() => {
                    setMessage("Unpublished successfully");
                    CallBackManagerSingle().execute("ugcbotAllList");
                    CallBackManagerSingle().execute(
                      "ugcbotList",
                      botStore?.uid,
                    );
                  })
                  .finally(() => {
                    close();
                  });
              }}
              style={styles.actionsItem}
            >
              <Image
                source={xiajia}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
              <Text style={styles.actionsItemText}>Unpublish</Text>
            </TouchableOpacity>
          );
        }
      } else {
        return (
          <>
            <TouchableOpacity
              onPress={() =>
                Toast("Please use a desktop browser to create a robot")
              }
              style={{ ...styles.actionsItem }}
            >
              <Image
                source={editIcon}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
              <Text style={styles.actionsItemText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const { close, setMessage } = Toast.loading({
                  message: "Waiting",
                  duration: 0,
                });
                postPublishBot({ botUid: botStore?.uid })
                  .then(() => {
                    setMessage("Published successfully");
                    CallBackManagerSingle().execute("ugcbotAllList");
                    CallBackManagerSingle().execute("ugcbotList");
                  })
                  .finally(() => {
                    close();
                  });
              }}
              style={styles.actionsItem}
            >
              <Image
                source={publishIcon}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
              <Text style={styles.actionsItemText}>Publish</Text>
            </TouchableOpacity>
          </>
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {renderImage(botStore?.logo, {
          width: 100,
          height: 100,
          borderRadius: 100,
        })}
        <View style={styles.user}>
          <LinearText
            text={botStore?.name}
            styles={styles.userName}
          ></LinearText>
        </View>
        <View style={styles.tagList}>
          {tags && tags.map((item) => <Tag key={item.id} {...item}></Tag>)}
        </View>
        {
          <View style={styles.actions}>
            <>
              <TouchableOpacity
                style={styles.actionsItem}
                onPress={() => {
                  const { close } = Toast.loading({
                    message: "Waiting",
                    duration: 0,
                  });
                  postAddBotToChatList({ botUid: botStore?.uid })
                    .then((res) => {
                      if (res) {
                        usebotStore.setState({ botBaseInfo: res });
                        router.push({
                          pathname: `chat/${botStore?.id}`,
                        });
                        CallBackManagerSingle().execute("botList");
                      }
                    })
                    .finally(() => {
                      close();
                    });
                }}
              >
                <Image
                  source={chat}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
                <Text style={styles.actionsItemText}>Chat</Text>
              </TouchableOpacity>
              {renderButton()}
              <TouchableOpacity
                onPress={() => {
                  getBotSharingCode({ botUid: botStore?.uid }).then((res) => {
                    Clipboard.setString(`${System.botShareLink}${res}`);
                    Toast("Copied");
                  });
                }}
                style={styles.actionsItem}
              >
                <Image
                  source={share}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
                <Text style={styles.actionsItemText}>Share</Text>
              </TouchableOpacity>
            </>
          </View>
        }
        <ScrollView style={styles.description}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionValue}>{botStore?.description}</Text>
        </ScrollView>
      </View>
    </View>
  );
}
