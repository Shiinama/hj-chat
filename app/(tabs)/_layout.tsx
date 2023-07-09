/* eslint-disable react-hooks/rules-of-hooks */
import { getUserSettings } from "@api/proofile";
import { Tabs, useFocusEffect, usePathname } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

import myshell from "../../assets/images/myshell.png";
import Gem from "../../assets/images/rewards-center/Gem.svg";
import GemActive from "../../assets/images/rewards-center/GemActive.svg";
import GemWithRedDot from "../../assets/images/rewards-center/GemWithRedDot.svg";
import Bot from "../../assets/images/tabbar/bot.svg";
import BotAcitve from "../../assets/images/tabbar/bot_active.svg";
import Chat from "../../assets/images/tabbar/chat.svg";
import ChatAcitve from "../../assets/images/tabbar/chat_acitve.svg";
import flashImg from "../../assets/images/tabbar/flash.png";
import Profile from "../../assets/images/tabbar/profile.svg";
import ProfileAcitve from "../../assets/images/tabbar/profile_acitve.svg";
import ProgressBar from "../../components/common/ProgressBar";
import { useTaskRequest } from "../../components/rewords-center/hooks";
import useTaskStore from "../../store/taskStore";
import useUserStore, { getUserEnergyInfo } from "../../store/userStore";

export default function TabLayout() {
  if (!useUserStore.getState().userBaseInfo) return;

  const { userEnergyInfo: energy, profile } = useUserStore();
  const { createdClainSound, clearClainSound, hasClaimableTask } =
    useTaskStore();
  const { queryTaskList } = useTaskRequest();
  const [visitorRewardsCenterVisited, setVisitorRewardsCenterVisited] =
    useState<boolean>(false);
  const [rewardsCenterVisited, setRewardsCenterVisited] =
    useState<boolean>(false);
  useFocusEffect(
    useCallback(() => {
      getUserEnergyInfo();
    }, []),
  );
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/rewords") {
      setVisitorRewardsCenterVisited(true);
    }
  }, [pathname]);

  useEffect(() => {
    queryTaskList();
    createdClainSound();
    getUserSettings().then((res) => {
      console.log(res.some((s) => s.name === "flagIconReward"));
      setRewardsCenterVisited(res.some((s) => s.name === "flagIconReward"));
    });
    const interval = setInterval(() => {
      queryTaskList();
    }, 1000 * 60 * 5); // 每 5 分钟查询一次
    return () => {
      clearClainSound();
      clearInterval(interval);
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { height: 82 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: "#F5F7FA",
          },
          title: "",
          tabBarIcon: ({ focused }) => (focused ? <ChatAcitve /> : <Chat />),
          headerLeft: () => (
            <View
              style={{
                marginLeft: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image style={{ width: 22, height: 22 }} source={myshell}></Image>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 28,
                  marginLeft: 4,
                  fontWeight: "bold",
                }}
              >
                MyShell
              </Text>
            </View>
          ),
          headerRight: () => (
            <View
              style={{
                marginRight: 16,
                flexDirection: "row",
                alignItems: "center",
                width: 75,
                position: "relative",
                justifyContent: "flex-end",
              }}
            >
              <View style={{ width: 60 }}>
                {energy && (
                  <ProgressBar
                    size="s"
                    progressValue={energy.energy}
                    maxRange={energy.dailyEnergy}
                  ></ProgressBar>
                )}
              </View>
              <Image
                source={flashImg}
                style={{
                  width: 24,
                  height: 24,
                  position: "absolute",
                  left: 0,
                  zIndex: 10,
                }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          headerStyle: {
            backgroundColor: "#F5F7FA",
          },
          tabBarShowLabel: false,
          title: "",
          headerLeft: () => (
            <View>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 28,
                  marginLeft: 20,
                  fontWeight: "bold",
                }}
              >
                Workshop
              </Text>
            </View>
          ),
          tabBarIcon: ({ focused }) => (focused ? <BotAcitve /> : <Bot />),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: "#F5F7FA",
          },
          title: "",
          headerLeft: () => (
            <View>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 28,
                  marginLeft: 20,
                  fontWeight: "bold",
                }}
              >
                Profile
              </Text>
            </View>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? <ProfileAcitve /> : <Profile />,
        }}
      />
      <Tabs.Screen
        name="rewords"
        options={{
          tabBarShowLabel: false,
          title: "",
          headerStyle: {
            backgroundColor: "#F5F7FA",
          },
          headerLeft: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 28,
                  marginLeft: 20,
                  fontWeight: "bold",
                }}
              >
                Rewords Center
              </Text>
              <View
                style={{
                  marginLeft: 8,
                  backgroundColor: "#E5EFFD",
                  paddingHorizontal: 8,
                  height: 18,
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#3E5CFA", fontSize: 12 }}>Beta</Text>
              </View>
            </View>
          ),
          tabBarBadgeStyle: {
            backgroundColor: "#3E5CFA",
          },
          tabBarBadge:
            profile &&
            ((profile.source === "visitor" && !visitorRewardsCenterVisited) ||
              (profile.source !== "visitor" && !rewardsCenterVisited))
              ? "New"
              : null,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <GemActive />
            ) : hasClaimableTask ? (
              <GemWithRedDot />
            ) : (
              <Gem />
            ),
        }}
      />
    </Tabs>
  );
}
