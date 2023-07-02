import Tabs from '../../components/setting/Tabs'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import AllRobot from '../../components/setting/AllRobot'
import MyShell from '../../components/setting/MyShell'
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
  /** 当前页面处于哪一个tab */
  const [tabVal, setTabVal] = useState(pageTypes.allRobot)
  return (
    <>
      <View style={styles.container}>
        <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          <Tabs data={tabsData} value={tabVal} onChange={setTabVal} />
        </View>
        <View style={tabVal === pageTypes.allRobot ? styles.body : { display: 'none' }}>
          <AllRobot />
        </View>
        <View style={tabVal === pageTypes.myShell ? styles.body : { display: 'none' }}>
          <MyShell />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 8,
    height: '100%',
  },
  body: {
    flexShrink: 1,
    flexGrow: 1,
  },
})
