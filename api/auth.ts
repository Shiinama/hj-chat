import request from '../utils/request'
type UserStore = {
  token: string
  expiration: number
  userId: number
  userUid: string
}
export const particleLogin = data => {
  return request<UserStore>({
    url: `/auth/particleLogin`,
    method: 'post',
    data,
  })
}
