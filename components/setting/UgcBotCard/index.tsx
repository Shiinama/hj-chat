import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { renderImage } from '../../profileInfo/helper'
import userStore from '../../../store/userStore'
import LinearText from '../../linearText'
import Flash from '../../../assets/images/tabbar/flash.svg'
import Huatong from '../../../assets/images/setting/huatong.svg'
import Tag from '../../tag'
function UgcBotCard({ ld, onShowDetail }: any) {
  const userInfo = userStore.getState().profile
  console.log(ld, userInfo)
  const tags = [
    {
      name: ld.privateBotId ? (ld.status === 'Public' ? 'Mainnet' : 'Hidden') : 'Testnet',
      bgColor: ld.privateBotId ? (ld.status === 'Public' ? '#CAF1B7' : '#d1d5db') : '#FAF4E1',
      tagColor: ld.privateBotId ? (ld.status === 'Public' ? '#165B0B' : '#6b7280') : '#E4B50C',
      childrenIcon: <Flash width={14} height={14} />,
    },
    {
      name: ld.energyPerChat,
      bgColor: '#FDF5CA',
      tagColor: '#5F5107',
      childrenIcon: <Huatong width={14} height={14} />,
    },
    {
      name: ld.language,
      bgColor: '#E7EFFF',
      tagColor: '#05286F',
      childrenIcon: <Flash width={14} height={14} />,
    },
  ]

  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        onShowDetail({ ...ld, tag: userInfo?.id === ld.userId && tag })
      }}
    >
      {renderImage(ld.logo, styles.avatar)}
      <View style={{ flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
        <View style={styles.listItemTop}>
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
            return <Tag key={tag.name} {...tag}></Tag>
          })}
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.message}>
            {ld.description}
          </Text>
        </View>
      </View>
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
    width: 40,
    height: 40,
    borderRadius: 99,
    marginHorizontal: 12,
  },
  tagList: {
    flexDirection: 'row',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderRadius: 12,
    // with: 343,
    height: 76,
    marginBottom: 12,
    backgroundColor: '#F6F6F6',
    flexDirection: 'row',
  },
  listItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },

  listItemMid: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#F6F6F6',
    paddingVertical: 2,
    marginRight: 12,
  },

  name: {
    fontWeight: 'bold',
    fontSize: 16,
    // maxWidth: '80%',
    color: '#1F1F1F',
    // backgroundColor: 'red',
  },

  message: {
    // marginTop: 5,
    color: '#B9B9B9',
  },

  time: {
    color: '#B9B9B9',
    lineHeight: 12,
    fontSize: 12,
  },

  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})

export default UgcBotCard
