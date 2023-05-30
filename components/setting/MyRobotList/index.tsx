import botStore from '../../../store/botStore'
import { useBoolean } from 'ahooks'
import { useRouter } from 'expo-router'
import { FC, useEffect, useState } from 'react'
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native'
import UgcBotCard from '../UgcBotCard'
import ShellLoading from '../../common/loading'
import CallBackManagerSingle from '../../../utils/CallBackManager'
import { getUgcOwnList } from '../../../api/setting'
import CreateCard from '../CreateCard'
import { TagFromType } from '../../../constants/TagList'

export interface MyRobotListProps {}
const MyRobotList: FC<MyRobotListProps> = () => {
  const [myRobotListData, setMyRobotListData] = useState([])
  const [loading, { setFalse, setTrue }] = useBoolean(true)
  const [refreshLoading, { set: setRefreshLoading }] = useBoolean(false)
  useEffect(() => {
    CallBackManagerSingle().add('ugcbotList', botUid => {
      loadData(botUid)
    })
    loadData()
    return () => {
      CallBackManagerSingle().remove('ugcbotList')
    }
  }, [])
  const loadData = (botUid?: string) => {
    setTrue()

    getUgcOwnList()
      .then((res: any) => {
        if (botUid) {
          botStore.setState({ botBaseInfo: res.find(item => item.uid === botUid) })
        }
        setMyRobotListData(res)
      })
      .finally(() => {
        setFalse()
        setRefreshLoading(false)
      })
  }

  const router = useRouter()
  const onShowDetail = event => {
    botStore.setState({ botBaseInfo: event })

    router.push({
      pathname: `robot/${event.uid}`,
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
  if (loading) {
    return (
      <View style={{ minHeight: 210, alignItems: 'center' }}>
        <ShellLoading></ShellLoading>
      </View>
    )
  }
  return (
    <ScrollView
      style={styles.page}
      refreshControl={
        <RefreshControl
          refreshing={refreshLoading}
          onRefresh={() => {
            setRefreshLoading(true)
            loadData()
          }}
          tintColor="#7A2EF6"
          title="Pull refresh"
          titleColor="#7A2EF6"
        />
      }
    >
      <View>
        <CreateCard />
        {myRobotListData?.map((ld, i) => {
          return (
            <UgcBotCard
              onShowDetail={e => {
                onShowDetail(e)
              }}
              type={TagFromType.MyBot}
              key={ld.id}
              ld={ld}
            />
          )
        })}
      </View>
    </ScrollView>
  )
}
export default MyRobotList
const styles = StyleSheet.create({
  page: {
    height: '100%',
    paddingHorizontal: 16,
  },
})
