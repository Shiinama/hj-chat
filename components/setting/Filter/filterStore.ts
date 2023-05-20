import { create } from 'zustand'
type FilterStoreType = {
  count: number
  filterValue: any
  [key: string]: any
}

const useFilterStore = create<FilterStoreType>(() => ({
  count: 0,
  filterValue: null,
}))

export default useFilterStore
