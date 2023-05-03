import { Image, Text, TouchableOpacity, View } from 'react-native'
import styles from './styles'
import you from '../../assets/images/you.gif'
import me from '../../assets/images/me.jpg'
import { chatTimeFormat } from '../../utils/time'
import { ChatItem } from '../../app/chat/[id]'
import AudioMessage from './audioMessage'
import Blur from '../../assets/images/chat/blur.svg'
import Svt from '../../assets/images/chat/svt.svg'
import Translate from '../../assets/images/chat/translte.svg'
import { useEffect, useState } from 'react'
type Props = {
  chatData: ChatItem[]
  item: ChatItem
  index: number
  children?: (() => React.ReactNode) | React.ReactNode
}

function chatItem({ chatData, item, index }: Props) {
  const tag = item.replyUid
  const [buttonIndex, setButtonIndex] = useState<number>(1)
  const timeRenderJSX =
    index === 0 || (index !== 0 && item.time - chatData?.[index - 1]?.time > 1000 * 60 * 1) ? (
      <Text style={styles.time}>{chatTimeFormat(item.time)}</Text>
    ) : null

  return (
    <View focusable>
      {timeRenderJSX}
      <View style={[styles.msgBox, tag ? styles.you : styles.me]}>
        <Image source={tag ? you : me} style={styles.avatar} />
        <View style={[styles.contentBox, tag ? styles.youContent : styles.meContent]}>
          {item.voiceUrl && <AudioMessage audioFileUri={item.voiceUrl} />}
          {item.text && (
            <View style={styles.content}>
              <Text>{item.text}</Text>
            </View>
          )}
          {item.type === 'REPLY' && (
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, buttonIndex === 1 && styles.active]}
                onPress={() => setButtonIndex(1)}
              >
                <Blur
                  style={{ marginRight: 5 }}
                  width={10}
                  height={10}
                  fill={buttonIndex === 1 ? '#FFFFFF' : '#6C7275'}
                ></Blur>
                <Text style={{ color: buttonIndex === 1 ? 'white' : 'black' }}>Blur</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, buttonIndex === 2 && styles.active]}
                onPress={() => setButtonIndex(2)}
              >
                <Svt
                  style={{ marginRight: 5 }}
                  width={10}
                  height={10}
                  fill={buttonIndex === 2 ? '#FFFFFF' : '#6C7275'}
                ></Svt>
                <Text style={{ color: buttonIndex === 2 ? 'white' : 'black' }}>Text</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, buttonIndex === 3 && styles.active]}
                onPress={() => setButtonIndex(3)}
              >
                <Translate
                  style={{ marginRight: 5 }}
                  width={10}
                  height={10}
                  fill={buttonIndex === 2 ? '#FFFFFF' : '#6C7275'}
                ></Translate>
                <Text style={{ color: buttonIndex === 3 ? 'white' : 'black' }}>Translate</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

// TODO 小宁的图片有点问题
{
  /* <View key={img.imgId}>
                {timeRenderJSX}
                <TouchableOpacity
                  style={[styles.msgBox, styles.you]}
                  onPress={() => {
                    onPressImg(img.imgId)
                  }}
                >
                  <Image source={you} style={styles.avatar} />
                  <AutoHeightImage width={200} source={{ uri: img.url }} style={styles.picture} />
                </TouchableOpacity>
              </View> */
}

export default chatItem
