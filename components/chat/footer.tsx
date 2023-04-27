import { Text, View } from '../../components/Themed'
import { Button, TextInput } from '@fruits-chain/react-native-xiaoshu'
import { memo, useRef, useState } from 'react'
import { Keyboard } from 'react-native'
import styles from './styles'

type Props = {}

function FooterInput({ sendMessage, scrollToEnd }) {
  const [value, onChangeText] = useState('')
  const inputRef = useRef(null)
  return (
    <View style={styles.footer}>
      <TextInput
        autoFocus={false}
        ref={inputRef}
        returnKeyType="send"
        onSubmitEditing={() => {
          sendMessage(value)
          onChangeText('')
        }}
        onFocus={scrollToEnd}
        style={styles.input}
        value={value}
        onChangeText={text => onChangeText(text)}
      />
      {/* <Button
        style={styles.sendBtn}
        textColor="black"
        onPress={async () => {
          sendMessage(value)
          onChangeText('')
        }}
      >
        发送
      </Button> */}
      {/* <Button onPress={() => joinRoom('group1')}>加入房间</Button> */}
    </View>
  )
}

export default memo(FooterInput)
