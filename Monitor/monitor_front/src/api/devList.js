import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/device/list',
    method: 'get',
    params: query
  })
}

