import { Text, View, Image, TouchableOpacity } from 'react-native'

import { styles } from './style'
import facebookLogo from '../../assets/images/login/facebook_icon2.png'
import googleLogo from '../../assets/images/login/google_icon2.png'
import loginBgLogo from '../../assets/images/login/login_bg.png'
import loginLogo from '../../assets/images/login/login_logo.png'
import loginIos from '../../assets/images/login/login_ios.png'
import { Button, Toast } from '@fruits-chain/react-native-xiaoshu'
import { useAuth } from '../../context/auth'
import { SupportAuthType } from 'react-native-particle-auth'
import * as particleAuth from 'react-native-particle-auth'
import useUserStore from '../../store/userStore'
import { particleLogin } from '../../api/auth'
import * as WebBrowser from 'expo-web-browser'

export default function SignIn() {
  const { signIn } = useAuth()
  const login = async loginType => {
    const { close } = Toast.loading({ message: 'Loging', duration: 0 })
    const type = loginType
    const _supportAuthType = [
      SupportAuthType.Email,
      SupportAuthType.Google,
      SupportAuthType.Facebook,
      SupportAuthType.Apple,
    ]
    try {
      const result = await particleAuth.login(type, '', _supportAuthType as any, true)
      if (result.status) {
        const userInfo = result.data
        useUserStore.setState({ particleInfo: userInfo })
        const info = await particleLogin({
          uuid: userInfo.uuid,
          token: userInfo.token,
        })
        close()
        signIn(info)
      } else {
        close()
        const error = result.data
        Toast(error)
      }
    } catch (e) {
      close()
    } finally {
      close()
    }
  }

  return (
    <>
      <View style={styles.container}>
        <View>
          <Image source={loginBgLogo} style={{ height: 374, width: '100%' }}></Image>
        </View>
        <View style={styles.main}>
          <Image source={loginLogo} style={{ width: 110, height: 110 }}></Image>
          <Text style={styles.name}>MyShell</Text>
          <Text style={styles.detail}>The most advanced AI chatbot platform</Text>
        </View>
        <View style={styles.bottom}>
          <Button style={styles.emailButton} onPress={() => login('Email')}>
            <Text style={styles.emailText}>Continue with email</Text>
          </Button>

          <Text style={styles.emailDetail}>If you haven't registered before, we will help you create an account.</Text>
          <TouchableOpacity>
            <Text
              style={styles.service}
              onPress={e => {
                e.preventDefault()
                WebBrowser.openBrowserAsync('https://app.myshell.ai/privacy')
              }}
            >
              Term of Service
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 30 }}>
            <View style={styles.lineBackground}></View>
            <View style={styles.lineLeft}>
              <Text style={styles.orText}>or</Text>
            </View>
          </View>

          <View style={styles.googleAndFacebook}>
            <TouchableOpacity onPress={() => login('Google')}>
              <Image source={googleLogo} style={styles.google}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => login('Apple')}>
              <Image source={loginIos} style={styles.google}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => login('Facebook')}>
              <Image source={facebookLogo} style={styles.facebook}></Image>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}
