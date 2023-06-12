import { useRouter, useSegments } from 'expo-router'
import { useEffect, useContext, createContext, useState } from 'react'
import useUserStore from '../store/userStore'
import Constants from 'expo-constants'
import Clipboard from '@react-native-clipboard/clipboard'
import SocketStreamManager from '../components/chat/socketManager'
const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function useProtectedRoute(user) {
  const rootSegment = useSegments()[0]
  const router = useRouter()
  useEffect(() => {
    if (user === undefined) {
      return
    }
    const notNeedLogin = Constants.manifest.extra.isLogin
    if (!notNeedLogin) {
      if (!user && rootSegment !== '(auth)/sign-in') {
        router.replace('(auth)/sign-in')
      }
    }
  }, [user, rootSegment])
}

export function Provider(props) {
  const router = useRouter()
  const [user, setAuth] = useState(undefined)
  useEffect(() => {
    const userInfo = useUserStore.getState()?.userBaseInfo
    if (userInfo != null) {
      setAuth(userInfo)
      Clipboard.getString().then(res => {
        const regex = /(?:bot\/)([a-zA-Z0-9_-]+)/
        const [, botId] = res.match(regex) ?? []
        if (botId) {
          router.push({
            pathname: `robot/${botId}`,
          })
        }
      })
    } else {
      setAuth(null)
    }
  }, [])

  useProtectedRoute(user)

  return (
    <AuthContext.Provider
      value={{
        signIn: async value => {
          setAuth(value)
          useUserStore.setState({ userBaseInfo: value })
          // 有了UserInfo之后再去初始化socket
          SocketStreamManager()
          router.replace('(tabs)')
        },
        signOut: async () => {
          setAuth(null)
          useUserStore.setState({
            userBaseInfo: null,
            profile: null,
            userEnergyInfo: null,
            userConnectedAccounts: null,
            particleInfo: null,
          })
        },
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
