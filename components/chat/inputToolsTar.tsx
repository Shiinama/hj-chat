import { useEffect, useRef, useState } from 'react'
import {
  Keyboard,
  View,
  TextInput,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  Platform,
  Image,
  Touchable,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
} from 'react-native'
import audio from '../../assets/images/audio.jpg'
import lines from '../../assets/images/lines.jpg'
import Keyborad from '../../assets/images/chat/keyborad.svg'
import Huatong from '../../assets/images/chat/huatong.svg'
import RecordButton from './RecordButton'
import { StyleSheet } from 'react-native'
import { useCallbackOne } from 'use-memo-one'
// import { Image } from 'react-native-svg'

type Props = {
  minInputToolbarHeight: number
  inputTextProps: TextInput['props'] & {
    startRecording: () => void
    stopRecording: () => void
    isRecording: any
  }
  onInputSizeChanged?: (layout: { width: number; height: number }) => void
}

function InputToolsTar({ inputTextProps, onInputSizeChanged, minInputToolbarHeight }: Props) {
  const { value, onChangeText, startRecording, stopRecording, isRecording, ...inputProps } = inputTextProps
  const [position, setPosition] = useState('absolute')
  const [isShow, setIsShow] = useState(false)
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', () => setPosition('relative'))
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => setPosition('absolute'))
    return () => {
      keyboardWillShowListener?.remove()
      keyboardWillHideListener?.remove()
    }
  }, [])
  const dimensionsRef = useRef<{ width: number; height: number }>()

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

  const handleContentSizeChange = ({
    nativeEvent: { contentSize },
  }: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => determineInputSizeChange(contentSize)
  return (
    <View style={[styles.container, { position }] as ViewStyle}>
      <View style={{ ...styles.primary, height: minInputToolbarHeight }}>
        <View style={styles.toolsIcon}>
          <Image style={styles.Icon} source={lines}></Image>
        </View>
        {isShow ? (
          <TextInput
            returnKeyType="send"
            blurOnSubmit={false}
            // multiline={true}
            placeholder="Wite a message"
            style={styles.textInput}
            enablesReturnKeyAutomatically
            onChangeText={inputText => {
              const newText = inputText.replace(/(.{30})/g, '$1\n')
              onChangeText(newText)
            }}
            onContentSizeChange={handleContentSizeChange}
            {...inputTextProps}
            {...inputProps}
          />
        ) : (
          <RecordButton
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
          ></RecordButton>
        )}
        <View style={styles.container}></View>

        <TouchableOpacity
          style={styles.toolsIcon}
          onPress={() => {
            setIsShow(pre => !pre)
          }}
        >
          {isShow ? <Image style={styles.Icon} source={audio}></Image> : <Keyborad fill={'#2D3748'}></Keyborad>}
        </TouchableOpacity>
      </View>
      {/* <View style={styles.accessory}></View> */}
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
    alignItems: 'flex-end',
    paddingBottom: 50,
    paddingHorizontal: 20,
    height: 40,
  },
  accessory: {
    height: 44,
  },
  toolsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'red',
    position: 'absolute',
    top: '-50%',
    backgroundColor: 'red',
    opacity: 0.5,
  },
  Icon: {
    // flex: 1,
    width: 18,
    height: 18,
  },
  textInput: {
    flex: 1,
    // marginLeft: 10,
    marginHorizontal: 8,
    // marginVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    // lineHeight: 16,
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
