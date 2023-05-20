import { useRouter } from 'expo-router'
import { FC, useEffect, useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import FilterIcon from '../../../assets/images/setting/filter_icon.svg'
import useFilterStore from './filterStore'
export interface FilterProps {}
const Filter: FC<FilterProps> = () => {
  const { filterValue } = useFilterStore()
  const router = useRouter()
  const count = useMemo(() => {
    let res = 0
    for (const key in filterValue) {
      if (Object.prototype.hasOwnProperty.call(filterValue, key)) {
        const element = filterValue[key]
        res += element?.length || 0
      }
    }
    return res
  }, [filterValue])
  return (
    <View pointerEvents="box-none" style={styles.filterWrap}>
      <TouchableOpacity
        style={styles.filterBox}
        onPress={() => {
          router.push('filters')
        }}
      >
        <FilterIcon style={styles.icon} />
        <Text style={styles.text}>Filter</Text>
        <View style={styles.count}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
export default Filter

const styles = StyleSheet.create({
  filterWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 8,
    width: '100%',
  },
  filterBox: {
    height: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 99,
    // TODO 阴影效果
    // box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#1F1F1F',
    fontSize: 16,
    fontWeight: '400',
  },
  count: {
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#EDEDED',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  countText: {
    fontSize: 14,
    color: '#1F1F1F',
  },
})
