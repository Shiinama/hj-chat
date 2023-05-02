import { Toast } from '@fruits-chain/react-native-xiaoshu'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

import systemConfig from '../../constants/System'

import MSG_LIST from './message'

export type RequestOptions = AxiosRequestConfig & {
  url: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: any
}
const { baseUrl, authKey } = systemConfig
const _axios = axios.create()
/**
 * 响应拦截器
 */
_axios.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(response)
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
    console.log(error)
    const { response } = error
    // 请求有响应
    if (response) {
      const { status, data, config } = response
      data.message = data.errMsg || MSG_LIST.unknownError
      if (status === 401) {
        // 状态码为401时，根据白名单来判断跳转与否

        return Promise.reject(new Error(data.message))
      }
      // 404 502 ..
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
  console.log(options)
  const { url } = options
  const opt: RequestOptions = options
  delete opt.url
  const Authorization =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeVNoZWxsU3RhZ2luZyIsInN1YiI6MzA2LCJhdWQiOiJNeVNoZWxsU3RhZ2luZyIsIm5iZiI6MCwiaWF0IjoxNjgzMDA0MzE2ODk4LCJqdGkiOiJiNDYxNDgyZWQ2M2Q0YmQyOTcyZjFkNzlmNjIxOTE3NyIsInNlY3VyaXR5U3RhbXAiOiJmOTRkMDE5OGY2OTA0ODUwODIwYjJjMDkxYTFiODQwNCIsImV4cCI6MTY4MzAwNjkwODg5OH0.QiJIpWoeL3KIzklo8d8IaXBCsaJUK45OuCvHQwFqZo4'
  let headers = {}
  if (options) {
    headers = options.headers || {}
  }
  const defaultOptions = {
    headers: {
      [Authorization]: Authorization ? Authorization : null,
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
  newOptions.data = newOptions.body
  delete newOptions.body
  const newUrl = baseUrl + url
  return _axios
    .request<T>({
      ...newOptions,
      url: 'https://api-test.myshell.ai/bot/list',
      method: 'get',
    })
    .then(data => data.data)
}
