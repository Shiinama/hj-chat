import { Button } from '@fruits-chain/react-native-xiaoshu'
import { memo, useEffect, useRef, useState } from 'react'
import { Keyboard, TouchableWithoutFeedback, View, TextInput, Text } from 'react-native'
import styles from './styles'

type Props = {}

function FooterInput({ sendMessage, scrollToEnd }) {
  const [value, onChangeText] = useState('')
  const inputRef = useRef(null)
  // useEffect(() => {
  //   const a = Keyboard.addListener('keyboardDidShow', () => {
  //     scrollToEnd()
  //   })
  //   return () => {
  //     a.remove()
  //   }
  // }, [])
  return (
    <View style={styles.footer}>
      <TextInput
        autoFocus={false}
        ref={inputRef}
        enablesReturnKeyAutomatically={value.length === 0}
        blurOnSubmit={false}
        returnKeyType="send"
        onSubmitEditing={() => {
          sendMessage(value)
          onChangeText('')
        }}
        style={styles.input}
        value={value}
        onChangeText={text => onChangeText(text)}
      />
    </View>
  )
}

export default FooterInput
