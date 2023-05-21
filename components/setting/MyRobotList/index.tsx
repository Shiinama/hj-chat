import botStore from '../../../store/botStore'
import { useBoolean } from 'ahooks'
import { useFocusEffect, useRouter } from 'expo-router'
import { FC, useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import UgcBotCard from '../UgcBotCard'
import ShellLoading from '../../loading'
import CallBackManagerSingle from '../../../utils/CallBackManager'
import { getUgcOwnList } from '../../../api/setting'
import NoData from '../NoData'
import CreateCard from '../CreateCard'

export interface MyRobotListProps {}
const MyRobotList: FC<MyRobotListProps> = () => {
  const [myRobotListData, setMyRobotListData] = useState([])
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
  if (myRobotListData?.length === 0) {
    return <NoData />
  }
  return (
    <View>
      <CreateCard />
      {myRobotListData?.map((ld, i) => {
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
export default MyRobotList
