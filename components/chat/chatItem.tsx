import { Text, TouchableOpacity, View, TouchableWithoutFeedback, Alert } from 'react-native'
import styles from './styles'
import { genAvatarUrl, renderImage } from '../../components/profileInfo/helper'
import { Image } from 'expo-image'
import AudioMessage from './audioMessage'
import imgPlaceholder from '../../assets/images/img_placeholder.png'
import CheckIcon from '../../assets/images/chat/check.svg'
import CheckedIcon from '../../assets/images/chat/checked.svg'
import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ChatContext } from '../../app/(app)/chat/chatContext'
import { Checkbox } from '@fruits-chain/react-native-xiaoshu'
import SocketStreamManager from './socketManager'
import AudioPayManagerSingle from './audioPlayManager'
import { MessageDetail } from '../../types/MessageTyps'
import botStore from '../../store/botStore'
import ItemText from './itemText'
type Props = {
  item: MessageDetail & number
  children?: (() => React.ReactNode) | React.ReactNode
  logo: string
  me: string
}

function chatItem({ item, me, logo }: Props) {
  const msgKey = item.botId + '&BOT&' + item.replyUid
  const botState = botStore.getState().botBaseInfo
  const { value: chatValue, setValue: setChatValue } = useContext(ChatContext)
  const audioMessage = useRef()
  useEffect(() => {
    if (item.type === 'LOADING' && item.replyUid) {
      SocketStreamManager().addAudioStreamCallBack(msgKey, (item, url) => {
        // @ts-ignore

        SocketStreamManager().getPlayFragment().onPositionChange = (positionMillis, total) => {
          // @ts-ignore
          audioMessage.current?.playFragment?.({
            dur: positionMillis,
            total: total,
          })
        }
        SocketStreamManager().getPlayFragment().getSound = sound => {
          // @ts-ignore
          audioMessage.current?.setLoading?.(false)
          // @ts-ignore
          audioMessage.current?.setIsPlaying?.(true)
          // @ts-ignore
          audioMessage.current?.setSound?.(sound)
        }
        SocketStreamManager().getPlayFragment().finish = () => {
          // @ts-ignore
          audioMessage.current?.setIsPlaying?.(false)
        }
      })
    }
    return () => {
      SocketStreamManager().removeAudioStreamCallBack(msgKey)
    }
  }, [item])

  if (item.uid === '1231') return null
  const tag = item?.replyUid

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
            {(item.type === 'VOICE' || (botState?.botSetting?.outputVoice && item.replyUid)) && (
              <AudioMessage audioFileUri={item?.voiceUrl} ref={audioMessage} />
            )}
            <ItemText item={item} textMsg={!item?.voiceUrl} botSetting={botState?.botSetting}></ItemText>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>
      {checkboxJSX}
    </View>
  )
}

export default memo(chatItem)
