import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  Keyboard,
  View,
  TextInput,
  ViewStyle,
  Platform,
  Image,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from 'react-native'
import audio from '../../assets/images/audio.jpg'
import Lines from '../../assets/images/chat/lines.svg'
import Keyborad from '../../assets/images/chat/keyborad.svg'
import Send from '../../assets/images/chat/send.svg'
import RecordButton from './RecordButton'
import { StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import ToolsModal, { ActionType } from './toolsModal'
import ShareToPopup from './shareToPopup'
import { ChatContext } from '../../app/(app)/chat/chatContext'
import { Overlay, Toast } from '@fruits-chain/react-native-xiaoshu'
import { removeBotFromChatList, resetHistory, setBotPinnedStatus } from '../../api'
import { useBoolean } from 'ahooks'
import AudioAnimation from './audioAnimation'
import CallBackManagerSingle from '../../utils/CallBackManager'
type Props = {
  minInputToolbarHeight: number
  inputTextProps: TextInput['props'] & {
    startRecording: () => void
    stopRecording: () => void
    durationMillis
    setAuInfo: (audioFileUri: string) => void
    uid: string
    userId: number
    pinned: boolean
  }
  inputHeight
  barHeight
  setBarHeight
  toolsBottm
  setInputHeight
  onInputSizeChanged?: (layout: { width: number; height: number }) => void
  haveHistory?: boolean
}

function InputToolsTar({
  setBarHeight,
  barHeight,
  inputHeight,
  setInputHeight,
  inputTextProps,
  haveHistory,
  toolsBottm,
  minInputToolbarHeight,
}: Props) {
  const {
    durationMillis,
    startRecording,
    stopRecording,
    setAuInfo,
    onSubmitEditing,
    pinned: originalPinned,
    uid,
    userId,
    ...inputProps
  } = inputTextProps
  const { setValue: setChatValue } = useContext(ChatContext)
  const [pinned, setPinned] = useState(originalPinned)
  const [position, setPosition] = useState('absolute')
  const [toolsVisible, { set: setToolsVisible }] = useBoolean(false)
  const [audioFileUri, setAudioFileUri] = useState('')
  const [text, setText] = useState('')
  // 控制话筒弹出
  const [isShow, setIsShow] = useState(false)
  const [showAni, setShowAni] = useState(true)
  const [showSend, setShowSend] = useState(true)
  const inputRef = useRef(null)
  const router = useRouter()
  const AnimationRef = useRef(null)
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', () => {
      if (Platform.OS === 'android') return
      setShowSend(false)
      setIsShow(true)
      setPosition('relative')
    })
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
      if (Platform.OS === 'android') return
      setShowSend(true)
      setPosition('absolute')
    })

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      if (Platform.OS === 'ios') return
      setShowSend(false)
      setIsShow(true)
      setPosition('relative')
    })
    const KeyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (Platform.OS === 'ios') return
      setShowSend(true)
      setPosition('absolute')
    })
    return () => {
      keyboardDidShowListener?.remove()
      KeyboardDidHideListener?.remove()
      keyboardWillShowListener?.remove()
      keyboardWillHideListener?.remove()
    }
  }, [])
  const handleButtonPress = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const toolsAction = (key: ActionType) => {
    if (!haveHistory && key !== 'RemoveFromList' && key !== 'Pin') {
      Toast('No chat content')
      return
    }
    switch (key) {
      case 'Pin':
        const { close: pinnedClose } = Toast.loading(pinned ? 'Unpin' : 'Pinned')
        setBotPinnedStatus({ botUid: uid, pinned: !pinned }).then(() => {
          setPinned(!pinned)
          pinnedClose()
          CallBackManagerSingle().execute('botList')
        })
        break
      case 'RemoveFromList':
        const { close: removeClose } = Toast.loading('Move...')
        removeBotFromChatList({ botUid: uid }).then(() => {
          removeClose()
          CallBackManagerSingle().execute('botList')
          router.push({ pathname: '(tabs)' })
        })
        break
      case 'ClearMemory':
        const { close: clearClose } = Toast.loading('Clear Contenxt')
        resetHistory({ botUid: uid }).then(() => {
          clearClose()
        })
        break
      case 'ShareChatRecords':
        setChatValue({ pageStatus: 'sharing' })
        break

      default:
        break
    }
    setToolsVisible(false)
  }

  const inputBottmTollsBar = () => {
    return (
      <RecordButton
        isShow={isShow}
        AnimationRef={AnimationRef}
        recordMaxSecond={59}
        durationMillis={durationMillis}
        setIsShow={setIsShow}
        setShowAni={setShowAni}
        setAudioFileUri={setAudioFileUri}
        audioFileUri={audioFileUri}
        setAuInfo={setAuInfo}
        startRecording={startRecording}
        stopRecording={stopRecording}
      ></RecordButton>
    )
  }

  const renderLeftInput = () => {
    return (
      <>
        <Overlay
          visible={toolsVisible}
          backgroundColor="transparent"
          onPress={() => {
            setToolsVisible(false)
          }}
        >
          <ToolsModal bottom={barHeight} userId={userId} pinned={pinned} toolsAction={toolsAction} />
        </Overlay>
        <ShareToPopup />
        <TouchableOpacity
          style={styles.toolsIcon}
          onPress={() => {
            setToolsVisible(true)
            /** 底部高度ios获取不正确 */
            if (Platform.OS === 'ios') {
              inputRef.current?.blur()
            }
          }}
        >
          <Lines></Lines>
        </TouchableOpacity>
      </>
    )
  }

  const renderRightInput = useMemo(() => {
    return (
      <>
        {isShow ? (
          showSend ? (
            <TouchableOpacity style={styles.toolsIcon} onPress={() => setIsShow(false)}>
              <Image style={styles.Icon} source={audio}></Image>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.toolsIcon}
              onPress={() => {
                onSubmitEditing(text as any)
                setText('')
              }}
            >
              <Send></Send>
            </TouchableOpacity>
          )
        ) : (
          <TouchableOpacity
            style={styles.toolsIcon}
            onPress={() => {
              setIsShow(true)
              handleButtonPress()
            }}
          >
            <Keyborad fill={'#2D3748'}></Keyborad>
          </TouchableOpacity>
        )}
      </>
    )
  }, [isShow, showSend, text])
  const handleContentSizeChange = ({
    nativeEvent: { contentSize },
  }: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    let height = contentSize.height
    if (height === inputHeight) return
    if (height < 50) {
      setInputHeight(35)
      return
    }
    if (height > 40 && height < 80) {
      setInputHeight(height)
    }
  }
  return (
    <View
      style={[styles.container, { position }, { paddingTop: isShow ? 0 : 10 }] as ViewStyle}
      onLayout={e => {
        setBarHeight(e.nativeEvent.layout.height)
      }}
    >
      <>
        <View
          style={{
            ...styles.primary,
            height: isShow ? minInputToolbarHeight : minInputToolbarHeight / 2,
            marginBottom: toolsBottm,
          }}
        >
          {
            <>
              {showAni ? (
                <View style={{ flexDirection: 'row' }}>
                  {renderLeftInput()}
                  <TextInput
                    ref={inputRef}
                    returnKeyType="default"
                    blurOnSubmit={false}
                    multiline={true}
                    maxLength={500}
                    onContentSizeChange={handleContentSizeChange}
                    placeholder="Write a message"
                    style={[styles.textInput, { height: inputHeight }]}
                    onChangeText={setText}
                    value={text}
                    {...inputTextProps}
                    {...inputProps}
                  />
                  {renderRightInput}
                </View>
              ) : (
                <AudioAnimation ref={AnimationRef} durationMillis={durationMillis}></AudioAnimation>
              )}
            </>
          }
        </View>
        {inputBottmTollsBar()}
      </>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    // marginBottom: 10,
  },
  toolsIcon: {
    width: 35,
    height: 35,
    borderRadius: 6,
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
    marginHorizontal: 10,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 16,
  },
})

export default InputToolsTar
