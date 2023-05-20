import botStore from '../../../store/botStore'
import { useBoolean } from 'ahooks'
import { useFocusEffect, useRouter } from 'expo-router'
import { FC, useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import BotCard from '../../botCard'
import ShellLoading from '../../loading'
import CallBackManagerSingle from '../../../utils/CallBackManager'
import { getUgcOwnList } from '../../../api/setting'

export interface MyRobotListProps {}
const MyRobotList: FC<MyRobotListProps> = () => {
  const [MyRobotListData, setMyRobotListData] = useState([])
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

    getUgcOwnList()
      .then((res: any) => {
        if (botUid) {
          botStore.setState(res.find(item => item.uid === botUid))
        }

        setMyRobotListData(res)
      })
      .finally(() => {
        setFalse()
      })
  }
  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [])
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
      {MyRobotListData?.map((ld, i) => {
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
export default MyRobotList
