import botStore from '../../../store/botStore'
import { useBoolean, useDebounceEffect } from 'ahooks'
import { useRouter } from 'expo-router'
import { FC, useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { getUgcBotList } from '../../../api/robot'
import UgcBotCard from '../UgcBotCard'
import ShellLoading from '../../loading'
import CallBackManagerSingle from '../../../utils/CallBackManager'
import NoData from '../NoData'
import CreateCard from '../CreateCard'
import { TagFromType } from '../../../constants/TagList'

export interface RobotListProps {
  /** 请求的参数 */
  requestParams: any
}
const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}
const RobotList: FC<RobotListProps> = ({ requestParams }) => {
  const [robotListData, setRobotListData] = useState([])
  const [loading, { setFalse, setTrue }] = useBoolean(true)
  const [refreshLoading, { set: setRefreshLoading }] = useBoolean(false)
  useEffect(() => {
    // 必须分一下，不然会在点到我的里面的时候把原来的替代了
    CallBackManagerSingle().add('ugcbotAllList', () => {
      loadData()
    })
    return () => {
      CallBackManagerSingle().remove('ugcbotAllList')
    }
  }, [])

  const loadData = async () => {
    setTrue()
    getUgcBotList(requestParams)
      .then((res: any) => {
        setRobotListData(res)
      })
      .finally(() => {
        setFalse()
        setRefreshLoading(false)
      })
  }

  useDebounceEffect(
    () => {
      loadData()
    },
    [requestParams],
    {
      wait: 400,
    }
  )
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
  if (!refreshLoading && loading) {
    return (
      <View style={{ minHeight: 210, alignItems: 'center' }}>
        <ShellLoading></ShellLoading>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.page}
      keyboardDismissMode="on-drag"
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
      {robotListData?.length === 0 ? (
        <NoData />
      ) : (
        <View>
          <CreateCard />
          {robotListData?.map((ld, i) => {
            return (
              <UgcBotCard
                onShowDetail={e => {
                  onShowDetail(e)
                }}
                type={TagFromType.AllBot}
                key={ld.id}
                ld={ld}
              />
            )
          })}
        </View>
      )}
    </ScrollView>
  )
}
export default RobotList
const styles = StyleSheet.create({
  page: {
    height: '100%',
    paddingHorizontal: 16,
  },
})
