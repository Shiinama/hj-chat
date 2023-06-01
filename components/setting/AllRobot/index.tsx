import { FC, useState } from 'react'
import { View } from 'react-native'
import RobotList from '../RobotList'
import SearchInput from '../SearchInput'
import { useDeepCompareEffect } from 'ahooks'
import Filter from '../Filter'
import useFilterStore from '../Filter/filterStore'

export interface AllRobotProps {}
const AllRobot: FC<AllRobotProps> = () => {
  const [params, setParams] = useState<any>({})
  const { filterValue } = useFilterStore()

  useDeepCompareEffect(() => {
    const nameObj = params?.name ? { name: params?.name } : {}
    if (filterValue?.type?.includes(-2)) {
      setParams(nameObj)
    } else {
      let filterParams = {}
      let tgSupported = {}
      for (const key in filterValue) {
        if (Object.prototype.hasOwnProperty.call(filterValue, key)) {
          const item = filterValue[key]
          if (item?.length > 0) {
            if (key === 'type') {
              filterParams[key] = item?.filter(v => v !== -1).join()
              tgSupported = item?.includes(-1) ? { tgSupported: 1 } : {}
            } else {
              filterParams[key] = item?.join()
            }
          }
        }
      }
      setParams({ ...nameObj, ...(filterParams || {}), ...tgSupported })
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
      <RobotList requestParams={params} />
      <Filter />
    </>
  )
}
export default AllRobot
