import request from '@/utils/request'

export function fetchList(query) {
  return request({
    // url: 'http://172.17.0.77:6666/demo/devlist/',
    url:'device/list',
    method: 'get',
    params: query
  })
}

