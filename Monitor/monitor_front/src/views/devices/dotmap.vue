<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.devName" class="filter-item" clearable placeholder="设备类型" style="width: 150px">
        <el-option key="0" value="0" label="全部" />
        <el-option v-for="item in dataTable" :key="item.name" :value="item.name" :label="item.name" />
      </el-select>
      <el-button
        class="filter-item" type="primary"
        style="margin-left: 10px;"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
    </div>

    <div class="chart-container">
      <el-row type="flex" :gutter="10">
        <el-col :span="18">
          <div ref="chart1" id="bMap"></div>
        </el-col>
        <el-col :span="6">
          <div ref="chart2" id="port"></div>
        </el-col>
      </el-row>

    </div>

  </div>
</template>

<script>

  import echarts from 'echarts'
  import bmap from 'echarts/extension/bmap/bmap'
  import {fetchPort} from '@/api/portlist'

  export default {
    data() {
      return {
        listQuery:{
          page: 1,
          limit: 5,
          devName:''
        },
        portList:[],
        searchTime:'2019-11-11 18:00:00',
        opt:{
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'horizontal',
            x : 'center',
            y : 'bottom',
            data:['开启','关闭','中断'],
            textStyle:{
              fontSize:12
            }
          },
          color:['#67C23A','#909399','#F56C6C'],
          calculable : true,
          series: [
            {
              name:'端口状态',
              type:'pie',
              radius : [20, 90],
              center : ['50%', '50%'],
              roseType : 'radius',
              data:[],
              itemStyle : {
                emphasis : {
                  shadowBlur : 10,
                  shadowOffsetX : 0,
                  shadowColor : 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        },
        dataTable: [
          {name: 'XSK_SW1', refIP:'192.168.1.1', value: 80},
          {name: 'XSJ_RT2', refIP:'192.168.1.2', value: 70},
          {name: '新时空CRS', refIP:'192.168.1.3', value: 50},
          {name: '松山湖5KE', refIP:'192.168.1.4', value: 60},
          {name: '大岭山南区ME60', refIP:'192.168.1.5', value: 50},
          {name: '大岭山新塘ME60', refIP:'192.168.1.6', value: 50},
          {name: '大朗巷尾ME60', refIP:'192.168.1.7', value: 85},
          {name: '常平丽景ME60', refIP:'192.168.1.8', value: 80},
          {name: '常平司马ME60', refIP:'192.168.1.9', value: 95},
          {name: '寮步刘灿ME60', refIP:'192.168.1.10', value: 90},
          {name: '联通大厦ASR9010', refIP:'192.168.1.11', value: 87},
          {name: '福田保税区ME60', refIP:'192.168.1.12', value: 95},
          {name: '鸿隆大厦ME60', refIP:'192.168.1.13', value: 53},
          {name: '宝安西乡ME60', refIP:'192.168.1.14', value: 86},
          {name: '龙华电信ME60', refIP:'192.168.1.15', value: 45},
          {name: '福永桥头ME60', refIP:'192.168.1.16', value: 33},
          {name: '布吉恒通ME60', refIP:'192.168.1.17', value: 92},
          {name: '火车北站ME60', refIP:'192.168.1.18', value: 78},
          {name: '龙都花园BAS', refIP:'192.168.1.19', value: 83},
          {name: '深南花园ME60', refIP:'192.168.1.20', value: 60},
          {name: '盐田中兴设备', refIP:'192.168.1.21', value: 34},
          {name: '坪山石井ME60', refIP:'192.168.1.22', value: 47},
          {name: '石岩宏发ME60', refIP:'192.168.1.23', value: 76},
          {name: '龙岗同乐ME60', refIP:'192.168.1.24', value: 57},
          {name: '坂田光雅园BAS', refIP:'192.168.1.25', value: 93},
          {name: '观澜新田ME60', refIP:'192.168.1.26', value: 65},
          {name: '光明工业区BAS', refIP:'192.168.1.27', value: 36},
          {name: '罗湖中深MA5200', refIP:'192.168.1.28', value: 50}
        ],
        geoCoordMap: {
          'XSK_SW1': [113.794699, 22.82177],
          'XSJ_RT2': [113.80699, 22.92647],
          '新时空CRS': [113.754699, 23.02647],
          '松山湖5KE': [113.878181, 22.952166],
          '大岭山南区ME60': [113.851117, 22.898655],
          '大岭山新塘ME60': [113.854631, 22.935257],
          '大朗巷尾ME60': [113.931536, 22.953701],
          '常平丽景ME60': [114.020174, 22.987429],
          '常平司马ME60': [114.072947, 22.98404],
          '寮步刘灿ME60': [113.887622, 23.004728],
          '联通大厦ASR9010':[114.064552,22.548457],
          '福田保税区ME60':[114.062762,22.514223],
          '鸿隆大厦ME60':[113.930868,22.513401],
          '宝安西乡ME60':[113.887517,22.574947],
          '龙华电信ME60':[114.048529,22.757597],
          '福永桥头ME60':[113.810468,22.685195],
          '布吉恒通ME60':[114.132539,22.617657],
          '火车北站ME60':[114.035529,22.615108],
          '龙都花园BAS':[113.966227,22.575013],
          '深南花园ME60':[113.951257,22.546617],
          '盐田中兴设备':[114.313238,22.600794],
          '坪山石井ME60':[114.389669,22.706196],
          '石岩宏发ME60':[113.994655,22.678777],
          '龙岗同乐ME60':[114.31693,22.72467],
          '坂田光雅园BAS':[114.07521,22.625244],
          '观澜新田ME60':[114.06414,22.716897],
          '光明工业区BAS':[113.94256,22.754466],
          '罗湖中深MA5200':[114.137432,22.554485]
        }
      }
    },
    mounted(){
      fetchPort().then(res=> {
        let tmpList=res.data.items.filter(item => {
          if (this.searchTime && item.getTime.indexOf(this.searchTime) === -1) { return false }
      return true
    })

      this.portList = tmpList
    }),

      this.getMap()
    },
    methods: {
      getMap () {
        let option = {
            title: {
              text: '',
              subtext: '',
              sublink: '',
              left: 'center',
              top: '10'
            },
            tooltip : {
              trigger: 'item',
              formatter: (params)=>params.seriesName + '<br/>' + '坐标' + '：'
            + '['+params.value[0]+', '+params.value[1]+']'+'<br/>'+ '上行流量百分比：'+params.value[2]+' %'
          },
          bmap: {
          center: this.selectData().res,
            zoom: this.selectData().zoom,
            roam: true,
            mapStyle: {
            styleJson: [{
              'featureType': 'water',
              'elementType': 'all',
              'stylers': {
                'color': '#A3CCE1'
              }
            }, {
              'featureType': 'land',
              'elementType': 'all',
              'stylers': {
                'color': '#FCF9F2'
              }
            }, {
              'featureType': 'railway',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'highway',
              'elementType': 'all',
              'stylers': {
                'color': '#F6E3A3',
                'visibility': 'off'
              }
            }, {
              'featureType': 'highway',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'geometry',
              'stylers': {
                'color': '#fefefe'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'geometry.fill',
              'stylers': {
                'color': '#fefefe'
              }
            }, {
              'featureType': 'poi',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'green',
              'elementType': 'all',
              'stylers': {
                'visibility': '#5ABD4D'
              }
            }, {
              'featureType': 'subway',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'manmade',
              'elementType': 'all',
              'stylers': {
                'color': '#d1d1d1'
              }
            }, {
              'featureType': 'local',
              'elementType': 'all',
              'stylers': {
                'color': '#d1d1d1'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'boundary',
              'elementType': 'all',
              'stylers': {
                'color': '#fefefe'
              }
            }, {
              'featureType': 'building',
              'elementType': 'all',
              'stylers': {
                'color': '#d1d1d1'
              }
            }, {
              'featureType': 'label',
              'elementType': 'labels.text.fill',
              'stylers': {
                'color': '#49B0FE'
              }
            }, {
              "featureType": "district",
              "elementType": "labels",
              "stylers": {
                "visibility": "off"
              }
            }]
          }
        },
        series : [
          {
            name: '正常运行',
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: this.convertData(this.dataTable.filter((item)=>{
              if (item.value >= 80) return false
            return true
          })
      ),
        symbolSize: (val) => val[2] / 5,
          // 新增
          showEffectOn: 'render',
          rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
          //
          label: {
          normal: {
            formatter: '{b}',
              position: 'right',
              show: true
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: 'green'
          }
        }
      },
        {
          name: '负荷预警',
            type: 'effectScatter',
          coordinateSystem: 'bmap',
          data: this.convertData(this.dataTable.filter((item)=>{
          if (item.value < 80) return false
          if (item.value >= 90) return false
          return true
        })
        ),
          symbolSize: (val) => val[2] / 5,
          showEffectOn: 'render',
          rippleEffect: {
          brushType: 'stroke'
        },
          hoverAnimation: true,
            label: {
          normal: {
            formatter: '{b}',
              position: 'right',
              show: true
          }
        },
          itemStyle: {
            normal: {
              color: 'orange',
                shadowBlur: 10,
                shadowColor: '#333'
            }
          }
        },
        {
          name: '高负荷',
            type: 'effectScatter',
          coordinateSystem: 'bmap',
          data: this.convertData(this.dataTable.filter((item)=>{
          if (item.value < 90) return false
          return true
        })
        ),
          symbolSize: (val) => val[2] / 5,
          showEffectOn: 'render',
          rippleEffect: {
          brushType: 'stroke'
        },
          hoverAnimation: true,
            label: {
          normal: {
            formatter: '{b}',
              position: 'right',
              show: true
          }
        },
          itemStyle: {
            normal: {
              color: 'darkred',
                shadowBlur: 10,
                shadowColor: '#333'
            }
          }
        }
      ]
      }

        // 地图展示
        echarts.init(this.$refs.chart1).setOption(option)
      },
      convertData (dataTable) {
        let { geoCoordMap } = this
        let res = []
        for (let i = 0; i < dataTable.length; i++) {
          let geoCoord = geoCoordMap[dataTable[i].name]
          if ( geoCoord ) {
            res.push({
              name: dataTable[i].name,
              value: geoCoord.concat(dataTable[i].value)
            });
          }
        }
        return res;
      },
      selectData(){
        let {devName}=this.listQuery
        let res=[]
        let zoom
        if(devName  && devName !=="0"){
          res=this.geoCoordMap[devName].slice(0,2)
          return {res:res,zoom:14}
        }else{
          return {res:[113.914697, 22.6870],zoom:10}
        }
      },
      handleFilter(){
        this.getMap()
        this.getChart()
      },
      getChart(){
        let {devName}=this.listQuery
        let list = [{value: 0, name: '开启'},
          {value: 0, name: '关闭'},
          {value: 0, name: '中断'}];

        let filterList=this.dataTable.filter(item=>{
          if(devName && item.name !== devName) return false
        return true
      })

        console.log(filterList)

        for (let i = 0; i < this.portList.length; i++) {
          if(filterList[0].refIP===this.portList[i].refIP){
            if (this.portList[i].portStat === "开启") {
              list[0].value++
            } else if(this.portList[i].portStat === "关闭"){
              list[1].value++
            }else {
              list[2].value++
            }
          }

        }

        this.opt.series[0].data = [...list]

        echarts.init(this.$refs.chart2).setOption(this.opt)
      }
    }
  }
</script>

<style scoped>

  .chart-container{
    position: relative;
    width: 100%;
    height: 100%;
    margin-bottom: 20px
  }

  #bMap{
    width: 100%;
    height: calc(100vh - 180px);
    border:1px solid #eeeeee;
  }

  #port{
    width: 100%;
    height: calc(100vh - 180px);
    margin: 0 20px;
  }

</style>
