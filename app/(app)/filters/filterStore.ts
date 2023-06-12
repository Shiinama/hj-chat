import { create } from 'zustand'
type FilterStoreType = {
  filterValue: any
}

const useFilterStore = create<FilterStoreType>(() => ({
  filterValue: null,
}))

export default useFilterStore
