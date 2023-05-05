import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../../constants/Colors'
import Clear from '../../assets/images/chat/clear.svg'
import Share from '../../assets/images/chat/share.svg'
import Pin from '../../assets/images/chat/pin.svg'
import Remove from '../../assets/images/chat/remove.svg'
import { Toast } from '@fruits-chain/react-native-xiaoshu'
import { removeBotFromChatList, resetHistory, setBotPinnedStatus } from '../../api'
export type ActionType = 'ClearMemory' | 'ShareChatRecords'
const ToolsModal = forwardRef(
  ({ uid, onAction, userId }: { uid: string; onAction: (key: ActionType) => void; userId: number }, ref) => {
    return (
      <View
        style={{
          width: 200,
          justifyContent: 'center',
          borderRadius: 12,
          borderColor: Colors.mainGrey,
          backgroundColor: Colors.mainWhite,
        }}
      >
        {userId && (
          <>
            <TouchableOpacity
              style={styles.iconC}
              onPress={async () => {
                const { close } = Toast.loading('Pinned')
                setBotPinnedStatus({ botUid: uid, pinned: true }).then(() => {
                  close()
                })
              }}
            >
              <Pin></Pin>
              <Text style={{ marginLeft: 8, fontSize: 16 }}>pin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconC}
              onPress={async () => {
                const { close } = Toast.loading('Move...')
                removeBotFromChatList({ botUid: uid }).then(() => {
                  close()
                })
              }}
            >
              <Remove></Remove>
              <Text style={{ marginLeft: 8, fontSize: 16 }}>Remove from list</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.iconC}
          onPress={async () => {
            const { close } = Toast.loading('Clear Contenxt')
            resetHistory({ botUid: uid }).then(() => {
              close()
            })
          }}
        >
          <Clear></Clear>
          <Text style={{ marginLeft: 8, fontSize: 16 }}>Clear Memory</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconC}
          onPress={() => {
            onAction('ShareChatRecords')
          }}
        >
          <Share></Share>
          <Text style={{ marginLeft: 8, fontSize: 16 }}>Share Chat Records</Text>
        </TouchableOpacity>
      </View>
    )
  }
)

const styles = StyleSheet.create({
  iconC: {
    padding: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
})

export default ToolsModal
