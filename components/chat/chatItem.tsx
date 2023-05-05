import { Image, Text, TouchableOpacity, View } from 'react-native'
import styles from './styles'
import you from '../../assets/images/flash.jpg'
import me from '../../assets/images/me.jpg'
import { ChatItem } from '../../app/chat/[id]'
import AudioMessage from './audioMessage'
import Blur from '../../assets/images/chat/blur.svg'
import Svt from '../../assets/images/chat/svt.svg'
import Translate from '../../assets/images/chat/translte.svg'
import { useState } from 'react'
import { Loading } from '@fruits-chain/react-native-xiaoshu'

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
  const [buttonIndex, setButtonIndex] = useState<number>(1)
  const renderMessageAudio = () => <AudioMessage audioFileUri={item.voiceUrl} />
  const renderMessageText = () => {
    return (
      <View style={[styles.content]}>
        {buttonIndex === 1 && <Text>{item.text}</Text>}
        {buttonIndex === 2 && <Text>{item.text}</Text>}
        {buttonIndex === 3 && (item.translation ? <Text>{item.translation}</Text> : <Loading color="#7A2EF6" />)}
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
