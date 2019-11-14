import request from '@/utils/request'

export function fetchPort(query) {
  return request({
    url: '/port/list',
    method: 'get',
    params: query
  })
}
