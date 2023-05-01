import { Text, View } from '../../components/Themed'
import { Image } from 'react-native'
import { memo } from 'react'
import styles from './styles'
import you from '../../assets/images/you.gif'
import me from '../../assets/images/me.jpg'
import { chatTimeFormat } from '../../utils/time'
import { ChatItem } from '../../app/chat/[id]'

type Props = {
  chatData: ChatItem[]
  item: ChatItem
  index: number
  children?: (() => React.ReactNode) | React.ReactNode
}

function chatItem({ chatData, item, index }: Props) {
  const tag = item.tag
  const timeRenderJSX =
    index === 0 || (index !== 0 && item.time - chatData?.[index - 1]?.time > 1000 * 60 * 1) ? (
      <Text style={styles.time}>{chatTimeFormat(item.time)}</Text>
    ) : null

  if (!item.tag) return null
  return (
    <View focusable>
      {timeRenderJSX}
      <View style={[styles.msgBox, tag === 1 ? styles.you : styles.me]}>
        <Image source={tag === 1 ? you : me} style={styles.avatar} />
        <View style={[styles.contentBox, tag === 1 ? styles.youContent : styles.meContent]}>
          {/* <View style={tag === 1 ? styles.triangleLeft : styles.triangleRight} /> */}
          <Text style={styles.content}>{item.content}</Text>
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
