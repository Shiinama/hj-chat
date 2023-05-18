import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { chatTimeFormat } from '../utils/time'
import RootStyles from '../constants/RootStyles'
import Pined from '../assets/images/tabbar/pin.svg'
import { renderImage } from './profileInfo/helper'
import dayjs from 'dayjs'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import userStore from '../store/userStore'
import LinearText from './linearText'
import Tag from './tag'
function BotCard({ ld, showTime, onShowDetail, showPined }: any) {
  const userInfo = userStore.getState().profile
  const tag = {
    name: ld.privateBotId ? (ld.statis !== 'Public' ? 'Mainnet' : 'Hidden') : 'Testnet',
    bgColor: ld.privateBotId ? (ld.statis !== 'Public' ? '#CAF1B7' : '#d1d5db') : '#FAF4E1',
    tagColor: ld.privateBotId ? (ld.statis !== 'Public' ? '#165B0B' : '#6b7280') : '#E4B50C',
  }

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
          <View style={{ flex: 1 }}>
            {showTime ? (
              <Text style={styles.name}>{ld.name}</Text>
            ) : userInfo?.id === ld.userId ? (
              <View style={{ flexDirection: 'row' }}>
                <LinearText text={ld.name} styles={styles.name}></LinearText>
                <Tag {...tag}></Tag>
              </View>
            ) : (
              <Text style={styles.name}>{ld.name}</Text>
            )}
          </View>
          {showTime ? (
            <Text style={styles.time}>
              {ld.lastMessage
                ? dayjs().isSame(dayjs(ld.lastMessage.createdDate), 'day')
                  ? dayjs(ld.lastMessage.createdDate).format('HH:mm')
                  : dayjs().isSame(dayjs(ld.lastMessage.createdDate), 'year')
                  ? dayjs(ld.lastMessage.createdDate).format('MM-DD')
                  : dayjs(ld.lastMessage.createdDate).format('YYYY-MM-DD')
                : ''}
            </Text>
          ) : null}
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
            {!showTime ? ld.description : ld?.lastMessage?.text}
          </Text>
          {showPined && <Pined></Pined>}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: RootStyles.flexCenter,
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

export default BotCard
