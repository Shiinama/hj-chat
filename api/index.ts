import request from '../utils/request'

export const botList = () => {
  return request({
    url: '/bot/list',
    method: 'get',
  })
}
export const chatHistory = (params: {botUid: string; offset?: number; limit?: number; afterId?: number}) => {
  return request({
    url: `/chat/chatHistory`,
    query: params,
    method: 'get',
  })
}
export const profile = () => {
  return request({
    url: `/user/profile`,
    method: 'get',
  })
}
export const getUserEnergyInfo = () => {
  return request({
    url: `/user/getUserEnergyInfo`,
    method: 'get',
  })
}
export const setBotPinnedStatus = data => {
  return request({
    url: `/bot/setBotPinnedStatus`,
    method: 'post',
    data,
  })
}
export const removeBotFromChatList = data => {
  return request({
    url: `/bot/removeBotFromChatList`,
    method: 'post',
    data,
  })
}
export const resetHistory = data => {
  return request({
    url: `/chat/resetHistory`,
    method: 'post',
    data,
  })
}

export const createSharedConversation = messageUidList => {
  return request({
    url: `/chat/createSharedConversation`,
    method: 'post',
    data: { messageUidList },
  })
}
