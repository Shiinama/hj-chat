import { LegacyRef, memo, useCallback, useRef } from 'react'
import { View, StyleSheet, FlatList, StyleProp, ViewStyle } from 'react-native'
import Message from './message'

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    backgroundColor: '#FFFFFF',
  },
  containerAlignTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
  },
  emptyChatContainer: {
    flex: 1,
    transform: [{ scaleY: -1 }],
  },
  headerWrapper: {
    flex: 1,
  },
  listStyle: {
    // paddingTop: 20,
    // flex: 1,
  },
  scrollToBottomStyle: {
    opacity: 0.8,
    position: 'absolute',
    right: 10,
    bottom: 30,
    zIndex: 999,
    height: 40,
    width: 40,
    borderRadius: 20,
    // backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: Color.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
  },
})
type MessagesContainerProps = {
  messagesContainerHeight: number
  messagesContainerStyle: StyleProp<ViewStyle>
  InternalProps: {
    onKeyboardWillShow: (e: any) => void
    onKeyboardWillHide: (e: any) => void
  }
  flatListProps: FlatList['props']
  flatListRef: LegacyRef<FlatList> | undefined
}

function MessagesContainer(props: MessagesContainerProps) {
  const { InternalProps, flatListProps, messagesContainerHeight, messagesContainerStyle } = props
  const { data, renderItem: propsRenderItem, ...flatRest } = flatListProps

  // fix 手动颠倒顺序滚动位置无法精准的问题以及其他滚动问题 FlatList设置了inverted(倒置，往上滑就是加载更多了 上变为下，数据也是一样)就无需排序和调用scrollEnd了
  // const scrollToEnd = useCallback(() => {
  //   flatListRef?.current?.scrollToEnd({ animated: true })
  // }, [])
  // const onLayoutList = () => {
  //   // 因为有可能太快了还没渲染完（薛定谔的渲染？）就开始滚，会滚不到最下面去，所以这里延迟一下，暂时没有特别好的方案
  //   if (data?.length) {
  //     setTimeout(() => {
  //       scrollToEnd()
  //     }, data?.length * 5)
  //   }
  // }
  const renderItem = ({ item, index, separators }: { item: any; index: number; separators: any }) => {
    if (propsRenderItem) {
      return propsRenderItem({ item, index, separators })
    }
    return <Message></Message>
  }
  return (
    <View
      style={[
        {
          height: messagesContainerHeight,
        },
        messagesContainerStyle,
      ]}
    >
      <View style={styles.container}>
        <FlatList
          initialNumToRender={5}
          ref={props.flatListRef}
          keyExtractor={item => item.uid}
          data={data.length ? data : [{ uid: '1231' }]}
          // onLayout={onLayoutList}
          style={styles.listStyle}
          renderItem={renderItem}
          // onContentSizeChange={scrollToEnd}
          contentContainerStyle={styles.contentContainerStyle}
          keyboardDismissMode="on-drag"
          {...InternalProps}
          {...flatRest}
        ></FlatList>
      </View>
    </View>
  )
}

export default memo(MessagesContainer)
