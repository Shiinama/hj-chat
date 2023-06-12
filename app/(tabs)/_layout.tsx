import { Tabs, useFocusEffect } from 'expo-router'
import { View, Image, Text } from 'react-native'
import ProgressBar from '../../components/common/ProgressBar'
import flashImg from '../../assets/images/tabbar/flash.png'
import Chat from '../../assets/images/tabbar/chat.svg'
import ChatAcitve from '../../assets/images/tabbar/chat_acitve.svg'
import Profile from '../../assets/images/tabbar/profile.svg'
import ProfileAcitve from '../../assets/images/tabbar/profile_acitve.svg'
import Bot from '../../assets/images/tabbar/bot.svg'
import BotAcitve from '../../assets/images/tabbar/bot_active.svg'
import myshell from '../../assets/images/myshell.png'
import { useCallback, useEffect, useState } from 'react'
import useUserStore, { getUserEnergyInfo } from '../../store/userStore'
/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */

export default function TabLayout() {
  const { userEnergyInfo: energy } = useUserStore()
  useFocusEffect(
    useCallback(() => {
      getUserEnergyInfo()
    }, [])
  )
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
          title: '',
          tabBarIcon: ({ focused }) => (focused ? <ChatAcitve /> : <Chat />),
          headerLeft: () => (
            <View
              style={{
                marginLeft: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Image style={{ width: 22, height: 22 }} source={myshell}></Image>
              <Text style={{ fontSize: 18, lineHeight: 28, marginLeft: 4, fontWeight: 'bold' }}>MyShell</Text>
            </View>
          ),
          headerRight: () => (
            <View
              style={{
                marginRight: 16,
                flexDirection: 'row',
                alignItems: 'center',
                width: 75,
                position: 'relative',
                justifyContent: 'flex-end',
              }}
            >
              <View style={{ width: 60 }}>
                {energy && (
                  <ProgressBar size="s" progressValue={energy.energy} maxRange={energy.dailyEnergy}></ProgressBar>
                )}
              </View>
              <Image
                source={flashImg}
                style={{
                  width: 24,
                  height: 24,
                  position: 'absolute',
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
          tabBarShowLabel: false,
          title: '',
          headerLeft: () => (
            <View>
              <Text style={{ fontSize: 18, lineHeight: 28, marginLeft: 20, fontWeight: 'bold' }}>Workshop</Text>
            </View>
          ),
          tabBarIcon: ({ focused }) => (focused ? <BotAcitve /> : <Bot />),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarShowLabel: false,
          title: '',
          headerLeft: () => (
            <View>
              <Text style={{ fontSize: 18, lineHeight: 28, marginLeft: 20, fontWeight: 'bold' }}>Profile</Text>
            </View>
          ),
          tabBarIcon: ({ focused }) => (focused ? <ProfileAcitve /> : <Profile />),
        }}
      />
    </Tabs>
  )
}
