import botStore from '../../../store/botStore'
import { useBoolean, useDebounceEffect } from 'ahooks'
import { useRouter } from 'expo-router'
import { FC, useEffect, useState } from 'react'
import { View } from 'react-native'
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
  if (loading) {
    return (
      <View style={{ minHeight: 210, alignItems: 'center' }}>
        <ShellLoading></ShellLoading>
      </View>
    )
  }

  if (robotListData?.length === 0) {
    return <NoData />
  }
  return (
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
  )
}
export default RobotList
