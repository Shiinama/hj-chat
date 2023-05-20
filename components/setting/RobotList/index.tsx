import botStore from '../../../store/botStore'
import { useBoolean, useDebounceEffect } from 'ahooks'
import { useRouter } from 'expo-router'
import { FC, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { getUgcBotList } from '../../../api/robot'
import BotCard from '../../botCard'
import ShellLoading from '../../loading'
import CallBackManagerSingle from '../../../utils/CallBackManager'
import useFilterStore from '../Filter/filterStore'

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
    loadData()
    return () => {
      CallBackManagerSingle().remove('ugcbotList')
    }
  }, [])
  const loadData = (botUid?: string) => {
    setTrue()
    getUgcBotList(requestParams)
      .then((res: any) => {
        if (botUid) {
          botStore.setState(res.find(item => item.uid === botUid))
        }
        // 设置 filters那里的count
        useFilterStore.setState({ count: res?.length || 0 })
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
      pathname: `robot/${event.id}`,
      params: {
        id: event.id,
        tag: event.tag,
        userId: event.userId,
        status: event.status,
        name: event.name,
        language: event.language,
        uid: event.uid,
      },
    })
  }
  if (loading)
    return (
      <View style={{ minHeight: 210, alignItems: 'center' }}>
        <ShellLoading></ShellLoading>
      </View>
    )
  return (
    <View>
      {robotListData?.map((ld, i) => {
        return (
          <BotCard
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
