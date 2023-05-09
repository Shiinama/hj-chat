import { forwardRef, useMemo } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import Clear from '../../assets/images/chat/clear.svg'
import Share from '../../assets/images/chat/share.svg'
import Pin from '../../assets/images/chat/pin.svg'
import Remove from '../../assets/images/chat/remove.svg'

export type ActionType = 'ClearMemory' | 'ShareChatRecords' | 'Pin' | 'RemoveFromList'

const ToolsModal = forwardRef(
  (
    {
      userId,
      toolsAction,
      pinned,
      closePopover,
    }: {
      userId: number
      pinned: boolean
      toolsAction: (val: ActionType) => void
      closePopover?: () => void
    },
    ref
  ) => {
    const actionList = useMemo(() => {
      return [
        ...(userId
          ? [
              { name: pinned ? 'Unpin' : 'Pin', icon: <Pin />, key: 'Pin' },
              {
                name: 'Remove from list',
                icon: <Remove />,
                key: 'RemoveFromList',
              },
            ]
          : []),

        { name: 'Clear Memory', icon: <Clear />, key: 'ClearMemory' },
        {
          name: 'Share Chat Records',
          icon: <Share />,
          key: 'ShareChatRecords',
        },
      ]
    }, [userId])
    return (
      <View
        style={{
          width: '100%',
        }}
      >
        <View style={styles.popupBody}>
          {actionList?.map(v => {
            return (
              <TouchableOpacity
                onPress={() => {
                  toolsAction(v?.key as ActionType)
                  closePopover()
                }}
                style={styles.iconC}
              >
                <View style={{ flexDirection: 'row' }}>
                  {v.icon}
                  <Text style={{ marginLeft: 4, fontSize: 16 }}>{v?.name}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={{ height: 22 }} />
      </View>
    )
  }
)

const styles = StyleSheet.create({
  iconC: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginBottom: 5,
  },
  popupBody: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    borderColor: '#EDEDED',
    borderWidth: 1,
    padding: 8,
  },
})

export default ToolsModal
