import { View, StyleSheet, ScrollView, Pressable, Text, DeviceEventEmitter } from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import RootStyles from '../../constants/RootStyles'
import 'react-native-get-random-values'
import { useCallback, useEffect, useState } from 'react'
import { botList } from '../../api/index'
import BotCard from '../../components/botCard'
import ShellLoading from '../../components/loading'
import botStore from '../../store/botStore'
import { useAuth } from '../../context/auth'

type ListDataItem = {
  id: number
  uid: string
  name: string
  description: string
  userId: number
  logo: string
  language: string
  pinned: boolean
  lastInteractionDate: string
}

// import { createWeb3 } from '../../tmp/web3Demo'
import CallBackManagerSingle from '../../utils/CallBackManager'
import { removeBotListLocal } from '../../api/botChatListCache'
import SocketStreamManager from '../../components/chat/socketManager'

export default function TabOneScreen() {
  const router = useRouter()
  const [listData, setListData] = useState<ListDataItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { signOut } = useAuth()

  // useFocusEffect(
  //   useCallback(() => {
  //     botList().then(res => {
  //       setListData(res as ListDataItem[])
  //       setLoading(false)
  //     })
  //   }, [])
  // )

  const loadData = (flash?: boolean) => {
    botList(flash).then(res => {
      setListData(res as ListDataItem[])
      setLoading(false)
    })
  }

  useEffect(() => {
    // 冷启动App强制刷新缓存 请求接口获取数据  flash 为  true
    loadData(true)
    CallBackManagerSingle().add('botList', () => {
      loadData(true)
    })
    DeviceEventEmitter.addListener('logout', item => {
      // 会话超时清楚本地缓存
      removeBotListLocal()
      setListData([])
      signOut()
    })
    // 初始化socket
    SocketStreamManager()
    return () => {
      CallBackManagerSingle().remove('botList')
      SocketStreamManager(true)
    }
  }, [])

  const onShowDetail = event => {
    botStore.setState({ botBaseInfo: event })
    router.push({
      pathname: `chat/${event.uid}`,
    })
  }

  if (loading) return <ShellLoading></ShellLoading>
  return (
    <View style={styles.container}>
      <ScrollView style={styles.listContainer}>
        {listData?.map(ld => (
          <BotCard
            onShowDetail={e => {
              onShowDetail(e)
            }}
            key={ld.id}
            showPined={ld.pinned}
            ld={ld}
            showTime={true}
          />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: RootStyles.flexCenter,
  listContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    padding: 16,
  },

  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderRadius: 12,
    // with: 343,
    // height: 76,
    marginBottom: 12,
    backgroundColor: '#F6F6F6',
    flexDirection: 'row',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderColor: '#CDCDCD',
  },

  listItemMid: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#F6F6F6',
    paddingVertical: 2,
    marginRight: 12,
  },

  name: {
    lineHeight: 26,
    width: 231,
    fontSize: 16,
    color: '#1F1F1F',
  },

  message: {
    // width: 231,
    // marginTop: 5,
    color: '#B9B9B9',
  },

  time: {
    color: '#B9B9B9',
    flex: 1,
    lineHeight: 12,
    fontSize: 12,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
