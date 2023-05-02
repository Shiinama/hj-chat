import { ImageSourcePropType, Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { chatTimeFormat } from '../../utils/time'

import RootStyles from '../../constants/RootStyles'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { useEffect } from 'react'
import request from '../../utils/request'

type ListDataItem = {
  id: string
  avatar: ImageSourcePropType
  name: string
  message: string
  onPress: () => void
}

export default function TabOneScreen() {
  const router = useRouter()
  useEffect(() => {
    request({ url: '/bot/list', method: 'get' }).then(res => console.log(res))
  }, [])
  const listData: ListDataItem[] = [
    {
      id: uuidv4(),
      avatar: {
        uri: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F19%2F20210719150601_4401e.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1681289485&t=b0285c95f1947f32b7b4863e53eb18c0',
      },
      name: 'Samatha',
      message: 'We must continually strive to optimize user-centric experiences.',
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
            <View style={{ flexDirection: 'column', alignItems: 'flex-start', width: 267 }}>
              <View style={styles.listItemTop}>
                <Text style={styles.name}>{ld.name}</Text>
                <Text style={styles.time}>{chatTimeFormat(Date.now())}</Text>
                {/* <View style={styles.listItemMid}></View> */}
              </View>
              <View style={{ backgroundColor: '#F6F6F6', width: '100%' }}>
                <Text style={styles.message}>{ld.message}</Text>
              </View>
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
