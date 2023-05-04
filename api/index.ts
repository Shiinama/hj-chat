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
export const getUserEnergyInfo = () => {
  return request({
    url: `/user/getUserEnergyInfo`,
    method: 'get',
  })
}
export const getUserEnergsetBotPinnedStatusyInfo = data => {
  return request({
    url: `/bot/setBotPinnedStatus`,
    method: 'post',
    data,
  })
}
