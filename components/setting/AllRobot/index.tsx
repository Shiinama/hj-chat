import { FC, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import CreateCard from '../CreateCard'
import SearchInput from '../SearchInput'

export interface AllRobotProps {}
const AllRobot: FC<AllRobotProps> = () => {
  const [keyword, setKeyword] = useState('')
  return (
    <View style={styles.page}>
      <SearchInput value={keyword} onChange={setKeyword} />
      <CreateCard />
    </View>
  )
}
export default AllRobot

const styles = StyleSheet.create({
  page: {
    paddingVertical: 12,
  },
})
