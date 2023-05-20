import { FC, useState } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import CreateCard from '../CreateCard'
import RobotList from '../RobotList'
import SearchInput from '../SearchInput'
import { useDeepCompareEffect, useSetState } from 'ahooks'
import Filter from '../Filter'
import useFilterStore from '../Filter/filterStore'
import MyRobotList from '../MyRobotList'

export interface MyShellProps {}
const MyShell: FC<MyShellProps> = () => {
  return (
    <ScrollView style={styles.page}>
      <CreateCard />
      <MyRobotList />
    </ScrollView>
  )
}
export default MyShell

const styles = StyleSheet.create({
  page: {
    height: '100%',
  },
})
