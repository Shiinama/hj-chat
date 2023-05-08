import request from '../utils/request'

export const particleLogin = data => {
  return request({
    url: `/auth/particleLogin`,
    method: 'post',
    data,
  })
}
