import { KeyboardAvoidingView, View } from 'react-native'
import { LegacyRef, useState } from 'react'
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
// 工具栏高度
const minInputToolbarHeight = 80

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
  const [messagesContainerHeight, setMessagesContainerHeight] = useState(0)

  const getBasicMessagesContainerHeight = (layoutHeight: number) => {
    return layoutHeight - minInputToolbarHeight
  }
  const getMessagesContainerHeightWithKeyboard = (layoutHeight: number, keyboardHeight: number) => {
    return getBasicMessagesContainerHeight(layoutHeight) - keyboardHeight + bottomOffset
  }
  const onInitialLayoutViewLayout = (e: any) => {
    const { layout } = e.nativeEvent
    if (layout.height <= 0) {
      return
    }
    setMaxHeight(layout.height)
    const newMessagesContainerHeight = getBasicMessagesContainerHeight(layout.height)
    setMessagesContainerHeight(newMessagesContainerHeight)
  }

  const onKeyboardWillShow = (e: any) => {
    const keyboardHeight = e.endCoordinates ? e.endCoordinates.height : e.end.height
    const newMessagesContainerHeight = getMessagesContainerHeightWithKeyboard(maxHeight, keyboardHeight)
    setMessagesContainerHeight(newMessagesContainerHeight)
  }
  const onKeyboardWillHide = () => {
    const newMessagesContainerHeight = getBasicMessagesContainerHeight(maxHeight)
    setMessagesContainerHeight(newMessagesContainerHeight)
  }

  const InternalProps = {
    onKeyboardWillShow,
    onKeyboardWillHide,
  }
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
          inputTextProps={inputTextProps as any}
          minInputToolbarHeight={restProps.InputToolBarHeight || minInputToolbarHeight}
        ></InputToolsTar>
      </View>
    </View>
  )
}

export default Container
