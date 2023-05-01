import { useEffect, useRef, useState } from 'react'
import {
  Keyboard,
  View,
  TextInput,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  Platform,
} from 'react-native'
import { StyleSheet } from 'react-native'
import { useCallbackOne } from 'use-memo-one'

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
        <TextInput
          returnKeyType="send"
          blurOnSubmit={false}
          // multiline={true}
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
      </View>
      {/* <View style={styles.accessory}></View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b2b2b2',
    backgroundColor: '#f5f5f5',
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  accessory: {
    height: 44,
  },
  textInput: {
    flex: 1,
    // marginLeft: 10,
    marginHorizontal: 28,
    // marginVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    // lineHeight: 16,
    height: Platform.select({
      ios: 30,
      android: 30,
      web: 34,
    }),
    marginTop: Platform.select({
      ios: 6,
      android: 0,
      web: 6,
    }),
    marginBottom: Platform.select({
      ios: 8,
      android: 8,
      web: 4,
    }),
  },
})

export default InputToolsTar
