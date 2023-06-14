import { Text, View, Image, TouchableOpacity } from 'react-native'

import { styles } from './style'
import facebookLogo from '../../assets/images/login/facebook_icon2.png'
import googleLogo from '../../assets/images/login/google_icon2.png'
import loginBgLogo from '../../assets/images/login/login_bg.png'
import loginLogo from '../../assets/images/login/login_logo.png'
import { Button, Toast } from '@fruits-chain/react-native-xiaoshu'
import { useAuth } from '../../context/auth'
import { SupportAuthType } from 'react-native-particle-auth'
import * as particleAuth from 'react-native-particle-auth'
import useUserStore from '../../store/userStore'
import { particleLogin } from '../../api/auth'

export default function SignIn() {
  const { signIn } = useAuth()
  const login = async loginType => {
    const { close } = Toast.loading({ message: 'Loging', duration: 0 })
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
      close()
      signIn(info)
    } else {
      close()
      const error = result.data
      Toast(error)
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
            <TouchableOpacity onPress={() => login('Facebook')}>
              <Image source={facebookLogo} style={styles.facebook}></Image>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )

  // return (
  //   <>
  //     <ScrollView style={styles.main}>
  //       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  //         <View style={styles.container}>
  //           <Image
  //             source={userLogo}
  //             style={{
  //               width: 150,
  //               height: 150,
  //             }}
  //           />
  //           <View>
  //             <Text
  //               style={{
  //                 fontWeight: '600',
  //                 fontSize: 20,
  //                 lineHeight: 30,
  //                 textAlign: 'center',
  //                 color: '#000000',
  //               }}
  //             >
  //               The most advanced AI chatbot platform
  //             </Text>
  //           </View>

  //           <View style={{ marginTop: 30, width: '80%' }}>
  //             <View style={{ backgroundColor: '#cccccc', height: 0.5 }}></View>
  //             <View
  //               style={{
  //                 backgroundColor: '#ffffff',
  //                 width: 108,
  //                 marginTop: -8,
  //                 marginHorizontal: 90,
  //               }}
  //             >
  //               <Text
  //                 style={{
  //                   color: '#cccccc',
  //                   fontSize: 12,
  //                   textAlign: 'center',
  //                 }}
  //               >
  //                 connect using
  //               </Text>
  //             </View>
  //           </View>

  //           <View
  //             style={{
  //               marginTop: 25,
  //               display: 'flex',
  //               flexDirection: 'row',
  //               width: '80%',
  //               justifyContent: 'space-between',
  //             }}
  //           >
  //             <TouchableOpacity
  //               onPress={() => login('Facebook')}
  //               style={{
  //                 width: '48%',
  //                 borderColor: '#000000',
  //                 borderWidth: 1,
  //                 borderRadius: 20,
  //                 height: 35,
  //                 alignItems: 'center',
  //                 justifyContent: 'center',
  //               }}
  //             >
  //               <Image source={facebookLogo} style={{ width: 24, height: 24 }}></Image>
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               onPress={() => login('Google')}
  //               style={{
  //                 width: '48%',
  //                 borderColor: '#000000',
  //                 borderWidth: 1,
  //                 borderRadius: 20,
  //                 height: 35,
  //                 alignItems: 'center',
  //                 justifyContent: 'center',
  //               }}
  //             >
  //               <Image source={googleLogo} style={{ width: 24, height: 24 }}></Image>
  //             </TouchableOpacity>
  //           </View>

  //           <View
  //             style={{
  //               display: 'flex',
  //               flexDirection: 'row',
  //               marginTop: 20,
  //               justifyContent: 'center',
  //             }}
  //           >
  //             <Button
  //               style={{
  //                 width: 200,
  //                 borderRadius: 20,
  //                 borderColor: '#000000',
  //                 borderWidth: 1,
  //                 backgroundColor: 'white',
  //               }}
  //               onPress={() => login('Email')}
  //             >
  //               <Text style={{ color: 'black', fontSize: 18, fontWeight: '500' }}>Email Login</Text>
  //             </Button>
  //           </View>

  //           {/* <MateMaskView></MateMaskView> */}

  //           {/* <WallectConnectView /> */}

  //           <View style={{ width: '80%', marginTop: 20 }}>
  //             <Text
  //               style={{
  //                 textAlign: 'center',
  //                 fontSize: 15,
  //                 color: '#aaaaaa',
  //                 lineHeight: 20,
  //               }}
  //             >
  //               If you haven't registered before, we will help you create an account.
  //             </Text>
  //           </View>
  //         </View>
  //       </TouchableWithoutFeedback>
  //     </ScrollView>
  //     {/* <Shim /> */}
  //   </>
  // )
}
