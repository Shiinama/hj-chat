import { BlurView } from '@react-native-community/blur'
import { memo, useEffect, useMemo, useState } from 'react'
import { Text, TouchableWithoutFeedback, View, TouchableOpacity, Alert } from 'react-native'
import Markdown from 'react-native-marked'
import SocketStreamManager from './socketManager'
import { MessageDetail } from '../../types/MessageTyps'
import { Loading } from '@fruits-chain/react-native-xiaoshu'
import styles from './styles'
import { BotInfo } from '../../types/BotTypes'
import AudioPayManagerSingle from './audioPlayManager'
import { v4 as uuidv4 } from 'uuid'
import Svt from '../../assets/images/chat/svt.svg'
import Blur from '../../assets/images/chat/blur.svg'
import Translate from '../../assets/images/chat/translte.svg'
import ShellLoading from '../common/loading'

type Props = {
  item: MessageDetail
  botSetting: BotInfo['botSetting']
  textMsg: boolean
}
const MessageText = ({ item, textMsg, botSetting }: Props) => {
  const [viewDisplayState, setViewDisplayState] = useState<number>(botSetting?.textMasking ? 1 : 2)
  const [messageStreamText, setMessageStreamText] = useState<string>()
  const [translateMessage, setTranslateMessage] = useState<string>()
  const key = item.botId + '&BOT&' + item.replyUid
  const isBlur = botSetting?.textMasking && viewDisplayState === 1
  const renderReply = () => {
    const param = {
      style: { marginRight: 5 },
      width: 10,
      height: 10,
    }
    const data = [
      botSetting?.textMasking && {
        id: 1,
        dText: 'Blur',
        Icon: id => <Blur fill={id === viewDisplayState ? '#FFFFFF' : '#6C7275'} {...param} />,
      },
      {
        id: 2,
        dText: 'Text',
        Icon: id => <Svt fill={id === viewDisplayState ? '#FFFFFF' : '#6C7275'} {...param} />,
      },
      botSetting?.textTranslation && {
        id: 3,
        dText: 'Translate',
        Icon: id => (
          <Translate
            fill={id === viewDisplayState ? '#FFFFFF' : '#6C7275'}
            width={14}
            height={14}
            style={{ marginRight: 5 }}
          />
        ),
      },
    ].filter(Boolean)
    return data.map(({ Icon, id, dText }) => (
      <TouchableOpacity
        key={dText}
        style={[styles.button, viewDisplayState === id && styles.active]}
        onPress={() => {
          setViewDisplayState(id)
          if (id === 3) {
            if (caluTranslate) return
            if (!AudioPayManagerSingle().netInfo?.isConnected) {
              Alert.alert('Please check your network connection')
              return
            }
            const reqId = uuidv4()
            SocketStreamManager().sendMessage('translate_message', {
              reqId,
              messageUid: item.uid,
            })
          }
        }}
      >
        {Icon && Icon(id)}
        <Text style={{ color: viewDisplayState === id ? 'white' : 'black' }}>{dText}</Text>
      </TouchableOpacity>
    ))
  }
  const loadingRender = () => {
    return (
      <View style={{ ...styles.loadingBox, backgroundColor: item.replyUid ? '#F6F6F6' : '#F1EAFE' }}>
        <Text style={styles.loadingText}>Replying</Text>
        <View style={styles.loadingIcon}>
          <ShellLoading></ShellLoading>
        </View>
      </View>
    )
  }
  useEffect(() => {
    if (item.type === 'LOADING' && item.replyUid) {
      SocketStreamManager().addTextStreamCallBack(key, data => {
        setMessageStreamText(data.text)
        if (data.isFinal) {
          SocketStreamManager().removeTextStreamCallBack(key)
        }
      })
    } else {
      SocketStreamManager().removeTextStreamCallBack(key)
    }
    return () => {
      SocketStreamManager().removeTextStreamCallBack(key)
    }
  }, [item.text])
  useEffect(() => {
    SocketStreamManager().addTranslatedCallBack(key, data => {
      setTranslateMessage(data.translation)
    })

    return () => {
      SocketStreamManager().removeTranslatedCallBack(key)
    }
  }, [])
  const renderText = useMemo(() => {
    if (item.type === 'RESET') {
      return 'The memory has been cleared, your chat history is still preserved for you, but the robot will no longer remember the content of these conversations.'
    }
    return messageStreamText || item.text
  }, [messageStreamText, item.text, item.type])
  const caluTranslate = useMemo(() => {
    return translateMessage || item.translation
  }, [translateMessage, item.translation])
  if (!renderText) return loadingRender()
  return (
    <>
      <View style={[styles.content, textMsg ? styles.textContent : {}]}>
        {isBlur && item?.replyUid && (
          <TouchableWithoutFeedback onPress={() => setViewDisplayState(2)}>
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={2}
              reducedTransparencyFallbackColor="white"
            />
          </TouchableWithoutFeedback>
        )}

        {(viewDisplayState === 1 || viewDisplayState === 2) && (
          <Markdown
            styles={{
              code: { backgroundColor: '#fff', padding: 16 },
              paragraph: { backgroundColor: item.replyUid ? '#F6F6F6' : '#F1EAFE' },
            }}
            value={renderText}
            flatListProps={{
              initialNumToRender: 8,
            }}
          />
        )}
        {viewDisplayState === 3 &&
          (caluTranslate ? <Text>{caluTranslate}</Text> : <Loading color="#7A2EF6">Translating</Loading>)}
      </View>

      {item?.replyUid && <View style={styles.buttonGroup}>{renderReply()}</View>}
    </>
  )
}

export default MessageText
