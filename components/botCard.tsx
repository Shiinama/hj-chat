import { ImageSourcePropType, Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import you from '../assets/images/flash.jpg'
import { useRouter } from 'expo-router'
import { chatTimeFormat } from '../utils/time'
import RootStyles from '../constants/RootStyles'

function BotCard({ ld }: any) {
  const router = useRouter()
  return (
    <TouchableOpacity
      key={ld.id}
      style={styles.listItem}
      onPress={() => {
        const { id, userId, name, language, uid } = ld
        router.push({
          pathname: `chat/${ld.id}`,
          params: {
            id,
            userId,
            name,
            language,
            uid,
          },
        })
      }}
    >
      {ld.logo ? (
        <Image source={{ uri: ld.logo }} style={styles.avatar} />
      ) : (
        <Image source={you} style={styles.avatar} />
      )}
      <View style={{ flexDirection: 'column', alignItems: 'flex-start', width: 267 }}>
        <View style={styles.listItemTop}>
          <Text style={styles.name}>{ld.name}</Text>
          <Text style={styles.time}>{chatTimeFormat(Date.now())}</Text>
          {/* <View style={styles.listItemMid}></View> */}
        </View>
        <View style={{ backgroundColor: '#F6F6F6', width: '100%' }}>
          <Text style={styles.message}>{ld.description}</Text>
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
    // width: 231,
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
