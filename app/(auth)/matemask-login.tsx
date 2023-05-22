import {
  Text,
  View,
  Image,
  TouchableHighlight,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native'
import React from 'react'
import MetaMaskSDK from '@metamask/sdk'
import BackgroundTimer from 'react-native-background-timer'
import { useAuth } from '../../context/auth'
import { generateNonce, particleLogin, verifySignature } from '../../api/auth'
import { Button, TextInput, Toast } from '@fruits-chain/react-native-xiaoshu'

export function MateMaskView() {
  const { signIn } = useAuth()

  const sdk = new MetaMaskSDK({
    openDeeplink: link => {
      Linking.openURL(link)
    },
    timer: BackgroundTimer,
    dappMetadata: {
      name: 'React Native Test Dapp',
      url: 'app-test.myshell.ai',
    },
  })

  const ethereum = sdk.getProvider()

  const connect = async () => {
    try {
      const result = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log(result)
      /// public address
      const address = result?.[0]
      console.log('public address = ' + address)
      generateNonce({
        publicAddress: address,
      }).then(msg => {
        setTimeout(() => {
          console.log('msg.nonce = ' + msg.nonce)
          sign(msg.nonce)
        }, 100)
      })
    } catch (e) {
      console.log('public address have error = ' + e)
    }
  }

  const sign = async msg => {
    var address = ethereum.selectedAddress
    console.log('address = ' + address)
    var params = [address, msg]
    var method = 'personal_sign'
    /// 签名
    const signature = await ethereum.request({ method, params })
    console.log('签名', signature)
    verifySignature({
      invitationCode: '',
      publicAddress: address,
      signature: signature,
    }).then(res => {
      const info = res
      signIn(info)
    })
  }

  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'center',
        }}
      >
        <Button
          style={{
            width: 200,
            borderRadius: 20,
            borderColor: '#000000',
            borderWidth: 1,
            backgroundColor: 'white',
          }}
          onPress={() => connect()}
        >
          <Text style={{ color: 'black', fontSize: 18, fontWeight: '500' }}>MetaMask</Text>
        </Button>
      </View>
    </>
  )
}
