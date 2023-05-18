import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import BotCard from '../../components/botCard'
import { getUgcBotList, queryCanCreateUgcBot } from '../../api/robot'
import addIcon from '../../assets/images/add.png'
import botStore from '../../store/botStore'
import ShellLoading from '../../components/loading'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { Toast } from '@fruits-chain/react-native-xiaoshu'
type ListDataItem = {
  id: string | number
  uid: string
  status: string
  name: string
  description: string
  userId: string | number
  logo: string
  language: string
  createdDate: any
  updatedDate: any
  energyPerChat: string | number
}

export default function TabTwoScreen() {
  const router = useRouter()
  const [listData, setListData] = useState<ListDataItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)
    getUgcBotList({}).then(res => {
      setLoading(false)
      setListData(res as ListDataItem[])
    })
  }

  const onShowDetail = event => {
    botStore.setState(event)
    router.push({
      pathname: `robot/${event.id}`,
      params: {
        id: event.id,
        userId: event.userId,
        status: event.status,
        name: event.name,
        language: event.language,
        uid: event.uid,
      },
    })
  }

  const onCreate = () => {
    queryCanCreateUgcBot({}).then(() => {
      Toast('Please use a desktop browser to create a robot')
    })
  }
  if (loading) return <ShellLoading></ShellLoading>
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.action}
        onPress={() => {
          onCreate()
        }}
      >
        <Image source={addIcon} style={{ width: 20, height: 20 }} />
        <Text style={styles.title}>Creat a Robot</Text>
        <Text style={styles.desc}>Robot creator, expert in robotics</Text>
      </TouchableOpacity>
      <View style={styles.mt12}>
        {listData?.map(ld => (
          <BotCard
            onShowDetail={e => {
              onShowDetail(e)
            }}
            key={ld.id}
            ld={ld}
            showTime={false}
          />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
  },
  action: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 132,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
  },
  title: {
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 28,
    marginTop: 20,
    color: '#1F1F1F',
  },
  desc: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 22,
    color: '#797979',
  },
  mt12: {
    marginTop: 12,
  },
})
