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
} from 'react-native'
import audio from '../../assets/images/audio.jpg'
import lines from '../../assets/images/lines.jpg'

import { StyleSheet } from 'react-native'
import { useCallbackOne } from 'use-memo-one'
// import { Image } from 'react-native-svg'

type Props = {
  minInputToolbarHeight: number
  inputTextProps: TextInput['props']
  onInputSizeChanged?: (layout: { width: number; height: number }) => void
}

function InputToolsTar({ inputTextProps, onInputSizeChanged, minInputToolbarHeight }: Props) {
  const { value, onChangeText, ...inputProps } = inputTextProps
  const [position, setPosition] = useState('absolute')
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
        <View style={styles.toolsIcon}>
          <Image style={styles.Icon} source={audio}></Image>
        </View>
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
