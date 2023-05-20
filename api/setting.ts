import request from '../utils/request'

/**
 * filter
 */
export const getFilters = () => {
  return request<any>({
    url: `/bot/filters`,
    method: 'get',
  })
}

/**
 *  我的机器人列表
 */
export const getUgcOwnList = () => {
  return request({
    url: `/bot/ugc/own`,
    method: 'get',
  })
}
