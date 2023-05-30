import { View, StyleSheet, Text } from 'react-native'

export default function Tag({ bgColor, tagColor, name, textMaxWidth = 120, childrenIcon, childrenEmoji }: any) {
  return (
    <View
      style={{
        ...styles.tagListItem,
        backgroundColor: bgColor,
      }}
    >
      {childrenIcon || <Text style={{ fontSize: 9 }}>{childrenEmoji}</Text>}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ ...styles.tagListItemText, color: tagColor, maxWidth: textMaxWidth }}
      >
        {name}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  tagListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 26,
    paddingLeft: 6,
    paddingRight: 6,
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
    marginLeft: 4,
    fontWeight: '700',
    fontSize: 12,
    color: '#3A0D84',
  },
})
