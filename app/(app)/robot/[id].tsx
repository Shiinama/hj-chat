import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useSearchParams, useNavigation } from 'expo-router'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { Toast } from '@fruits-chain/react-native-xiaoshu'
import { postAddBotToChatList, postPublishBot, setBotPrivate } from '../../../api/robot'
import { styles } from './style'
import editIcon from '../../../assets/images/setting/edit.png'
import publishIcon from '../../../assets/images/setting/publish.png'
import xiajia from '../../../assets/images/setting/xiajia.png'
import chat from '../../../assets/images/setting/chat.png'
import share from '../../../assets/images/setting/share.png'
import usebotStore from '../../../store/botStore'
import useUserStore from '../../../store/userStore'
import { renderImage } from '../../../components/profileInfo/helper'
import CallBackManagerSingle from '../../../utils/CallBackManager'
import LinearText from '../../../components/linearText'
import Tag from '../../../components/tag'
import { ScrollView } from 'react-native'
import { getBotSharingCode } from '../../../api/setting'
import System from '../../../constants/System'
import Clipboard from '@react-native-clipboard/clipboard'
import { TagFromType, useTagList } from '../../../constants/TagList'

export default function Robot() {
  const router = useRouter()
  const navigation = useNavigation()
  const { name } = useSearchParams()
  const [tagList, setTagList] = useState([])
  const botStore = usebotStore().botBaseInfo
  const userStore = useUserStore.getState().profile
  const tags = useTagList(botStore, TagFromType.Robot)
  const isMinme = userStore?.id === botStore?.userId
  useEffect(() => {
    navigation.setOptions({
      title: 'Robot',
    })
  }, [])
  useEffect(() => {
    setTagList(tags)
  }, [navigation, name])
  const renderButton = () => {
    if (isMinme) {
      if (botStore?.privateBotId) {
        if (botStore?.status === 'Public') {
          return (
            <TouchableOpacity
              onPress={() => {
                const { close, setMessage } = Toast.loading({ message: 'Waiting', duration: 0 })
                setBotPrivate({ botUid: botStore?.uid })
                  .then(() => {
                    setMessage('Unpublished successfully')
                    CallBackManagerSingle().execute('ugcbotAllList', botStore?.uid)
                  })
                  .finally(() => {
                    close()
                  })
              }}
              style={styles.actionsItem}
            >
              <Image
                source={xiajia}
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
              style={{ ...styles.actionsItem }}
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
                postPublishBot({ botUid: botStore?.uid })
                  .then(() => {
                    setMessage('Published successfully')
                    CallBackManagerSingle().execute('ugcbotAllList', botStore?.uid)
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
        {renderImage(botStore?.logo, {
          width: 100,
          height: 100,
          borderRadius: 100,
        })}
        <View style={styles.user}>
          <LinearText text={botStore?.name} styles={styles.userName}></LinearText>
        </View>
        <View style={styles.tagList}>
          {tagList &&
            tagList.map(item => (
              <Tag key={item.bgColor} {...{ ...item, keyValue: botStore && botStore[item.key] }}></Tag>
            ))}
        </View>
        {
          <View style={styles.actions}>
            <>
              <TouchableOpacity
                style={styles.actionsItem}
                onPress={() => {
                  postAddBotToChatList({ botUid: botStore?.uid })
                  CallBackManagerSingle().execute('botList')
                  router.push({
                    pathname: `chat/${botStore?.id}`,
                  })
                }}
              >
                <Image
                  source={chat}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
                <Text style={styles.actionsItemText}>Chat</Text>
              </TouchableOpacity>
              {renderButton()}
              <TouchableOpacity
                onPress={() => {
                  getBotSharingCode({ botUid: botStore?.uid }).then(res => {
                    Clipboard.setString(`${System.botShareLink}${res}`)
                    Toast('Copied')
                  })
                }}
                style={styles.actionsItem}
              >
                <Image
                  source={share}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
                <Text style={styles.actionsItemText}>Share</Text>
              </TouchableOpacity>
            </>
          </View>
        }
        <ScrollView style={styles.description}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionValue}>{botStore?.description}</Text>
        </ScrollView>
      </View>
    </View>
  )
}
