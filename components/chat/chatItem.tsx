import { Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native'
import styles from './styles'
import { genAvatarUrl, renderImage } from '../../components/profileInfo/helper'
import { Image } from 'expo-image'
import AudioMessage from './audioMessage'
import Blur from '../../assets/images/chat/blur.svg'
import imgPlaceholder from '../../assets/images/img_placeholder.png'
import CheckIcon from '../../assets/images/chat/check.svg'
import CheckedIcon from '../../assets/images/chat/checked.svg'
import Svt from '../../assets/images/chat/svt.svg'
import Translate from '../../assets/images/chat/translte.svg'
import { memo, useContext, useEffect, useState } from 'react'
import { ChatContext } from '../../app/(app)/chat/chatContext'
import { Checkbox, Loading } from '@fruits-chain/react-native-xiaoshu'
import { BlurView } from '@react-native-community/blur'
import Markdown from 'react-native-marked'

import ShellLoading from '../loading'
import { MessageStreamText, MessageStreamTextRes } from './type'
import SocketStreamManager from './socketManager'
import { MessageDetail } from '../../types/MessageTyps'
import botStore from '../../store/botStore'
type Props = {
  item: MessageDetail & number
  translationText
  children?: (() => React.ReactNode) | React.ReactNode
  logo: string
  me: string
}

function chatItem({ item, translationText, me, logo }: Props) {
  const { value: chatValue, setValue: setChatValue } = useContext(ChatContext)
  const [messageStream, setMessageStream] = useState<MessageStreamText>()
  const [audioStream, setAudioStream] = useState<string>()
  const [buttonIndex, setButtonIndex] = useState<number>(1)
  const botState = botStore.getState()
  useEffect(() => {
    const msgKey = item.botId + '&BOT&' + item.replyUid
    // console.log('item.type:', item)
    if (item.type === 'LOADING' && item.replyUid) {
      // console.log('注册:', item)
      setButtonIndex(() => 2)
      SocketStreamManager().addTextStreamCallBack(msgKey, item => {
        // console.log('收到item:', item)
        setMessageStream({ ...item })
        if (item.isFinal) {
          SocketStreamManager().removeTextStreamCallBack(msgKey)
        }
      })
      SocketStreamManager().addAudioStreamCallBack(msgKey, (item, url) => {
        // console.log('收到item:', item)
        setAudioStream(url)
        if (item.isFinal) {
          SocketStreamManager().removeTextStreamCallBack(msgKey)
        }
      })
    } else {
      SocketStreamManager().removeTextStreamCallBack(msgKey)
    }
    return () => {
      SocketStreamManager().removeTextStreamCallBack(msgKey)
      SocketStreamManager().removeAudioStreamCallBack(msgKey)
    }
  }, [item])
  const isBlur = buttonIndex === 1
  if (item.uid === '1231') return null
  const tag = item?.replyUid
  const renderMessageAudio = () => {
    const url = item?.voiceUrl || audioStream
    if (!url || !botState?.botSetting?.outputVoice) {
      return null
    }
    return (
      <View style={{ height: 50, justifyContent: 'center', width: 263 }}>
        <AudioMessage audioFileUri={url} />
      </View>
    )
  }
  const renderMessageText = ({ textMsg }: { textMsg?: boolean }) => {
    const messageTxt = messageStream?.text || item.text
    if (!messageTxt) {
      return null
    }
    const markdownRender = text => {
      return (
        <Markdown
          styles={{ code: { backgroundColor: '#fff', padding: 16 }, paragraph: { backgroundColor: '#F6F6F6' } }}
          value={text}
          flatListProps={{
            initialNumToRender: 8,
          }}
        />
      )
    }

    // textMsg fix 纯文字消息上下全局加了两个分割线，这里把它去掉
    return (
      <View style={[styles.content, textMsg ? styles.textContent : {}]}>
        {isBlur && item?.type === 'REPLY' && (
          <TouchableWithoutFeedback onPress={() => setButtonIndex(2)}>
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={2}
              reducedTransparencyFallbackColor="white"
            />
          </TouchableWithoutFeedback>
        )}
        {buttonIndex === 1 && <Text>{messageTxt}</Text>}
        {buttonIndex === 2 && markdownRender(messageTxt)}
        {buttonIndex === 3 &&
          (item.translation ? <Text>{item.translation}</Text> : <Loading color="#7A2EF6">Translating</Loading>)}
      </View>
    )
  }
  const renderReply = () => {
    const param = {
      style: { marginRight: 5 },
      width: 10,
      height: 10,
    }
    console.log(botState.botSetting)
    const data = [
      botState?.botSetting?.textMasking && {
        id: 1,
        dText: 'Blur',
        Icon: id => <Blur fill={id === buttonIndex ? '#FFFFFF' : '#6C7275'} {...param} />,
      },
      {
        id: 2,
        dText: 'Text',
        Icon: id => <Svt fill={id === buttonIndex ? '#FFFFFF' : '#6C7275'} {...param} />,
      },
      botState?.botSetting?.textTranslation && {
        id: 3,
        dText: 'Translate',
        Icon: id => (
          <Translate
            fill={id === buttonIndex ? '#FFFFFF' : '#6C7275'}
            width={14}
            height={14}
            style={{ marginRight: 5 }}
          />
        ),
      },
    ].filter(Boolean)
    console.log('data:', data)
    return data.map(({ Icon, id, dText }) => (
      <TouchableOpacity
        key={dText}
        style={[styles.button, buttonIndex === id && styles.active]}
        onPress={e => {
          setButtonIndex(id)
          if (id === 3) {
            if (item.translation) return
            translationText(item.uid)
          }
        }}
      >
        {Icon && Icon(id)}
        <Text style={{ color: buttonIndex === id ? 'white' : 'black' }}>{dText}</Text>
      </TouchableOpacity>
    ))
  }
  const loadingRender = () => {
    return (
      <View style={styles.loadingBox}>
        <Text style={styles.loadingText}>replying</Text>
        <View style={styles.loadingIcon}>
          <ShellLoading></ShellLoading>
        </View>
      </View>
    )
  }
  const checkboxJSX = chatValue.pageStatus === 'sharing' && (
    <Checkbox
      style={styles.checkbox}
      value={chatValue?.selectedItems?.includes(item?.uid)}
      onChange={val => {
        if (val) {
          setChatValue({
            selectedItems: [...(chatValue?.selectedItems || []), item?.uid],
          })
        } else {
          setChatValue({
            selectedItems: chatValue?.selectedItems?.filter(v => v !== item.uid),
          })
        }
      }}
      renderIcon={({ active, onPress }) => {
        return active ? <CheckedIcon onPress={onPress} /> : <CheckIcon onPress={onPress} />
      }}
    />
  )
  return (
    <View style={styles.itemWrap}>
      <View style={[styles.msgBox, tag ? styles.you : styles.me]}>
        <View style={styles.avatar}>
          {tag ? (
            renderImage(logo, styles.avatar)
          ) : (
            <Image
              placeholder={imgPlaceholder}
              source={{
                uri: genAvatarUrl(me),
              }}
              style={styles.avatar}
            />
          )}
        </View>

        <View style={[styles.contentBox, { flexDirection: tag ? 'row' : 'row-reverse' }]}>
          <View style={[styles.chatWrap, tag ? styles.youContent : styles.meContent]}>
            {renderMessageAudio()}
            {renderMessageText({ textMsg: item?.voiceUrl ? false : true })}
            {item?.type === 'REPLY' && <View style={styles.buttonGroup}>{renderReply()}</View>}
            {item?.type === 'LOADING' && !item.text && !messageStream?.text && loadingRender()}
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>
      {checkboxJSX}
    </View>
  )
}

export default memo(chatItem)
