import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../../constants/Colors'
import Clear from '../../assets/images/chat/clear.svg'
import Share from '../../assets/images/chat/share.svg'
import Pin from '../../assets/images/chat/pin.svg'
import Remove from '../../assets/images/chat/remove.svg'
import { Toast, Popup } from '@fruits-chain/react-native-xiaoshu'
import { removeBotFromChatList, resetHistory, setBotPinnedStatus } from '../../api'
const ToolsModal = forwardRef(({ uid, setVisible, userId }: { uid: string; setVisible; userId: number }, ref) => {
  console.log(userId, 123123)
  const [popUpShow, setPopUpShow] = useState(false)
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
              setVisible(false)
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
              setVisible(false)
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
          setVisible(false)
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
          setPopUpShow(true)
        }}
      >
        <Share></Share>
        <Text style={{ marginLeft: 8, fontSize: 16 }}>Share Chat Records</Text>
      </TouchableOpacity>
      <Popup
        visible={popUpShow}
        position={'bottom'}
        overlay={false}
        onPressOverlay={() => {
          setPopUpShow(false)
        }}
        round
      >
        <View style={{ height: 200, width: 200, backgroundColor: 'black' }}></View>
      </Popup>
    </View>
  )
})

const styles = StyleSheet.create({
  iconC: {
    padding: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
})

export default ToolsModal
