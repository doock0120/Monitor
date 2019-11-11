import Mock from 'mockjs'

const List = []
const count = 30

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    devName: '@ctitle(3,5)',
    devIP:'@ip',
    devAddress:'@ctitle(5,10)',
    'devType|1':["交换机","路由器"],
    devOperator: '@cname',
    'devLon|113-114.2':1,
    'devLat|22.2':1
  }))
}

export default [
  {
    url: '/device/list',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          items:List
        }
      }
    }
  }
]

