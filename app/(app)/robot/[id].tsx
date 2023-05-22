import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useSearchParams, useNavigation } from 'expo-router'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { Toast } from '@fruits-chain/react-native-xiaoshu'
import { postAddBotToChatList, postPublishBot, setBotPrivate } from '../../../api/robot'
import { styles } from './style'
import editIcon from '../../../assets/images/edit.png'
import publishIcon from '../../../assets/images/publish.png'
import chat from '../../../assets/images/chat.png'
import escape from '../../../assets/images/escape.png'
import useBotStore from '../../../store/botStore'
import useUserStore from '../../../store/userStore'
import Wang from '../../../assets/images/setting/wang.svg'

import Flash from '../../../assets/images/tabbar/flash.svg'
import Huatong from '../../../assets/images/setting/huatong.svg'
import { renderImage } from '../../../components/profileInfo/helper'
import CallBackManagerSingle from '../../../utils/CallBackManager'
import LinearText from '../../../components/linearText'
import Tag from '../../../components/tag'
import { ScrollView } from 'react-native'
import { getBotSharingCode } from '../../../api/setting'
import System from '../../../constants/System'
import Clipboard from '@react-native-clipboard/clipboard'

export default function Robot() {
  const router = useRouter()
  const navigation = useNavigation()
  const { name } = useSearchParams()
  const [tagList, setTagList] = useState([])
  const botStore = useBotStore()
  const userStore = useUserStore.getState().profile
  const isMinme = userStore?.id === botStore?.userId
  useEffect(() => {
    navigation.setOptions({
      title: 'Robot',
    })
  }, [])
  useEffect(() => {
    let tags = [
      {
        id: 2,
        bgColor: '#F1EAFE',
        tagColor: '#7A2EF6',
        name: 'Mine',
        isYuandian: true,
      },
      {
        id: 1,
        name: botStore.energyPerChat,
        bgColor: '#FDF5CA',
        tagColor: '#5F5107',
        childrenIcon: <Flash width={14} height={14} />,
      },
      {
        id: 2,
        name: botStore.privateBotId ? (botStore.status === 'Public' ? 'Mainnet' : 'Hidden') : 'Testnet',
        bgColor: botStore.privateBotId ? (botStore.status === 'Public' ? '#CAF1B7' : '#d1d5db') : '#FAF4E1',
        tagColor: botStore.privateBotId ? (botStore.status === 'Public' ? '#165B0B' : '#6b7280') : '#E4B50C',
        childrenIcon: <Wang width={14} height={14} />,
      },
      {
        id: 3,
        name: botStore.language,
        bgColor: '#E7EFFF',
        tagColor: '#05286F',
        childrenIcon: <Huatong width={14} height={14} />,
      },
    ]
    if (!isMinme) {
      tags = tags.filter(i => i.id !== 2)
    }
    setTagList(tags)
  }, [navigation, name])
  const renderButton = () => {
    if (isMinme) {
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
              style={styles.actionsItem}
              onPress={() => {
                postAddBotToChatList({ botUid: botStore.uid })
                CallBackManagerSingle().execute('botList')
                router.push({
                  pathname: `chat/${botStore.id}`,
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
            <TouchableOpacity
              onPress={() => {
                getBotSharingCode({ botUid: botStore.uid }).then(res => {
                  Clipboard.setString(`${System.botShareLink}${res}`)
                  Toast('Copied')
                })
              }}
              style={styles.actionsItem}
            >
              <Image
                source={escape}
                style={{
                  // width: 25,
                  // height: 25,
                  marginTop: 5,
                }}
              />
              <Text style={styles.actionsItemText}>Share</Text>
            </TouchableOpacity>
          </>
        )
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {renderImage(botStore.logo, {
          width: 100,
          height: 100,
          borderRadius: 100,
        })}
        <View style={styles.user}>
          <LinearText text={botStore.name} styles={styles.userName}></LinearText>
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
    </View>
  )
}
