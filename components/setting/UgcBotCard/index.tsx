import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { renderImage } from '../../profileInfo/helper'
import userStore from '../../../store/userStore'
import LinearText from '../../common/linearText'
import Tag from '../../common/tag'
import { useTagList } from '../../../constants/TagList'
import { memo } from 'react'
const windowWidth = Dimensions.get('window').width
function UgcBotCard({ ld, onShowDetail, type }: any) {
  const tags = useTagList(ld, type)
  const userInfo = userStore.getState().profile
  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        onShowDetail(ld)
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {renderImage(ld.logo, styles.avatar)}
        <View style={styles.listItemTop}>
          <View>
            {userInfo?.id === ld.userId ? (
              <View style={{ flexDirection: 'row' }}>
                <LinearText text={ld.name} styles={styles.name}></LinearText>
              </View>
            ) : (
              <Text numberOfLines={1} ellipsizeMode="tail" style={{ ...styles.name, width: 230 }}>
                {ld.name}
              </Text>
            )}
          </View>
          <View style={styles.tagList}>
            {tags.map(tag => {
              return <Tag key={tag.id} {...tag} textMaxWidth={windowWidth / 6}></Tag>
            })}
          </View>
        </View>
      </View>
      {ld.description && (
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.message}>
            {ld.description}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
    height: '100%',
    padding: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 18,
    marginRight: 16,
  },
  tagList: {
    marginVertical: 8,
    flexDirection: 'row',
  },
  listItem: {
    padding: 12,
    gap: 12,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F6F6F6',
  },
  listItemTop: {
    // flexDirection: 'row',
    alignItems: 'flex-start',
    flexShrink: 0,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 30,
    color: '#1F1F1F',
  },
  message: {
    // marginTop: 5,
    fontSize: 14,
    color: '#0A0A0AA3',
  },
})

export default memo(UgcBotCard)
