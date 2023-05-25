import { FC, useState, useCallback } from 'react'
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native'
import RobotList from '../RobotList'
import SearchInput from '../SearchInput'
import { useDeepCompareEffect } from 'ahooks'
import Filter from '../Filter'
import useFilterStore from '../Filter/filterStore'

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}
export interface AllRobotProps {}
const AllRobot: FC<AllRobotProps> = () => {
  const [params, setParams] = useState<any>({})
  const { filterValue } = useFilterStore()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)

    wait(2000).then(() => setRefreshing(false))
  }, [])

  useDeepCompareEffect(() => {
    const nameObj = params?.name ? { name: params?.name } : {}
    if (filterValue?.type?.includes(-1)) {
      setParams(nameObj)
    } else {
      let filterParams = {}
      for (const key in filterValue) {
        if (Object.prototype.hasOwnProperty.call(filterValue, key)) {
          const item = filterValue[key]
          if (item?.length > 0) {
            filterParams[key] = item?.join()
          }
        }
      }
      setParams({ ...nameObj, ...(filterParams || {}) })
    }
  }, [filterValue])
  return (
    <>
      <View style={{ paddingHorizontal: 16 }}>
        <SearchInput
          value={params?.name}
          onChange={keyword => {
            setParams({ ...params, name: keyword })
          }}
        />
      </View>
      <ScrollView
        style={styles.page}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardDismissMode="on-drag"
      >
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
    paddingHorizontal: 16,
  },
})
