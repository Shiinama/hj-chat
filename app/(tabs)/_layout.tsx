import { Tabs } from 'expo-router'
import { Image, View, useColorScheme, StyleSheet, Text } from 'react-native'
import Colors from '../../constants/Colors'
import images from '../../assets/images/tabbar'
import ProgressBar from '../../components/ProgressBar'
import flash from '../../assets/images/flash.jpg'

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
const imgRender = (key, focused) => {
  return (
    <View style={styles.bottomIcon}>
      <Image source={images?.[`${key}${focused ? '_active' : ''}`]} style={styles.bottomIconImg} />
    </View>
  )
}

export default function TabLayout() {
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
          tabBarIcon: ({ focused }) => imgRender('chat', focused),
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
                  borderLeftWidth: 2,
                  borderColor: '#F6F6F6',
                  borderRadius: 8,
                }}
              >
                <Image style={{ width: 17, height: 19 }} source={flash}></Image>
              </View>
              <ProgressBar progressBarColor="#FFC03A" progressValue={50}></ProgressBar>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarShowLabel: false,
          title: 'Robot Workshop',
          tabBarIcon: ({ focused }) => imgRender('robot', focused),
        }}
      />
      <Tabs.Screen
        name="audio"
        options={{
          tabBarShowLabel: false,
          title: '录音',
          tabBarIcon: ({ focused }) => imgRender('user', focused),
        }}
      />
    </Tabs>
  )
}
