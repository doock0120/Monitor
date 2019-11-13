<template>
  <div class="app-container">
  <div class="filter-container">
    <el-select v-model="listQuery.devType" class="filter-item" clearable placeholder="设备类型" style="width: 150px">
      <el-option key="0" value="0" label="全部" />
      <el-option v-for="item in devType" :key="item.key" :value="item.key" :label="item.value" />
    </el-select>
    <el-select v-model="listQuery.area" class="filter-item" clearable placeholder="区域" style="width: 200px">
      <el-option key="0" value="0" label="全市" />
      <el-option v-for="item in area" :key="item.key" :value="item.key" :label="item.value" />
    </el-select>
    <el-button
      class="filter-item" type="primary"
      style="margin-left: 10px;"
      icon="el-icon-search"
      @click="handleFilter"
    >查询</el-button>
  </div>
  <div class="chart-container">
    <div ref="chart" id="bMap"></div>
  </div>

  </div>
</template>

<script>
import { fetchList } from '@/api/devlist'
import echarts from 'echarts'
import bmap from 'echarts/extension/bmap/bmap'

  export default {
    data() {
      return {
        devList: [],
        devType: [
          { key: 1, value: '路由器' },
          { key: 2, value: '交换机' }
        ],
        listQuery:{
          devType:'',
          area:''
        },
        area : [
          { key: 1, value: '福田区' },
          { key: 2, value: '南山区' },
          { key: 3, value: '罗湖区' },
          { key: 4, value: '龙华区' },
          { key: 5, value: '宝安区' },
          { key: 6, value: '盐田区' },
          { key: 7, value: '龙岗区' },
          { key: 8, value: '光明区' },
          { key: 9, value: '坪大片区'}
        ],
        opt:{
          title: {
            text: '',
            subtext: '',
            sublink: '',
            left: ''
          },
          tooltip : {
            trigger: 'item',
            formatter: function (params) {
              let value = (params.value + '').split(',');
              return params.name + '<br/>' + '坐标' + ': ' + '['+value[0]+','+value[1]+']'+'<br/>'+ '端口故障率'+value[2];
            }
          },
          bmap: {
            center: [114.07	, 22.62],
            zoom: 8,
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
                  'color': '#F6E3A3'
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
              },{
                  "featureType": "district",
                  "elementType": "labels",
                  "stylers": {
                    "visibility": "on"
                  }
              }]
            }
          },
          series : [
            {
              name: '',
              type: 'scatter',
              coordinateSystem: 'bmap',
              data: [],
              symbolSize: function (val) {
                return val[2] / 10;
              },
              label: {
                normal: {
                  formatter: '{b}',
                  position: 'right',
                  show: false
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  color: '#FFE793',
                  borderColor: '#000000',
                  borderWidth: 1
                }
              }
            }
        ]
      },
      chart: null
    }
  },
  mounted() {
    fetchList(this.listQuery).then(res => {
      if (res.code === 20000){
        this.devList = res.data.items;
        this.getMap();
      }
      }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    getMap() {
      let {devType, area} = this.listQuery;
      let filterData = [];

      filterData = this.devList.filter(item => {
        if (devType === 1 && item.devType !== '路由器') return false
        if (devType === 2 && item.devType !== '交换机') return false
        if (area === 1 && item.devArea !== "福田区") return false
        if (area === 2 && item.devArea !== "南山区") return false
        if (area === 3 && item.devArea !== "罗湖区") return false
        if (area === 4 && item.devArea !== "龙华区") return false
        if (area === 5 && item.devArea !== "宝安区") return false
        if (area === 6 && item.devArea !== "盐田区") return false
        if (area === 7 && item.devArea !== "龙岗区") return false
        if (area === 8 && item.devArea !== "光明区") return false
        if (area === 9 && item.devArea !== "坪大片区") return false
        return true
      })

      this.opt.series[0].data = [...this.convertData(filterData)]
      this.chart = echarts.init(this.$refs.chart)
      this.chart.setOption(this.opt)
    },
    convertData(data) {
      const list = []
      for (let i = 0; i < data.length; i++) {
        list.push({
          name: data[i].devName,
          value: [data[i].devLon, data[i].devLat, 100]
        })
      }
      return list
    },
    handleFilter() {
      this.getMap();
    }
  }
}
</script>

<style scoped>

  .chart-container{
    position: relative;
    width: 100%;
    height: calc(100vh - 150px);
  }

  #bMap{
    width: 100%;
    height: calc(100vh - 150px);
  }
</style>
