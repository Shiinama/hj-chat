import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { botList } from "../../api/index";
import BotCard from "../../components/chat/botCard";
import ShellLoading from "../../components/common/loading";
import RootStyles from "../../constants/RootStyles";
import { useAuth } from "../../context/auth";
import botStore from "../../store/botStore";

type ListDataItem = {
  id: number;
  uid: string;
  name: string;
  description: string;
  userId: number;
  logo: string;
  language: string;
  pinned: boolean;
  lastInteractionDate: string;
};

import { useBoolean } from "ahooks";

import { removeBotListLocal } from "../../api/botChatListCache";
import SocketStreamManager from "../../components/chat/socketManager";
import CallBackManagerSingle from "../../utils/CallBackManager";

export default function TabOneScreen() {
  const router = useRouter();
  const [listData, setListData] = useState<ListDataItem[]>([]);
  const [refreshLoading, { set: setRefreshLoading }] = useBoolean(false);

  const [loading, setLoading] = useState<boolean>(true);
  const { signOut } = useAuth();
  // 每次进入页面清除botBaseInfo
  useFocusEffect(
    useCallback(() => {
      botStore.setState({ botBaseInfo: null });
      SocketStreamManager().currentBot = botStore.getState();
    }, []),
  );

  const loadData = (flash?: boolean) => {
    botList(flash)
      .then((res) => {
        setListData(res as ListDataItem[]);
      })
      .finally(() => {
        setLoading(false);
        setRefreshLoading(false);
      });
  };

  useEffect(() => {
    // 冷启动App强制刷新缓存 请求接口获取数据  flash 为  true
    loadData(true);
    CallBackManagerSingle().add("botList", () => {
      loadData(true);
    });
    DeviceEventEmitter.addListener("logout", (item) => {
      // 会话超时清楚本地缓存
      removeBotListLocal();
      setListData([]);
      signOut();
    });
    SocketStreamManager();
    return () => {
      CallBackManagerSingle().remove("botList");
      SocketStreamManager(true);
    };
  }, []);

  const onShowDetail = (event) => {
    botStore.setState({ botBaseInfo: event });
    router.push({
      pathname: `chat/${event.uid}`,
    });
  };

  if (loading) return <ShellLoading></ShellLoading>;
  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshLoading}
            onRefresh={() => {
              setRefreshLoading(true);
              loadData(true);
            }}
            tintColor="#7A2EF6"
            title="Pull refresh"
            titleColor="#7A2EF6"
          />
        }
        style={styles.listContainer}
      >
        {listData?.map((ld) => {
          return (
            <BotCard
              onShowDetail={onShowDetail}
              key={ld?.id}
              showPined={ld.pinned}
              ld={ld}
              showTime={true}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: RootStyles.flexCenter,
  listContainer: {
    backgroundColor: "#F5F7FA",
    width: "100%",
    height: "100%",
    padding: 16,
  },

  listItem: {
    display: "flex",
    alignItems: "center",
    padding: 12,
    gap: 12,
    borderRadius: 12,
    // with: 343,
    // height: 76,
    marginBottom: 12,
    flexDirection: "row",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 99,
    // borderWidth: 1,
    // borderColor: '#CDCDCD',
    marginHorizontal: 12,
  },

  listItemTop: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderColor: "#CDCDCD",
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
    lineHeight: 26,
    width: 231,
    fontSize: 16,
    color: "#1F1F1F",
  },

  message: {
    // width: 231,
    // marginTop: 5,
    color: "#B9B9B9",
  },

  time: {
    color: "#B9B9B9",
    flex: 1,
    lineHeight: 12,
    fontSize: 12,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
