import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { renderImage } from '../../profileInfo/helper'
import userStore from '../../../store/userStore'
import LinearText from '../../linearText'
import Flash from '../../../assets/images/tabbar/flash.svg'
import Wang from '../../../assets/images/setting/wang.svg'
import Huatong from '../../../assets/images/setting/huatong.svg'
import Tag from '../../tag'
function UgcBotCard({ ld, onShowDetail }: any) {
  const userInfo = userStore.getState().profile
  let tags = [
    {
      name: ld.privateBotId ? (ld.status === 'Public' ? 'Mainnet' : 'Hidden') : 'Testnet',
      bgColor: ld.privateBotId ? (ld.status === 'Public' ? '#CAF1B7' : '#d1d5db') : '#FAF4E1',
      tagColor: ld.privateBotId ? (ld.status === 'Public' ? '#165B0B' : '#6b7280') : '#705A0C',
      childrenIcon: <Wang width={14} height={14} />,
    },
    {
      name: ld.energyPerChat,
      bgColor: '#FDF5CA',
      tagColor: '#5F5107',
      childrenIcon: <Flash width={14} height={14} />,
    },
    {
      name: ld.language,
      bgColor: '#E7EFFF',
      tagColor: '#05286F',
      childrenIcon: <Huatong width={14} height={14} />,
    },
  ]
  if (userInfo?.id !== ld.userId) {
    tags = tags.slice(1)
  } else {
    tags = tags.slice(0, 1)
  }

  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        onShowDetail({ ...ld, tag: userInfo?.id === ld.userId })
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
              <Text numberOfLines={1} ellipsizeMode="tail" style={{ ...styles.name }}>
                {ld.name}
              </Text>
            )}
          </View>
          <View style={styles.tagList}>
            {tags.map(tag => {
              return <Tag key={tag.bgColor} {...tag}></Tag>
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

export default UgcBotCard
