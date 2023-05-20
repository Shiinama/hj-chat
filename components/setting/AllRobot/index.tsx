import { FC, useState } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import CreateCard from '../CreateCard'
import RobotList from '../RobotList'
import SearchInput from '../SearchInput'
import { useSetState } from 'ahooks'
import Filter from '../Filter'

export interface AllRobotProps {}
const AllRobot: FC<AllRobotProps> = () => {
  const [params, setParams] = useSetState({ name: '' })

  // /bot/getUgcBotList?tagId=1&name=xxx
  // /bot/getUgcBotList
  // /bot/ugc/own
  return (
    <>
      <ScrollView style={styles.page}>
        <SearchInput
          value={params?.name}
          onChange={keyword => {
            setParams({ name: keyword })
          }}
        />

        <CreateCard />
        <RobotList requestParams={params} />
      </ScrollView>
      <Filter />
    </>
  )
}
export default AllRobot

const styles = StyleSheet.create({
  page: {
    height: '100%',
  },
})
