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

const { baseUrl, authKey } = systemConfig
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
      if (status === 401) {
        DeviceEventEmitter.emit('logout', 'exit')

        // 状态码为401时，根据白名单来判断跳转与否
        errorTip(data.message || '')
        // router.replace('(auth)/login')
        return Promise.reject(new Error(data.message))
      }
      // 404 502 ..
      errorTip(data.message || '')
      return Promise.reject(data.message)
      // throw message;
    }
    // 请求超时
    if (error.code === 'ECONNABORTED') {
      const timeoutMsg = MSG_LIST.timeout
      return Promise.reject(timeoutMsg)
    }
    return Promise.reject(MSG_LIST.network)
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
    Authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeVNoZWxsVGVzdCIsInN1YiI6MzA2LCJhdWQiOiJNeVNoZWxsVGVzdCIsIm5iZiI6MCwiaWF0IjoxNjg0MTQyMzI3NjM1LCJqdGkiOiIyNzg5YWFhZjBiODY0YzI5YjA4NjlhY2I5NDZmNzlmNyIsInNlY3VyaXR5U3RhbXAiOiI1NGMwYWY2Mzk5NTQ0M2EzYjViNGU0MzU4MGNhYjU3NSIsImV4cCI6MTY4NDE0NDkxOTYzNX0.2WHYOm1V3LZ0CvZcjr-fnmOQNALR45ZV0yym3THVxGY'
  } else {
    const token = await AsyncStorage.getItem(authKey)
    if (!token && url !== '/auth/particleLogin') {
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
