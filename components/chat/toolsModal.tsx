import { forwardRef, useImperativeHandle, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../../constants/Colors'
import Clear from '../../assets/images/chat/clear.svg'
import Share from '../../assets/images/chat/share.svg'
import Pin from '../../assets/images/chat/pin.svg'
import Remove from '../../assets/images/chat/remove.svg'
import { getUserEnergsetBotPinnedStatusyInfo } from '../../api'
import { Toast, Notify } from '@fruits-chain/react-native-xiaoshu'
const ToolsModal = forwardRef(
  (
    props: {
      uid: string
    },
    ref
  ) => {
    const [opacity, setOpacity] = useState(0)
    useImperativeHandle(ref, () => ({
      setOpacity,
      opacity,
    }))
    return (
      <View
        style={{
          opacity: opacity,
          width: 200,
          // height: 150,
          zIndex: 99,
          position: 'absolute',
          left: 20,
          bottom: 82,
          justifyContent: 'center',
          borderRadius: 12,
          borderWidth: 3,
          borderColor: Colors.mainGrey,
          backgroundColor: Colors.mainWhite,
        }}
      >
        <TouchableOpacity
          style={styles.iconC}
          onPress={async () => {
            getUserEnergsetBotPinnedStatusyInfo({ botUid: props.uid, pinned: true })
            setOpacity(0)
          }}
        >
          <Pin></Pin>
          <Text style={{ marginLeft: 8, fontSize: 16 }}>pin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconC}>
          <Remove></Remove>
          <Text style={{ marginLeft: 8, fontSize: 16 }}>Remove from list</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconC}>
          <Clear></Clear>
          <Text style={{ marginLeft: 8, fontSize: 16 }}>Clear Memory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconC}>
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
