import { KeyboardAvoidingView, View } from 'react-native'
import { LegacyRef, useEffect, useState } from 'react'
import MessagesContainer from './messagesContainer'
import InputToolsTar from './inputToolsTar'
import type { FlatList, StyleProp, TextInput, ViewStyle } from 'react-native'
export interface FishChatProps {
  inputTextProps: TextInput['props']
  flatListProps: FlatList['props']
  InputToolBarHeight?: number
  messagesContainerStyle?: StyleProp<ViewStyle>
  flatListRef?: LegacyRef<FlatList>
}

//  一个自定义距离偏移距离
const bottomOffset = 1
function Container({
  messagesContainerStyle,
  inputTextProps,
  flatListRef,
  flatListProps,
  ...restProps
}: FishChatProps): JSX.Element {
  const [maxHeight, setMaxHeight] = useState(0)
  const [inputHeight, setInputHeight] = useState(32)
  const [barHeight, setBarHeight] = useState(0)
  // 工具栏高度
  const [minInputToolbarHeight, setMinInputToolbarHeight] = useState(0)
  const [messagesContainerHeight, setMessagesContainerHeight] = useState(0)
  const [boardHeight, setBoardHeight] = useState(0)

  const onInitialLayoutViewLayout = (e: any) => {
    const { layout } = e.nativeEvent
    if (layout.height <= 0) {
      return
    }
    setMaxHeight(layout.height)
  }

  const onKeyboardWillShow = (e: any) => {
    const keyboardHeight = e.endCoordinates ? e.endCoordinates.height : e.end.height
    setBoardHeight(keyboardHeight)
  }

  const onKeyboardWillHide = () => {
    setBoardHeight(0)
  }
  useEffect(() => {
    setMinInputToolbarHeight(32 + inputHeight)
    setMessagesContainerHeight(maxHeight - barHeight - boardHeight)
  }, [inputHeight, maxHeight, boardHeight, barHeight])
  const InternalProps = {
    onKeyboardWillShow,
    onKeyboardWillHide,
  }
  console.log('re-render:Container')
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1 }} onLayout={onInitialLayoutViewLayout}>
        <KeyboardAvoidingView enabled>
          {/* message容器 */}
          <View>
            <MessagesContainer
              flatListRef={flatListRef}
              flatListProps={flatListProps}
              InternalProps={InternalProps}
              messagesContainerStyle={messagesContainerStyle}
              messagesContainerHeight={messagesContainerHeight}
            ></MessagesContainer>
          </View>
        </KeyboardAvoidingView>
        {/* inputToolbar下方输入框工具栏容器 */}
        <InputToolsTar
          inputHeight={inputHeight}
          barHeight={barHeight}
          setBarHeight={setBarHeight}
          setInputHeight={setInputHeight}
          inputTextProps={inputTextProps as any}
          minInputToolbarHeight={restProps.InputToolBarHeight || minInputToolbarHeight}
        ></InputToolsTar>
      </View>
    </View>
  )
}

export default Container
