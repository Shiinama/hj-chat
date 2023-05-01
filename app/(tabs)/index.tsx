import { ImageSourcePropType, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Text, View } from '../../components/Themed'
import { chatTimeFormat } from '../../utils/time'

import RootStyles from '../../constants/RootStyles'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

type ListDataItem = {
  id: string
  avatar: ImageSourcePropType
  name: string
  message: string
  onPress: () => void
}

export default function TabOneScreen() {
  const router = useRouter()
  const listData: ListDataItem[] = [
    {
      id: uuidv4(),
      avatar: {
        uri: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F19%2F20210719150601_4401e.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1681289485&t=b0285c95f1947f32b7b4863e53eb18c0',
      },
      name: '你问我答',
      message: '123123',
      onPress: () => {
        router.push({ pathname: 'chat/2', params: { title: '你答我问', type: 'text' } })
      },
    },
    {
      id: uuidv4(),
      avatar: {
        uri: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F19%2F20210719150601_4401e.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1681289485&t=b0285c95f1947f32b7b4863e53eb18c0',
      },
      name: '你说我画',
      message: '123123',
      onPress: () => {
        router.push({ pathname: 'chat/1', params: { title: '你画我说', type: 'pic' } })
      },
    },
    {
      id: uuidv4(),
      avatar: {
        uri: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F19%2F20210719150601_4401e.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1681289485&t=b0285c95f1947f32b7b4863e53eb18c0',
      },
      name: '你说我画',
      message: '123123',
      onPress: () => {
        router.push({ pathname: 'test', params: { title: '你画我说', type: 'pic' } })
      },
    },
  ]
  return (
    <View style={styles.container}>
      <ScrollView style={styles.listContainer}>
        {listData?.map(ld => (
          <TouchableOpacity key={ld.id} style={styles.listItem} onPress={ld.onPress}>
            <Image source={ld.avatar} style={styles.avatar} />
            <View style={styles.listItemRight}>
              <View style={styles.listItemMid}>
                <Text style={styles.name}>{ld.name}</Text>
                <Text style={styles.message}>{ld.message}</Text>
              </View>
              <Text style={styles.time}>{chatTimeFormat(Date.now())}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: RootStyles.flexCenter,
  listContainer: {
    width: '100%',
    height: '100%',
  },

  listItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 12,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 5,
    marginVertical: 10,
  },

  listItemRight: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    borderColor: '#CDCDCD',
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 12,
  },

  listItemMid: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    paddingVertical: 2,
    marginRight: 12,
  },

  name: {},

  message: {
    marginTop: 5,
    color: 'rgba(0, 0, 0, 0.5)',
  },

  time: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 12,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
