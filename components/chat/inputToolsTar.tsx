import { useContext, useEffect, useRef, useState } from 'react'
import {
  Keyboard,
  View,
  TextInput,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native'
import { Popover } from '@ui-kitten/components'
import audio from '../../assets/images/audio.jpg'
import Lines from '../../assets/images/chat/lines.svg'
import Keyborad from '../../assets/images/chat/keyborad.svg'
import Send from '../../assets/images/chat/send.svg'
import Delete from '../../assets/images/chat/delete.svg'
import MessagePlay from '../../assets/images/chat/message_play.svg'
import Messagepause from '../../assets/images/chat/message_pause.svg'
import RecordButton from './RecordButton'
import { StyleSheet } from 'react-native'
import { useCallbackOne } from 'use-memo-one'
import AudioMessage from './audioMessage'
import * as FileSystem from 'expo-file-system'
import ToolsModal, { ActionType } from './toolsModal'
import ShareToPopup from './shareToPopup'
import { ChatContext } from '../../app/chat/chatContext'
import { Toast } from '@fruits-chain/react-native-xiaoshu'
type Props = {
  minInputToolbarHeight: number
  inputTextProps: TextInput['props'] & {
    startRecording: () => void
    stopRecording: () => void
    setAuInfo: (audioFileUri: string) => void
    uid: string
    userId: number
  }
  onInputSizeChanged?: (layout: { width: number; height: number }) => void
}

function InputToolsTar({ inputTextProps, onInputSizeChanged, minInputToolbarHeight }: Props) {
  const { value, onChangeText, startRecording, stopRecording, setAuInfo, onSubmitEditing, uid, userId, ...inputProps } =
    inputTextProps

  const { setValue: setChatValue } = useContext(ChatContext)

  const [position, setPosition] = useState('absolute')
  const [audioFileUri, setAudioFileUri] = useState('')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isShow, setIsShow] = useState(false)
  const [showSend, setShowSend] = useState(false)
  const inputRef = useRef(null)
  const audioMessageRef = useRef(null)
  const ToolsModalRef = useRef(null)
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', () => {
      setShowSend(false)
      setPosition('relative')
    })
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
      setShowSend(true)
      setPosition('absolute')
    })
    return () => {
      keyboardWillShowListener?.remove()
      keyboardWillHideListener?.remove()
    }
  }, [])
  const dimensionsRef = useRef<{ width: number; height: number }>()
  const handleButtonPress = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const determineInputSizeChange = useCallbackOne(
    (dimensions: { width: number; height: number }) => {
      if (!onInputSizeChanged) return
      if (!dimensions) {
        return
      }

      if (
        !dimensionsRef ||
        !dimensionsRef.current ||
        (dimensionsRef.current &&
          (dimensionsRef.current.width !== dimensions.width || dimensionsRef.current.height !== dimensions.height))
      ) {
        dimensionsRef.current = dimensions
        onInputSizeChanged(dimensions)
      }
    },
    [onInputSizeChanged]
  )
  const [visible, setVisible] = useState(false)

  const toolsAction = (key: ActionType) => {
    switch (key) {
      case 'ShareChatRecords':
        setVisible(false)
        setChatValue({ pageStatus: 'sharing' })
        break

      default:
        break
    }
  }
  const handleContentSizeChange = ({
    nativeEvent: { contentSize },
  }: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => determineInputSizeChange(contentSize)
  return (
    <View style={[styles.container, { position }] as ViewStyle}>
      <View>
        {!audioFileUri ? (
          <View style={{ ...styles.primary, height: minInputToolbarHeight }}>
            <Popover
              visible={visible}
              fullWidth={true}
              placement="top"
              anchor={() => (
                <TouchableOpacity
                  onPress={e => {
                    setVisible(true)
                    e.preventDefault()
                  }}
                  style={styles.toolsIcon}
                >
                  <Lines></Lines>
                </TouchableOpacity>
              )}
              onBackdropPress={() => setVisible(false)}
            >
              <ToolsModal onAction={toolsAction} userId={userId} uid={uid} ref={ToolsModalRef}></ToolsModal>
            </Popover>
            <ShareToPopup />
            {isShow ? (
              <TextInput
                ref={inputRef}
                returnKeyType="default"
                blurOnSubmit={false}
                multiline={true}
                maxLength={500}
                placeholder="Wite a message"
                style={styles.textInput}
                enablesReturnKeyAutomatically
                onChangeText={inputText => {
                  onChangeText(inputText)
                }}
                onContentSizeChange={handleContentSizeChange}
                {...inputTextProps}
                {...inputProps}
              />
            ) : (
              <RecordButton
                setAudioFileUri={setAudioFileUri}
                startRecording={startRecording}
                stopRecording={stopRecording}
              ></RecordButton>
            )}
            <TouchableOpacity
              style={styles.toolsIcon}
              onPress={() => {
                setIsShow(pre => {
                  if (!pre) {
                    setTimeout(() => handleButtonPress())
                  }
                  return !pre
                })
              }}
            >
              {isShow ? (
                showSend ? (
                  <Image style={styles.Icon} source={audio}></Image>
                ) : (
                  <TouchableOpacity onPress={() => onSubmitEditing(value as any)}>
                    <Send></Send>
                  </TouchableOpacity>
                )
              ) : (
                <Keyborad fill={'#2D3748'}></Keyborad>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <AudioMessage ref={audioMessageRef} showControl={false} audioFileUri={audioFileUri}></AudioMessage>
            <View style={styles.accessory}>
              <TouchableOpacity
                onPress={async () => {
                  const { exists } = await FileSystem.getInfoAsync(audioFileUri)

                  if (exists) {
                    try {
                      await FileSystem.deleteAsync(audioFileUri)
                      Toast('Deleted recording file')
                    } catch (error) {
                      Toast('Failed to delete recording file')
                    }
                  }
                  setAudioFileUri('')
                }}
              >
                <Delete></Delete>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setIsPlaying(pre => {
                    audioMessageRef.current.handlePlayPause()
                    return !pre
                  })
                }
              >
                {isPlaying ? <Messagepause /> : <MessagePlay />}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setAuInfo(audioFileUri)
                  setAudioFileUri('')
                }}
              >
                <Send></Send>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b2b2b2',
    backgroundColor: '#F6F6F6',
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    height: 40,
  },
  accessory: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  toolsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    position: 'relative',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Icon: {
    width: 18,
    height: 18,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 8,
    // marginVertical: 12,
    textAlignVertical: 'center',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    lineHeight: 26,
    height: Platform.select({
      ios: 40,
      android: 40,
      web: 34,
    }),
    // marginTop: Platform.select({
    //   ios: 6,
    //   android: 0,
    //   web: 6,
    // }),
    // marginBottom: Platform.select({
    //   ios: 8,
    //   android: 8,
    //   web: 4,
    // }),
  },
})

export default InputToolsTar
