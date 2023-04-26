import React, { useCallback, useMemo, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'

import me from '@/assets/images/me.jpg'
import you from '@/assets/images/you.gif'

import { styles } from '../../app/chat/style'
import { ChatItem } from '../../app/chat/[id]'
import { chatTimeFormat } from '../../utils/time'
import ImagePreview from '.'

interface ChatContentProps {
  chatData: ChatItem[]
  isTextMode: boolean
}

const ChatContent: React.FC<ChatContentProps> = ({ chatData, isTextMode }) => {
  const [currImageIndex, setCurrImageIndex] = useState(0) // 当前预览图片的索引
  const [showImagePreview, setShowImagePreview] = useState(false) // 图片预览与否

  // console.log('chatData', chatData)
  /** 图片集 */
  const imgUrls = useMemo(() => {
    let urls = []
    chatData.forEach(ch => ch?.images?.forEach(img => urls.push({ url: img.url, id: img.imgId })))
    return urls
  }, [chatData])
  // console.log('imgUrls', imgUrls)

  const onPressImg = useCallback(
    (id: string) => {
      const index = imgUrls.findIndex(img => img.id === id)
      setCurrImageIndex(index)
      setShowImagePreview(true)
    },
    [imgUrls]
  )

  return (
    <View>
      {chatData?.map((data: ChatItem, index: number) => {
        const timeRenderJSX =
          index !== 0 && data.time - chatData?.[index - 1]?.time > 1000 * 60 * 1 ? (
            <Text style={styles.time}>{chatTimeFormat(data.time)}</Text>
          ) : null

        if (data.tag === 1) {
          return isTextMode ? (
            <View key={data.id}>
              {timeRenderJSX}
              <View focusable style={[styles.msgBox, styles.you]}>
                <Image source={you} style={styles.avatar} />
                <View style={[styles.contentBox, styles.youContent]}>
                  <View style={styles.triangleLeft} />
                  <Text style={styles.content}>{data.content}</Text>
                </View>
              </View>
            </View>
          ) : (
            data?.images?.map(img => (
              <View key={img.imgId}>
                {timeRenderJSX}
                <TouchableOpacity
                  style={[styles.msgBox, styles.you]}
                  onPress={() => {
                    onPressImg(img.imgId)
                  }}
                >
                  <Image source={you} style={styles.avatar} />
                  <AutoHeightImage width={200} source={{ uri: img.url }} style={styles.picture} />
                  <Image
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{ width: 100, height: 100 }}
                    source={{ uri: img.url }}
                  />
                </TouchableOpacity>
              </View>
            ))
          )
        } else if (data.tag === 99) {
          return (
            <View key={data.id}>
              {timeRenderJSX}
              <View focusable style={[styles.msgBox, styles.me]}>
                <Image source={me} style={styles.avatar} />
                <View style={[styles.contentBox, styles.meContent]}>
                  <View style={styles.triangleRight} />
                  <Text style={styles.content}>{data.content}</Text>
                </View>
              </View>
            </View>
          )
        } else {
          return null
        }
      })}

      {/* 图片预览组件 */}
      <ImagePreview
        index={currImageIndex}
        visible={showImagePreview}
        onVisibleChange={visible => setShowImagePreview(visible)}
        photos={imgUrls}
      />
    </View>
  )
}

export default ChatContent
