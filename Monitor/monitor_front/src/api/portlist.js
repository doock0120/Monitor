import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/port/list',
    method: 'get',
    params: query
  })
}
