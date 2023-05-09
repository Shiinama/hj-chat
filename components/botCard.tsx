import { ImageSourcePropType, Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import { chatTimeFormat } from '../utils/time'
import RootStyles from '../constants/RootStyles'
import Pined from '../assets/images/tabbar/pin.svg'

function BotCard({ ld, showTime, onShowDetail, showPined }: any) {
  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        onShowDetail(ld)
      }}
    >
      {ld.logo ? (
        <Image source={{ uri: ld.logo }} style={styles.avatar} />
      ) : (
        <Image
          source={{
            uri: 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5049cfd8aca04680b5d1acb9d8b32cc1~tplv-k3u1fbpfcp-watermark.image?)',
          }}
          style={styles.avatar}
        />
      )}
      <View style={{ flexDirection: 'column', alignItems: 'flex-start', width: 267 }}>
        <View style={styles.listItemTop}>
          <Text style={styles.name}>{ld.name}</Text>
          {showTime ? <Text style={styles.time}>{chatTimeFormat(Date.now())}</Text> : null}
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: '#F6F6F6', width: '100%' }}>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.message}>
            {ld.description}
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

  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderRadius: 12,
    // with: 343,
    // height: 76,
    marginBottom: 12,
    backgroundColor: '#F6F6F6',
    flexDirection: 'row',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 99,
    // borderWidth: 1,
    // borderColor: '#CDCDCD',
    marginHorizontal: 12,
  },

  listItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    backgroundColor: '#F6F6F6',
    borderColor: '#CDCDCD',
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
    lineHeight: 26,
    width: 231,
    fontSize: 16,
    color: '#1F1F1F',
  },

  message: {
    width: 240,
    // marginTop: 5,
    color: '#B9B9B9',
  },

  time: {
    color: '#B9B9B9',
    flex: 1,
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
