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
