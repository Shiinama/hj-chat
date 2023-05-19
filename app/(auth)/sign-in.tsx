import { useState, useEffect } from 'react'
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
} from 'react-native'

import { styles } from './style'
import userLogo from '../../assets/images/login_icon.png'
import walletLogo from '../../assets/images/wallet_icon.png'
import facebookLogo from '../../assets/images/facebook_icon.png'
import googleLogo from '../../assets/images/google_icon.png'
import { Button, TextInput, Toast } from '@fruits-chain/react-native-xiaoshu'
import { useAuth } from '../../context/auth'
import { ChainInfo, LoginType, SupportAuthType, iOSModalPresentStyle, Env } from 'react-native-particle-auth'
import * as particleAuth from 'react-native-particle-auth'
import useUserStore from '../../store/userStore'
import { useWeb3Modal, Web3Button, Web3Modal } from '@web3modal/react-native'
import Clipboard from '@react-native-clipboard/clipboard'

// import { createWeb3 } from '../../tmp/web3Demo'
import { particleLogin } from '../../api/auth'
// const web3 = createWeb3('c135c555-a871-4ec2-ac8c-5209ded4bfd1', 'clAJtavacSBZtWHNVrxYA8aXXk4dgO7azAMTd0eI')

export default function SignIn() {
  const providerMetadata = {
    name: 'React Native V2 dApp',
    description: 'RN dApp by WalletConnect',
    url: 'https://walletconnect.com/',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  }
  const sessionParams = {
    namespaces: {
      eip155: {
        methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
        chains: ['eip155:1'],
        events: ['chainChanged', 'accountsChanged'],
        rpcMap: {},
      },
    },
  }

  const [clientId, setClientId] = useState<string>()
  const { isConnected, provider } = useWeb3Modal()
  const { signIn } = useAuth()
  const login = async loginType => {
    const type = loginType
    const _supportAuthType = [SupportAuthType.Email, SupportAuthType.Google, SupportAuthType.Facebook]
    const result = await particleAuth.login(type, '', _supportAuthType as any, true)
    if (result.status) {
      const userInfo = result.data
      useUserStore.setState({ particleInfo: userInfo })
      const info = await particleLogin({
        uuid: userInfo.uuid,
        token: userInfo.token,
      })

      signIn(info)
    } else {
      const error = result.data
      Toast(error)
    }
  }
  const onCopy = (value: string) => {
    Clipboard.setString(value)
    Alert.alert('Copied to clipboard')
  }

  useEffect(() => {
    async function getClientId() {
      if (provider && isConnected) {
        const _clientId = await provider?.client?.core.crypto.getClientId()
        setClientId(_clientId)
      } else {
        setClientId(undefined)
      }
    }
    getClientId()
  }, [isConnected, provider])

  return (
    <>
      <ScrollView style={styles.main}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Image
              source={userLogo}
              style={{
                width: 150,
                height: 150,
              }}
            />
            <View>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 20,
                  lineHeight: 30,
                  textAlign: 'center',
                  color: '#000000',
                }}
              >
                The most advanced AI chatbot platform
              </Text>
            </View>

            <View style={{ marginTop: 30, width: '80%' }}>
              <View style={{ backgroundColor: '#cccccc', height: 0.5 }}></View>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  width: 108,
                  marginTop: -8,
                  marginHorizontal: 90,
                }}
              >
                <Text
                  style={{
                    color: '#cccccc',
                    fontSize: 12,
                    textAlign: 'center',
                  }}
                >
                  connect using
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: 25,
                display: 'flex',
                flexDirection: 'row',
                width: '80%',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity
                onPress={() => login('Facebook')}
                style={{
                  width: '48%',
                  borderColor: '#000000',
                  borderWidth: 1,
                  borderRadius: 20,
                  height: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image source={facebookLogo} style={{ width: 24, height: 24 }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => login('Google')}
                style={{
                  width: '48%',
                  borderColor: '#000000',
                  borderWidth: 1,
                  borderRadius: 20,
                  height: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image source={googleLogo} style={{ width: 24, height: 24 }}></Image>
              </TouchableOpacity>
            </View>

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
                onPress={() => login('Email')}
              >
                <Text style={{ color: 'black', fontSize: 18, fontWeight: '500' }}>Email Login</Text>
              </Button>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'center',
              }}
            >
              <Web3Button
                style={{
                  width: 200,
                }}
              ></Web3Button>
              <Web3Modal
                projectId={'c92c0eff30f8f19ef515ef7a86200fd7'}
                providerMetadata={providerMetadata}
                sessionParams={sessionParams}
                onCopyClipboard={onCopy}
              />
            </View>

            <View style={{ width: '80%', marginTop: 20 }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  color: '#aaaaaa',
                  lineHeight: 20,
                }}
              >
                If you haven't registered before, we will help you create an account.
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      {/* <Shim /> */}
    </>
  )
}
