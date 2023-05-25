import { BlurView } from '@react-native-community/blur'
import { memo, useEffect, useMemo, useState } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'
import Markdown from 'react-native-marked'
import SocketStreamManager from './socketManager'
import { MessageDetail } from '../../types/MessageTyps'
import { Loading } from '@fruits-chain/react-native-xiaoshu'
import styles from './styles'

type Props = {
  item: MessageDetail
  key: string
  viewDisplayState: number
  setButtonIndex
  isBlur: boolean
  textMsg: boolean
}
const MessageText = ({ item, key, viewDisplayState, setButtonIndex, isBlur, textMsg }: Props) => {
  const [messageStreamText, setMessageStreamText] = useState<string>()
  console.log('item:', item)
  useEffect(() => {
    if (item.type === 'LOADING' && item.replyUid) {
      SocketStreamManager().addTextStreamCallBack(key, data => {
        console.log('addTextStreamCallBack', data.text)
        setMessageStreamText(data.text)
        if (data.isFinal) {
          SocketStreamManager().removeTextStreamCallBack(key)
        }
      })
    }
    return () => {
      SocketStreamManager().removeTextStreamCallBack(key)
    }
  }, [item])
  const renderText = useMemo(() => {
    console.log('messageStreamText:', messageStreamText, item.text)
    return messageStreamText || item.text
  }, [messageStreamText, item.text])
  if (!renderText) return null
  return (
    <View style={[styles.content, textMsg ? styles.textContent : {}]}>
      {isBlur && item?.type === 'REPLY' && (
        <TouchableWithoutFeedback onPress={() => setButtonIndex(2)}>
          <BlurView style={styles.absolute} blurType="light" blurAmount={2} reducedTransparencyFallbackColor="white" />
        </TouchableWithoutFeedback>
      )}
      {viewDisplayState === 1 && <Text>{renderText}</Text>}
      {viewDisplayState === 2 && (
        <Markdown
          styles={{ code: { backgroundColor: '#fff', padding: 16 }, paragraph: { backgroundColor: '#F6F6F6' } }}
          value={renderText}
          flatListProps={{
            initialNumToRender: 8,
          }}
        />
      )}
      {viewDisplayState === 3 && <Text>{item.translation}</Text>}
    </View>
  )
}

export default MessageText
