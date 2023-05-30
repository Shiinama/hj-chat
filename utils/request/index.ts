import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import useUserStore from '../../store/userStore'
import Constants from 'expo-constants'
import systemConfig from '../../constants/System'
import MSG_LIST from './message'
import debounce from 'lodash/debounce'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Toast } from '@fruits-chain/react-native-xiaoshu'
import { useRouter } from 'expo-router'
import { DeviceEventEmitter } from 'react-native'
import { HttpStatusCode } from '../../types/httpTypes'

export type RequestOptions = AxiosRequestConfig & {
  url: string
  query?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: any
}

const toastError = (msg: string) => {
  Toast({
    message: msg,
    duration: 1500,
  })
}
const errorTip = debounce(toastError, 500)

const { baseUrl, authKey, token } = systemConfig
const _axios = axios.create()
/**
 * 响应拦截器
 */
_axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // TODO fix it
    const result: { errCode: number; errMsg: string; data: unknown } = response.data
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
      return Promise.reject(data.message)
      // throw message;
    }
  }
)
// TODO: 添加options 类型interface
export default async function request<T>(options: RequestOptions) {
  const { url } = options
  const opt: RequestOptions = options
  delete opt.url

  const notNeedLogin = Constants.manifest.extra.isLogin
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
    validateStatus(status: number) {
      return status >= 200 && status < 300 // default
    },
  }
  const newOptions: RequestOptions = Object.assign({}, defaultOptions, options)
  newOptions.headers = {
    Authorization: Authorization ? Authorization : null,
    ...headers,
  }
  let newUrl = baseUrl + url
  console.log(newUrl)
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
    .then(data => data.data)
}
