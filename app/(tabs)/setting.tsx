import Tabs from '../../components/setting/Tabs'
import { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
/** page tabs 的value */
export const pageTypes = {
  allRobot: 'AllRobot',
  myShell: 'MyShell',
}
const tabsData = [
  { label: 'All Robot', value: pageTypes.allRobot },
  { label: 'My Shell', value: pageTypes.myShell },
]
export default function TabTwoScreen() {
  const [tabVal, setTabVal] = useState(pageTypes.allRobot)
  return (
    <ScrollView style={styles.container} alwaysBounceVertical={false}>
      <Tabs data={tabsData} value={tabVal} onChange={setTabVal} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: '100%',
  },
})
