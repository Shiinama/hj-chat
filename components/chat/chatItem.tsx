import { Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native'
import styles from './styles'
import { genAvatarUrl, genBotUrl, renderImage } from '../../components/profileInfo/helper'
import { Image } from 'expo-image'
import { ChatItem } from '../../app/(app)/chat/[id]'
import AudioMessage from './audioMessage'
import Blur from '../../assets/images/chat/blur.svg'
import imgPlaceholder from '../../assets/images/img_placeholder.png'
import CheckIcon from '../../assets/images/chat/check.svg'
import CheckedIcon from '../../assets/images/chat/checked.svg'
import Svt from '../../assets/images/chat/svt.svg'
import Translate from '../../assets/images/chat/translte.svg'
import { useContext, useState } from 'react'
import { ChatContext } from '../../app/(app)/chat/chatContext'
import { Checkbox, Loading } from '@fruits-chain/react-native-xiaoshu'
import { BlurView } from '@react-native-community/blur'
type Props = {
  item: ChatItem & number
  translationText
  children?: (() => React.ReactNode) | React.ReactNode
  logo: string
  me: string
}

function chatItem({ item, translationText, me, logo }: Props) {
  const { value: chatValue, setValue: setChatValue } = useContext(ChatContext)
  const [buttonIndex, setButtonIndex] = useState<number>(1)
  const isBlur = buttonIndex === 1
  if (item.uid === '1231') return null
  const tag = item?.replyUid
  const renderMessageAudio = () => (
    <View style={{ height: 50, justifyContent: 'center' }}>
      <AudioMessage audioFileUri={item?.voiceUrl} />
    </View>
  )
  const renderMessageText = ({ textMsg }: { textMsg?: boolean }) => {
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
        {buttonIndex === 1 && <Text>{item.text}</Text>}
        {buttonIndex === 2 && <Text>{item.text}</Text>}
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
    const data = [
      {
        id: 1,
        dText: 'Blur',
        Icon: id => <Blur fill={id === buttonIndex ? '#FFFFFF' : '#6C7275'} {...param} />,
      },
      {
        id: 2,
        dText: 'Text',
        Icon: id => <Svt fill={id === buttonIndex ? '#FFFFFF' : '#6C7275'} {...param} />,
      },
      {
        id: 3,
        dText: 'Translate',
        Icon: id => <Translate fill={id === buttonIndex ? '#FFFFFF' : '#6C7275'} {...param} />,
      },
    ]
    return data.map(({ Icon, id, dText }) => (
      <TouchableOpacity
        key={dText}
        style={[styles.button, buttonIndex === id && styles.active]}
        onPress={e => {
          setButtonIndex(id)
          if (id === 3) {
            translationText(item.uid)
          }
        }}
      >
        {Icon && Icon(id)}
        <Text style={{ color: buttonIndex === id ? 'white' : 'black' }}>{dText}</Text>
      </TouchableOpacity>
    ))
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

        <View style={[styles.contentBox, tag ? styles.youContent : { ...styles.meContent }]}>
          {item?.voiceUrl && renderMessageAudio()}
          {item?.text && renderMessageText({ textMsg: item?.voiceUrl ? false : true })}
          {item?.type === 'REPLY' && <View style={styles.buttonGroup}>{renderReply()}</View>}
        </View>
      </View>
      {checkboxJSX}
    </View>
  )
}

export default chatItem
