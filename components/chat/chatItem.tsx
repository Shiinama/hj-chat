import { Image, Text, TouchableOpacity, View } from 'react-native'
import styles from './styles'
import you from '../../assets/images/flash.jpg'
import me from '../../assets/images/me.jpg'
import { chatTimeFormat } from '../../utils/time'
import { ChatItem } from '../../app/chat/[id]'
import AudioMessage from './audioMessage'
import Blur from '../../assets/images/chat/blur.svg'
import Svt from '../../assets/images/chat/svt.svg'
import Translate from '../../assets/images/chat/translte.svg'
import { useState } from 'react'

type Props = {
  chatData: ChatItem[]
  item: ChatItem & number
  index: number
  translationText
  children?: (() => React.ReactNode) | React.ReactNode
}

function chatItem({ item, translationText }: Props) {
  if (item === 123) return null
  const tag = item?.replyUid
  const renderMessageAudio = () => <AudioMessage audioFileUri={item.voiceUrl} />
  const renderMessageText = () => {
    return (
      <View style={[styles.content]}>
        {buttonIndex === 1 && <Text>{item.text}</Text>}
        {buttonIndex === 2 && <Text>{item.text}</Text>}
        {buttonIndex === 3 && <Text>{item.translation}</Text>}
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
        Icon: id => <Blur fill={id === 1 ? '#FFFFFF' : '#6C7275'} {...param} />,
      },
      {
        id: 2,
        dText: 'Text',
        Icon: id => <Svt fill={id === 1 ? '#FFFFFF' : '#6C7275'} {...param} />,
      },
      {
        id: 3,
        dText: 'Translate',
        Icon: id => <Translate fill={id === 1 ? '#FFFFFF' : '#6C7275'} {...param} />,
      },
    ]
    return data.map(({ Icon, id, dText }) => (
      <TouchableOpacity
        key={dText}
        style={[styles.button, buttonIndex === id && styles.active]}
        onPress={() => {
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
  const [buttonIndex, setButtonIndex] = useState<number>(1)
  return (
    <View style={[styles.msgBox, tag ? styles.you : styles.me]}>
      <Image source={tag ? you : me} style={styles.avatar} />
      <View style={[styles.contentBox, tag ? styles.youContent : styles.meContent]}>
        {item?.voiceUrl && renderMessageAudio()}
        {item?.text && renderMessageText()}
        {item?.type === 'REPLY' && <View style={styles.buttonGroup}>{renderReply()}</View>}
      </View>
    </View>
  )
}

export default chatItem
