import botStore from '../../../store/botStore'
import { useBoolean, useDebounceEffect } from 'ahooks'
import { useFocusEffect, useRouter } from 'expo-router'
import { FC, useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { getUgcBotList } from '../../../api/robot'
import UgcBotCard from '../UgcBotCard'
import ShellLoading from '../../loading'
import CallBackManagerSingle from '../../../utils/CallBackManager'
import NoData from '../NoData'
import CreateCard from '../CreateCard'

export interface RobotListProps {
  /** 请求的参数 */
  requestParams: any
}
const RobotList: FC<RobotListProps> = ({ requestParams }) => {
  const [robotListData, setRobotListData] = useState([])
  const [loading, { setFalse, setTrue }] = useBoolean(false)
  useEffect(() => {
    CallBackManagerSingle().add('ugcbotList', botUid => {
      loadData(botUid)
    })
    return () => {
      CallBackManagerSingle().remove('ugcbotList')
    }
  }, [])
  useFocusEffect(
    useCallback(() => {
      setTrue()
      loadData()
    }, [])
  )
  const loadData = (botUid?: string) => {
    setTrue()

    getUgcBotList(requestParams)
      .then((res: any) => {
        if (botUid) {
          botStore.setState(res.find(item => item.uid === botUid))
        }
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
    botStore.setState(event)
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
            key={ld.id}
            ld={ld}
            showTime={false}
          />
        )
      })}
    </View>
  )
}
export default RobotList
