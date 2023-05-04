import { forwardRef, useImperativeHandle, useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'
import Clear from '../../assets/images/chat/clear.svg'
import Share from '../../assets/images/chat/share.svg'
import Pin from '../../assets/images/chat/pin.svg'
import Remove from '../../assets/images/chat/remove.svg'
const ToolsModal = forwardRef((props, ref) => {
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
        height: 150,
        zIndex: 99,
        position: 'absolute',
        left: 0,
        bottom: 55,
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 3,
        borderColor: Colors.mainGrey,
        backgroundColor: Colors.mainWhite,
      }}
    >
      <View style={styles.iconC}>
        <Pin></Pin>
        <Text style={{ marginLeft: 8, fontSize: 16 }}>pin</Text>
      </View>
      <View style={styles.iconC}>
        <Remove></Remove>
        <Text style={{ marginLeft: 8, fontSize: 16 }}>Remove from list</Text>
      </View>
      <View style={styles.iconC}>
        <Clear></Clear>
        <Text style={{ marginLeft: 8, fontSize: 16 }}>Clear Memory</Text>
      </View>
      <View style={styles.iconC}>
        <Share></Share>
        <Text style={{ marginLeft: 8, fontSize: 16 }}>Share Chat Records</Text>
      </View>
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
