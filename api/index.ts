import request from '../utils/request'

export const botList = () => {
  return request({
    url: '/bot/list',
    method: 'get',
  })
}
export const chatHistory = id => {
  return request({
    url: `/chat/chatHistory/?botUid=${id}`,
    method: 'get',
  })
}
