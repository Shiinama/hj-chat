import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useSearchParams, useNavigation } from 'expo-router'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { Toast } from '@fruits-chain/react-native-xiaoshu'
import { postAddBotToChatList, postPublishBot, setBotPrivate } from '../../../api/robot'
import { styles } from './style'
import editIcon from '../../../assets/images/edit.png'
import publishIcon from '../../../assets/images/publish.png'
import useBotStore from '../../../store/botStore'
import FlashIcon from '../../../components/flashIcon'
import useUserStore from '../../../store/userStore'
import { genBotUrl } from '../../../components/profileInfo/helper'
import CallBackManagerSingle from '../../../utils/CallBackManager'
import LinearText from '../../../components/linearText'
import Tag from '../../../components/tag'
import { ScrollView } from 'react-native'

export default function Robot() {
  const router = useRouter()
  const navigation = useNavigation()
  const { name } = useSearchParams()
  const [tagList, setTagList] = useState([])
  const botStore = useBotStore()
  const userStore = useUserStore.getState().userBaseInfo
  useEffect(() => {
    navigation.setOptions({
      title: 'Robot',
    })
  }, [])
  useEffect(() => {
    let list
    if (botStore?.tag) {
      list = [
        {
          id: 0,
          bgColor: '#F1EAFE',
          tagColor: '#7A2EF6',
          keu: 'userId',
          name: 'Mine',
        },
        botStore.tag,
        ...[
          {
            id: 2,
            bgColor: '#F5E1EF',
            tagColor: '#DD0EA3',
            key: 'language',
            name: 'en_US',
          },
        ],
      ]
    } else {
      list = [
        {
          id: 2,
          bgColor: '#F5E1EF',
          tagColor: '#DD0EA3',
          key: 'language',
          name: 'en_US',
        },
      ]
    }
    setTagList(list)
  }, [navigation, name])

  const renderButton = () => {
    if (userStore?.userId === botStore?.userId) {
      if (botStore.privateBotId) {
        if (botStore.status === 'Public') {
          return (
            <TouchableOpacity
              onPress={() => {
                const { close, setMessage } = Toast.loading({ message: 'Waiting', duration: 0 })
                setBotPrivate({ botUid: botStore.uid })
                  .then(() => {
                    setMessage('Unpublished successfully')
                    CallBackManagerSingle().execute('ugcbotList', botStore.uid)
                  })
                  .finally(() => {
                    close()
                  })
              }}
              style={styles.actionsItem}
            >
              <Image
                source={publishIcon}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
              <Text style={styles.actionsItemText}>Unpublish</Text>
            </TouchableOpacity>
          )
        }
      } else {
        return (
          <>
            <TouchableOpacity
              onPress={() => Toast('Please use a desktop browser to create a robot')}
              style={{ ...styles.actionsItem, marginRight: 10 }}
            >
              <Image
                source={editIcon}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
              <Text style={styles.actionsItemText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const { close, setMessage } = Toast.loading({ message: 'Waiting', duration: 0 })
                postPublishBot({ botUid: botStore.uid })
                  .then(() => {
                    setMessage('Published successfully')
                    CallBackManagerSingle().execute('ugcbotList', botStore.uid)
                  })
                  .finally(() => {
                    close()
                  })
              }}
              style={styles.actionsItem}
            >
              <Image
                source={publishIcon}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
              <Text style={styles.actionsItemText}>Publish</Text>
            </TouchableOpacity>
          </>
        )
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Image
          source={{ uri: genBotUrl(botStore.logo) }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
          }}
        />
        <View style={styles.user}>
          {/* <Text numberOfLines={1} ellipsizeMode="tail" style={styles.userName}>
            {botStore.name}
          </Text> */}
          <LinearText text={botStore.name} styles={styles.userName}></LinearText>
          <FlashIcon energyPerChat={botStore.energyPerChat} />
        </View>
        <View style={styles.tagList}>
          {tagList &&
            tagList.map(item => <Tag key={item.bgColor} {...{ ...item, keyValue: botStore[item.key] }}></Tag>)}
        </View>
        {<View style={styles.actions}>{renderButton()}</View>}
        <ScrollView style={styles.description}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionValue}>{botStore.description}</Text>
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={() => {
          postAddBotToChatList({ botUid: botStore.uid })
          CallBackManagerSingle().execute('botList')
          router.push({
            pathname: `chat/${botStore.id}`,
          })
        }}
      >
        <View style={styles.actionMain}>
          <Text style={styles.actionChat}>Chat</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
