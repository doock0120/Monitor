import Mock from 'mockjs'

const List = []
const count = 30

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: "@increment",
    devName: '@ctitle(3,5)',
    'devArea|1': ["福田区","南山区","罗湖区","龙华区","宝安区","盐田区","龙岗区","光明区","坪大片区",],
    devIP:'@ip',
    'devAddress|1':['新时空机房','新世界机房','新东方机房'],
    'devType|1':["交换机","路由器"],
    devOperator: '@cname',
    'devLon|113-114.2':1,
    'devLat|22.2':1
  }))
}

List.unshift({id:9001,devName:'XSK5F_DCN_SW1',devArea:'福田区',devIP:'192.168.1.1',devAddress: 'SZ',devType:'路由器',devOperator: '张三',devLon:114,devLat:22});
List.unshift({id:9002,devName:'XSK5F_DCN_SW2',devArea:'南山区',devIP:'192.168.1.2',devAddress: 'SZ',devType:'交换机',devOperator: '李四',devLon:113,devLat:21});

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

