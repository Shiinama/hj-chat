import { View, Text } from 'react-native'
import Flash from '../assets/images/tabbar/flash.svg'

export default function FlashIcon({ energyPerChat, showText = true }) {
  return (
    <View
      style={{
        // paddingVertical: 2,
        marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 2,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#EDEDED',
      }}
    >
      <Flash width={18} height={18}></Flash>
      {showText && <Text style={{ fontSize: 16, fontWeight: '400', marginRight: 5 }}>{energyPerChat}</Text>}
    </View>
  )
}
