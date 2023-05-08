import { useRouter, useSegments } from 'expo-router'
import { useEffect, useContext, createContext, useState } from 'react'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { particleLogin } from '../api/auth'

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
    if (!user && rootSegment !== '(auth)/sign-in') {
      router.replace('(auth)/sign-in')
    }
  }, [user, rootSegment])
}

export function Provider(props) {
  const { getItem, setItem, removeItem } = useAsyncStorage('USER')
  const [user, setAuth] = useState(undefined)
  useEffect(() => {
    getItem().then(json => {
      if (json != null) {
        setAuth(JSON.parse(json))
      } else {
        setAuth(null)
      }
    })
  }, [])

  useProtectedRoute(user)

  return (
    <AuthContext.Provider
      value={{
        signIn: async value => {
          console.log({
            uuid: value.token,
            token: value.uuid,
          })
          const info = await particleLogin({
            uuid: value.token,
            token: value.uuid,
          })
          console.log(info)
          setAuth(info)
          setItem(JSON.stringify(info))
        },
        signOut: () => {
          setAuth(null)
          removeItem()
        },
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
