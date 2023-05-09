import { Toast } from '@fruits-chain/react-native-xiaoshu'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import useUserStore from '../../store/userStore'

import systemConfig from '../../constants/System'
import MSG_LIST from './message'
import debounce from 'lodash/debounce'
export type RequestOptions = AxiosRequestConfig & {
  url: string
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
    console.log(error, 'error')
    const { response } = error
    // 请求有响应
    if (response) {
      const { status, data, config } = response
      if (status === 401) {
        // 状态码为401时，根据白名单来判断跳转与否
        errorTip(data.message || '')
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
  // const token = useUserStore.getState().userBaseInfo?.token
  // if (!token && url !== '/auth/particleLogin') {
  //   return
  // }
  // const Authorization = token ? `Bearer ${token}` : ''
  const Authorization =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeVNoZWxsVGVzdCIsInN1YiI6MzA2LCJhdWQiOiJNeVNoZWxsVGVzdCIsIm5iZiI6MCwiaWF0IjoxNjgzMzM5OTY1MDczLCJqdGkiOiI2MTc1ZDNhMmNjYmE0NWFjYTc2NDc0MDhmYzY1MjllZiIsInNlY3VyaXR5U3RhbXAiOiI1NGMwYWY2Mzk5NTQ0M2EzYjViNGU0MzU4MGNhYjU3NSIsImV4cCI6MTY4MzM0MjU1NzA3M30.C79OLS9eWvDLiEv9ZqDbeoDmJs7AhmnrijHnAnunzx8'
  let headers = {}
  if (options) {
    headers = options.headers || {}
  }
  const defaultOptions = {
    headers: {
      Authorization: Authorization ? Authorization : null,
      appversioncode: 3,
      ...headers,
    },
    credentials: 'include',
    timeout: 10000,
    withCredentials: true,
    validateStatus(status: number) {
      return status >= 200 && status < 300 // default
    },
  }
  if (options) {
    delete options.headers
  }
  const newOptions: RequestOptions = { ...defaultOptions, ...options }
  const newUrl = baseUrl + url
  return _axios
    .request<T>({
      ...newOptions,
      url: newUrl,
    })
    .then(data => data.data)
}
