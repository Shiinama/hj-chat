import { Tabs } from 'expo-router'
import { Image, View, useColorScheme, StyleSheet, Text } from 'react-native'
import ProgressBar from '../../components/ProgressBar'
import Flash from '../../assets/images/tabbar/flash.svg'
import Chat from '../../assets/images/tabbar/chat.svg'
import ChatAcitve from '../../assets/images/tabbar/chat_acitve.svg'
import Profile from '../../assets/images/tabbar/profile.svg'
import ProfileAcitve from '../../assets/images/tabbar/profile_acitve.svg'
import Bot from '../../assets/images/tabbar/bot.svg'
import BotAcitve from '../../assets/images/tabbar/bot_active.svg'
import { useEffect, useState } from 'react'
import { getUserEnergyInfo } from '../../api'
/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
const styles = StyleSheet.create({
  bottomIcon: {
    position: 'relative',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomIconImg: {
    width: 23,
    height: 27,
  },
})
type EnergyType = {
  energy: number
  dailyEnergy: number
}
export default function TabLayout() {
  const [energy, setEnergy] = useState<EnergyType>()
  useEffect(() => {
    getUserEnergyInfo().then(res => {
      setEnergy(res as EnergyType)
    })
  }, [])
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
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontSize: 18, lineHeight: 28 }}>MySheel</Text>
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: 16, flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 28,
                  height: 28,
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderLeftWidth: 1,
                  borderColor: '#F6F6F6',
                  borderRadius: 8,
                }}
              >
                <Flash></Flash>
              </View>
              {energy && (
                <ProgressBar
                  progressBarColor="#FFC03A"
                  progressValue={energy.energy}
                  maxRange={energy.dailyEnergy}
                ></ProgressBar>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarShowLabel: false,
          title: 'Robot Workshop',
          tabBarIcon: ({ focused }) => (focused ? <BotAcitve /> : <Bot />),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarShowLabel: false,
          title: 'Profile',
          tabBarIcon: ({ focused }) => (focused ? <ProfileAcitve /> : <Profile />),
        }}
      />
    </Tabs>
  )
}
