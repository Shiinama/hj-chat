import { Button, Toast } from "@fruits-chain/react-native-xiaoshu";
import { useMemoizedFn, useSetState } from "ahooks";
import { Buffer } from "buffer";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { v4 as uuidv4 } from "uuid";

import { chatHistory } from "../../../api";
import To from "../../../assets/images/chat/to.svg";
import Back from "../../../assets/images/tabbar/back.svg";
import AudioPayManagerSingle from "../../../components/chat/audioPlayManager";
import ChatItem from "../../../components/chat/chatItem";
import Container from "../../../components/chat/container";
import SocketStreamManager from "../../../components/chat/socketManager";
import { MessageDto } from "../../../components/chat/type";
import ShellLoading from "../../../components/common/loading";
import Tag from "../../../components/common/tag";
import { TagFromType, useTagList } from "../../../constants/TagList";
import botStore from "../../../store/botStore";
import useUserStore from "../../../store/userStore";
import CallBackManagerSingle from "../../../utils/CallBackManager";
import { convert4amToMp3 } from "../../../utils/convert";
import { ChatContext, ChatPageState } from "./chatContext";

export type ChatItem = MessageDto;
function Chat({}) {
  const { pinned, logo, name, uid, userId } = botStore.getState().botBaseInfo;
  const { profile } = useUserStore();
  const router = useRouter();
  const tags = useTagList(
    botStore.getState().botBaseInfo,
    TagFromType.Chat,
  ).slice(0, 4);
  const safeTop = useSafeAreaInsets().top;
  /** 页面数据上下文 */
  const [chatPageValue, setChatPageValue] = useSetState<ChatPageState>({
    pageStatus: "normal",
    selectedItems: [],
  });
  const navigation = useNavigation();

  // 不需要重新渲染的无需存放useState,造成不必要的渲染
  const recordingRef = useRef<Audio.Recording>();
  const [loading, setLoading] = useState<boolean>(true);
  const [chatData, setChatData] = useState<ChatItem[]>([]);
  const [voice, setVoice] = useState(null);
  const flatList = useRef<FlatList>();
  const [showLoadMoring, setShowLoadMoring] = useState(false);
  const chatDataInfo = useRef({
    isTouchList: false, // 用户是否touch了list，用户touch后如果触发list的onEndReached才去加载更多
    pageSize: 10, // 每页加载多少条数据
    hasMore: true,
  });

  async function startRecording() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          if (status.isRecording) {
            // 主界面不用关心录音的状态，造成过多无用的渲染，交给callBack，谁需要这个数据谁去执行回调
            CallBackManagerSingle().executeLike(
              "recordingChange",
              status.durationMillis,
            );
          }
        },
      );
      recordingRef.current = recording;
      // setRecording(recording)
      return true;
    } catch (err) {
      Toast("Failed to start recording");
      return false;
    }
  }

  const loadData = useMemoizedFn((loadMore?: boolean) => {
    if (loadMore) {
      setShowLoadMoring(true);
    }
    chatHistory({
      botUid: uid,
      offset: loadMore ? chatData.length : 0,
      limit: chatDataInfo.current.pageSize,
      beforeId:
        chatData.length > 0 && loadMore
          ? chatData[chatData.length - 1].id
          : undefined,
    })
      .then(({ data }: { data: Array<MessageDto> }) => {
        data?.map((item) => {
          // 查找正在接收的内容，type置为loading
          const msgKey = item.botId + "&BOT&" + item.replyUid;
          const messageText =
            SocketStreamManager().getMessageTextStream(msgKey);
          if (messageText) {
            item.type = "LOADING";
            item.text = messageText;
          }
        });
        setChatData(!loadMore ? data : [...chatData, ...data]);
        if (data.length < chatDataInfo.current.pageSize) {
          chatDataInfo.current.hasMore = false;
        }
        chatDataInfo.current.isTouchList = false;
        setShowLoadMoring(false);
        setLoading(false);
      })
      .catch(() => {
        chatDataInfo.current.isTouchList = false;
        setShowLoadMoring(false);
        setLoading(false);
      });
  });

  useEffect(() => {
    try {
      Audio.requestPermissionsAsync();
      new Audio.Recording();
      Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    } catch (err) {
      Toast("Failed to start recording");
    }
    loadData();
    return () => {
      // 单列模式里面的sound销毁
      AudioPayManagerSingle().destory();
      try {
        // 退出的时候录音停止销毁
        recordingRef.current?.stopAndUnloadAsync?.();
        recordingRef.current = undefined;
      } catch (error) {}
    };
  }, [loadData]);
  async function stopRecording() {
    try {
      await recordingRef.current?.stopAndUnloadAsync();
      const uri = recordingRef.current?.getURI();
      const mp3Uri = await convert4amToMp3(uri);
      const buffer = await FileSystem.readAsStringAsync(mp3Uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const fileBuffer = Buffer.from(
        `data:audio/mpeg;base64,${buffer}`,
        "base64",
      );
      setVoice(fileBuffer);
      const { exists } = await FileSystem.getInfoAsync(mp3Uri);
      if (exists) {
        try {
          await FileSystem.deleteAsync(mp3Uri);
        } catch (error) {}
      }
      return uri;
    } catch (err) {}
  }
  function setAuInfo() {
    sendAudio();
  }

  const sendAudio = async () => {
    if (!AudioPayManagerSingle().netInfo?.isConnected) {
      Alert.alert("Please check your network connection");
      return;
    }
    const reqId = uuidv4();

    SocketStreamManager().sendMessage("voice_chat", {
      reqId,
      botUid: uid,
      voice,
    });
    setVoice(null);
  };

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          style={{
            backgroundColor: "white",
            paddingTop: safeTop,
            paddingHorizontal: 10,
            borderBottomWidth: 1,
            position: "relative",
            borderColor: "#E0E0E0",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                position: "absolute",
                left: 5,
                height: 24,
                width: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Back></Back>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: `robot/${uid}`,
                });
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                maxWidth: 200,
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  marginRight: 5,
                  fontSize: 20,
                  lineHeight: 30,
                  fontWeight: "700",
                }}
              >
                {name}
              </Text>
              <To width={12} height={14}></To>
            </TouchableOpacity>
            <View style={{ position: "absolute", right: 0 }}>
              {chatPageValue.pageStatus === "sharing" && (
                <Button
                  type="ghost"
                  text="Cancel"
                  color="#7A2EF6"
                  size="s"
                  style={{ borderRadius: 8 }}
                  onPress={() => {
                    setChatPageValue({
                      pageStatus: "normal",
                      selectedItems: [],
                    });
                  }}
                />
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginVertical: 10,
              justifyContent: "center",
            }}
          >
            {tags.map((tag) => (
              <Tag key={tag.id} {...tag}></Tag>
            ))}
          </View>
        </View>
      ),
    });
  }, [
    navigation,
    name,
    chatPageValue.pageStatus,
    router,
    safeTop,
    setChatPageValue,
    tags,
    uid,
  ]);

  // socket回调
  useEffect(() => {
    SocketStreamManager().resetPlayStream();
    SocketStreamManager().onSendMessage = (data) => {
      if (!data?.data) return;
      if (chatData.some((i) => i.id === data.data.id)) return;
      setChatData((list) => {
        // 发送消息成功添加一个待回复的item
        return [
          {
            type: "LOADING",
            ...data.data,
          },
          ...list,
        ];
      });
      flatList.current?.scrollToIndex?.({ index: 0 });
    };
    SocketStreamManager().onMessageClear = (data) => {
      if (!data) return;
      setChatData((list) => {
        // 发送消息成功添加一个待回复的item
        return [data, ...list];
      });
      flatList.current?.scrollToIndex?.({ index: 0 });
    };
    SocketStreamManager().onUpdateMessage = (updateMessage) => {
      if (!updateMessage) return;
      setChatData((pre) => {
        const index = pre.findIndex((item) => item.uid === updateMessage.uid);
        if (index < 0) {
          return pre;
        }
        pre[index] = { ...pre[index], text: updateMessage.text };
        return [...pre];
      });
    };
    SocketStreamManager().onResMessageCreated = (data) => {
      if (!data) return;
      if (chatData.some((i) => i.id === data.id)) return;
      setChatData((list) => {
        // 开始接收流 更新或新增一个回复的item
        let have = false;
        const newList = list.map((item) => {
          if (item.replyUid === data?.replyUid) {
            have = true;
            item = { ...data, type: "LOADING" };
          }
          return item;
        });
        return !have
          ? [{ ...data, type: "LOADING" }, ...newList]
          : [...newList];
      });
    };
    SocketStreamManager().currentBot = botStore.getState();
    return () => {
      SocketStreamManager().resetPlayStream();
    };
  }, []);
  const loadNextData = () => {
    try {
      if (
        !chatDataInfo.current.hasMore ||
        !chatDataInfo.current.isTouchList ||
        showLoadMoring
      ) {
        return;
      }
      loadData(true);
    } catch (e) {}
  };

  if (loading) return <ShellLoading></ShellLoading>;
  return (
    <ChatContext.Provider
      value={{ value: chatPageValue, setValue: setChatPageValue }}
    >
      <Container
        haveHistory={chatData.length > 0}
        inputTextProps={{
          uid,
          userId,
          pinned,
          setAuInfo,
          startRecording,
          stopRecording,
          onEndEditText: async (value: string) => {
            const reqId = uuidv4();
            await SocketStreamManager().sendMessage("text_chat", {
              reqId,
              botUid: uid,
              text: value,
            });
          },
        }}
        flatListRef={flatList}
        flatListProps={{
          data: chatData,
          inverted: true,
          onTouchStart: () => {
            // inverted: true 颠倒列表，往上滑就是加载更多了 上变为下，数据也是一样，加载完数据就无需排序和调用scrollEnd了，并且新增一条消息也无需调用scrollEnd
            // 防止进来渲染数据的时候 触发onEndReached去加载更多，用户手动滑动的时候再去加载更多
            chatDataInfo.current.isTouchList = true;
          },
          onEndReached: () => {
            // 分页，颠倒列表 inverted为true往上滑就会调用此方法，原来是往下滑调用这个方法，往上滑是调用onRefresh
            loadNextData();
          },
          ListFooterComponent: showLoadMoring ? (
            <View
              style={{
                width: "100%",
                marginVertical: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShellLoading />
            </View>
          ) : null,
          onEndReachedThreshold: 0.2,
          renderItem: ({ item }) => {
            return (
              <View key={item.id}>
                <ChatItem
                  me={profile?.avatar}
                  logo={logo}
                  item={item}
                ></ChatItem>
              </View>
            );
          },
        }}
      ></Container>
    </ChatContext.Provider>
  );
}

export default React.memo(Chat);
