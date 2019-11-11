import Mock from 'mockjs'

const List = []
const count = 30

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    refDev: '@ctitle(3,5)',
    refIP:'@ip',
    portName:'@name',
    getTime: '@datetime',
    'portUp|50-100':1,
    'portDown|100-200':1
  }))
}

export default [
  {
    url: '/port/list',
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
