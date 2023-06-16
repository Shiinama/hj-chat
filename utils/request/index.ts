import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import Constants from 'expo-constants'
import systemConfig from '../../constants/System'
import debounce from 'lodash/debounce'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Toast } from '@fruits-chain/react-native-xiaoshu'
import { Alert, DeviceEventEmitter } from 'react-native'
import { HttpStatusCode } from '../../types/httpTypes'

export type RequestOptions = AxiosRequestConfig & {
  url: string
  query?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: any
}

let pendingMap = new Map()

function getRequestKey<T>(config: AxiosRequestConfig<T>) {
  return config.method + config.url
}

function setPendingMap(config: AxiosRequestConfig) {
  const controller = new AbortController()
  config.signal = controller.signal
  const key = getRequestKey(config)
  if (pendingMap.has(key)) {
    pendingMap.get(key).abort()
    pendingMap.delete(key)
  } else {
    pendingMap.set(key, controller)
  }
}

const toastError = (msg: string) => {
  Toast({
    message: msg,
    duration: 1500,
  })
}
const errorTip = debounce(toastError, 500)

const { baseUrl, authKey, token } = systemConfig
const _axios: AxiosInstance = axios.create()
/**
 * 请求拦截器
 */
_axios.interceptors.request.use(
  config => {
    setPendingMap(config)
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
_axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const key = getRequestKey(response.config)
    pendingMap.delete(key)
    // TODO fix it
    const result: { errCode: number; errMsg: string } = response?.data
    // 图片上传简易判断
    if (!result.errCode) {
      return response
    }
    // 错误并提示
    if (result.errCode !== 200) {
      const errText = `${result.errMsg}`
      Toast({
        message: errText,
        duration: 2500,
      })
      console.log(errText)
      return Promise.reject(errText)
    }
    return response
  },
  error => {
    const { response } = error
    // 请求有响应
    if (response) {
      const { status, data, config } = response
      let msg = 'Unknown error, please try again later'
      if (status) {
        if (status < HttpStatusCode.Ok) {
          msg = `Network error, please try again later(${status})`
        } else if (status === HttpStatusCode.Ok) {
          msg = data?.message
        } else if (status > HttpStatusCode.Ok && status < HttpStatusCode.MultipleChoices) {
          msg = `Invalid server response(${status})`
        } else if (status === HttpStatusCode.BadRequest) {
          if (data?.message) {
            if (Array.isArray(data.message)) {
              msg = data.message.join('; ')
            } else {
              msg = data.message
            }
          } else {
            msg = `Bad request, please try again(${status})`
          }
        } else if (status === HttpStatusCode.Unauthorized) {
          msg = 'Not logged in or login timed out, please log in again.'
          if (!config?.noRedirectToLogin) {
            // TODO: remove identity info
            // eslint-disable-next-line react-hooks/rules-of-hooks
            DeviceEventEmitter.emit('logout', 'exit')
          }
        } else if (status > HttpStatusCode.BadRequest && status < HttpStatusCode.InternalServerError) {
          msg = `Not available or timeout(${status})`
        } else {
          msg = `Server error(${status})`
        }
      } else {
        msg = data.message || msg
      }
      errorTip(msg || data.message)
      return Promise.reject(error || data.message)
      // throw message;
    }
    if (error.code === 'ERR_NETWORK') {
      Alert.alert('Please check your network connection or server error')
    }
    return Promise.reject(error.code || error)
  }
)
// TODO: 添加options 类型interface
export default async function request<T>(options: RequestOptions) {
  const { url } = options
  const opt: RequestOptions = options
  delete opt.url

  const notNeedLogin = Constants.expoConfig.extra.isLogin
  let Authorization = ''
  if (notNeedLogin) {
    Authorization = `Bearer ${token}`
  } else {
    const token = await AsyncStorage.getItem(authKey)
    if (!token && url !== '/auth/particleLogin' && url !== '/auth/generateNonce' && url !== '/auth/verifySignature') {
      return
    }
    Authorization = token ? `Bearer ${token}` : ''
  }

  let headers = {}
  if (options) {
    headers = options.headers || {}
  }
  const defaultOptions = {
    credentials: 'include',
    timeout: 10000,
    withCredentials: true,
  }
  const newOptions: RequestOptions = Object.assign({}, defaultOptions, options)
  newOptions.headers = {
    Authorization: Authorization ? Authorization : null,
    ...headers,
  }
  let newUrl = baseUrl + url
  if (options.method.toLowerCase() == 'get' && options.query) {
    const urlParams = []
    Object.keys(options.query).map(key => {
      if (options.query[key] !== undefined) {
        urlParams.push(`${key}=${encodeURI(options.query[key])}`)
      }
    })

    if (urlParams.length > 0) {
      newUrl = `${newUrl}${newUrl.indexOf?.('?') > 0 && newUrl.indexOf?.('=') > 0 ? '&' : '?'}${urlParams.join('&')}`
    }
  }
  return _axios
    .request<T>({
      ...newOptions,
      url: newUrl,
    })
    .then(data => data?.data ?? data)
}
