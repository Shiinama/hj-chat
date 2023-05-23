import { View, StyleSheet, Text } from 'react-native'

export default function Tag({ bgColor, tagColor, name, keyValue, childrenIcon }: any) {
  return (
    <View
      style={{
        ...styles.tagListItem,
        backgroundColor: bgColor,
      }}
    >
      {childrenIcon}
      <Text style={{ ...styles.tagListItemText, color: tagColor }}>{keyValue || name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  tagListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 26,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 4,
    borderRadius: 6,
    flexShrink: 1,
  },
  tagListItemTip: {
    width: 10,
    height: 10,
    borderRadius: 100,
    marginRight: 6,
  },
  tagListItemText: {
    fontWeight: '500',
    fontSize: 12,
    color: '#3A0D84',
  },
})
