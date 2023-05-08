import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useSearchParams, useNavigation } from 'expo-router'
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  Keyboard,
  TouchableWithoutFeedback,
  Touchable,
  Pressable,
  TouchableOpacity,
  ScrollView,
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

import { createWeb3 } from '../../tmp/web3Demo'
import Shim from '../../components/full-image/shim'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const web3 = createWeb3('c135c555-a871-4ec2-ac8c-5209ded4bfd1', 'clAJtavacSBZtWHNVrxYA8aXXk4dgO7azAMTd0eI')

type ListDataItem = {
  id: number
  uid: string
  name: string
  description: string
  userId: number
  logo: string
  language: string
  pinned: boolean
  lastInteractionDate: string
}

export default function SignIn() {
  const navigation = useNavigation()
  const { name } = useSearchParams()
  const { signIn } = useAuth()
  const login = async loginType => {
    const type = loginType
    const _supportAuthType = [SupportAuthType.Email, SupportAuthType.Google, SupportAuthType.Facebook]
    const result = await particleAuth.login(type, '', _supportAuthType, undefined)
    if (result.status) {
      const userInfo = result.data
      signIn(userInfo)
    } else {
      const error = result.data
      Toast(error)
    }
  }

  // const chainInfo = ChainInfo.EthereumGoerli;
  // const env = Env.Production;
  // particleAuth.init(chainInfo, env);

  // useEffect(() => {
  //   navigation.setOptions({
  //     title: 'Login',
  //   })
  // }, [navigation, name])

  function walletClick() {}

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
              <Text style={{ fontWeight: '600', fontSize: 20, lineHeight: 30, textAlign: 'center', color: '#000000' }}>
                The most advanced AI chatbot platform
              </Text>
            </View>

            <TouchableHighlight
              onPress={walletClick}
              style={{
                marginTop: 20,
                borderColor: '#000000',
                borderWidth: 1,
                borderRadius: 20,
                height: 35,
                width: '80%',
              }}
            >
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={walletLogo} style={{ width: 40, height: 32 }}></Image>
                <Text style={{ fontWeight: '600', fontSize: 18, marginHorizontal: 10 }}>Wallet Connect</Text>
              </View>
            </TouchableHighlight>

            <View style={{ marginTop: 30, width: '80%' }}>
              <View style={{ backgroundColor: '#cccccc', height: 0.5 }}></View>
              <View style={{ backgroundColor: '#ffffff', width: 108, marginTop: -8, marginHorizontal: 90 }}>
                <Text style={{ color: '#cccccc', fontSize: 12, textAlign: 'center' }}>Or connect using</Text>
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
                height: 35,
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 20,
                width: '80%',
              }}
            >
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#cccccc"
                style={{ paddingLeft: 20 }}
              ></TextInput>
              <Button color="#f8fafc" text="Send" textColor="gray" style={{ marginEnd: 20, height: 30 }}></Button>
            </View>

            <View style={{ width: '80%', marginTop: 20 }}>
              <Text style={{ textAlign: 'center', fontSize: 15, color: '#aaaaaa', lineHeight: 20 }}>
                If you haven't registered before, we will help you create an account.
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <Shim />
    </>
  )
}
