import { FC } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import MyRobotList from '../MyRobotList'

export interface MyShellProps {}
const MyShell: FC<MyShellProps> = () => {
  return (
    <ScrollView style={styles.page}>
      <MyRobotList />
    </ScrollView>
  )
}
export default MyShell

const styles = StyleSheet.create({
  page: {
    height: '100%',
    paddingHorizontal: 16,
  },
})
