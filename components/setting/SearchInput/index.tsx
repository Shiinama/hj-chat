import { useControllableValue } from 'ahooks'
import type { FC } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import SearchIcon from '../../../assets/images/setting/Search.svg'
export interface SearchInputProps {
  value?: string
  onChange?: (val: string) => void
  defaultValue?: string
}
const SearchInput: FC<SearchInputProps> = props => {
  const [state, setState] = useControllableValue(props)
  return (
    <View style={styles.inputWrap}>
      <SearchIcon style={styles.icon} />
      <TextInput
        value={state}
        onChangeText={setState}
        placeholder="Search MyShell Robot..."
        placeholderTextColor="#B9B9B9"
        style={styles.input}
      />
    </View>
  )
}
export default SearchInput

const styles = StyleSheet.create({
  inputWrap: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EDEDED',
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    flexShrink: 1,
  },
})
