import { useRouter, useSegments } from 'expo-router'
import { useEffect, useContext, createContext, useState } from 'react'
import useUserStore from '../store/userStore'
import * as particleAuth from 'react-native-particle-auth'
import Constants from 'expo-constants'
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
          router.replace('(tabs)')
        },
        signOut: async () => {
          const result = await particleAuth.logout()
          if (result.status) {
            console.log(result.data)
            setAuth(null)
            useUserStore.setState({ userBaseInfo: null })
          } else {
            const error = result.data
            console.log(error)
          }
        },
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
