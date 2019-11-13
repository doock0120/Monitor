import Mock from 'mockjs'

const List = []
const count = 30

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'sId|1-5':1,
    pId:"@increment",
    portName:function () {
      return "Gi " +this.sId +"/"+this.pId;
    },
    'portStat|1':['开启','关闭','中断'],
    portDec: '@title(3,5)',
    refIP:'@ip',
    getTime: '@datetime',
    'portUp|50-100':1,
    'portDown|100-200':1
  }))
}

List.push({sId:1,pId:1,portName:"Gi 1/1",portStat:'开启',portDec: 'To SZMSS',refIP:'192.168.1.1',getTime: '2019-11-12 08:00:00',portUp:100,portDown:200});
List.push({sId:1,pId:1,portName:"Gi 1/1",portStat:'开启',portDec: 'To SZMSS',refIP:'192.168.1.1',getTime: '2019-11-12 09:00:00',portUp:110,portDown:220});
List.push({sId:1,pId:1,portName:"Gi 1/1",portStat:'开启',portDec: 'To SZMSS',refIP:'192.168.1.1',getTime: '2019-11-12 10:00:00',portUp:120,portDown:240});
List.push({sId:1,pId:1,portName:"Gi 1/1",portStat:'开启',portDec: 'To SZMSS',refIP:'192.168.1.1',getTime: '2019-11-12 11:00:00',portUp:130,portDown:260});
List.push({sId:1,pId:1,portName:"Gi 1/1",portStat:'开启',portDec: 'To SZMSS',refIP:'192.168.1.1',getTime: '2019-11-12 12:00:00',portUp:140,portDown:260});
List.push({sId:1,pId:1,portName:"Gi 1/1",portStat:'开启',portDec: 'To SZMSS',refIP:'192.168.1.1',getTime: '2019-11-12 13:00:00',portUp:130,portDown:250});
List.push({sId:1,pId:1,portName:"Gi 1/1",portStat:'开启',portDec: 'To SZMSS',refIP:'192.168.1.1',getTime: '2019-11-12 14:00:00',portUp:140,portDown:230});
List.push({sId:1,pId:1,portName:"Gi 1/1",portStat:'开启',portDec: 'To SZMSS',refIP:'192.168.1.1',getTime: '2019-11-12 15:00:00',portUp:130,portDown:220});
List.push({sId:1,pId:1,portName:"Gi 1/1",portStat:'开启',portDec: 'To SZMSS',refIP:'192.168.1.1',getTime: '2019-11-12 16:00:00',portUp:120,portDown:200});
List.push({sId:1,pId:1,portName:"Gi 1/1",portStat:'开启',portDec: 'To SZMSS',refIP:'192.168.1.1',getTime: '2019-11-12 17:00:00',portUp:110,portDown:210});
List.push({sId:1,pId:1,portName:"Gi 1/1",portStat:'开启',portDec: 'To SZMSS',refIP:'192.168.1.1',getTime: '2019-11-12 18:00:00',portUp:100,portDown:190});

export default [
  {
    url: '/port/list',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          title:'XSK5F_DCN_SW1',
          items:List
        }
      }
    }
  }
]
