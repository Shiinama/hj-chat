import { FC, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import CreateCard from '../CreateCard'
import RobotList from '../RobotList'
import SearchInput from '../SearchInput'
import { useDebounceEffect } from 'ahooks'

export interface AllRobotProps {}
const AllRobot: FC<AllRobotProps> = () => {
  const [name, setName] = useState('')

  // /bot/getUgcBotList?tagId=1&name=xxx
  // /bot/getUgcBotList
  // /bot/ugc/own
  return (
    <View style={styles.page}>
      <SearchInput value={name} onChange={setName} />
      <CreateCard />
      <RobotList requestParams={{ name }} />
    </View>
  )
}
export default AllRobot

const styles = StyleSheet.create({
  page: {
    paddingVertical: 12,
  },
})
