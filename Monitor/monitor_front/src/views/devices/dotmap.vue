<template>
  <div class="chart-container">
    <div id="bMap" ref="chart" />
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
      opt: {
        title: {
          text: '',
          subtext: '',
          sublink: '',
          left: ''
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            var value = (params.value + '').split(',')
            return params.name + '<br/>' + '坐标' + ': ' + '[' + value[0] + ',' + value[1] + ']' + '<br/>' + value[2]
          }
        },
        bmap: {
          center: [114.07, 22.62],
          zoom: 12,
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
            }, {
              'featureType': 'district',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'on'
              }
            }]
          }
        },
        series: [
          {
            name: 'pm2.5',
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: [],
            symbolSize: function(val) {
              return val[2] / 10
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
                color: '#37F241',
                shadowBlur: 10,
                shadowColor: '#333'
              }
            }
          }
        ]
      },
      chart: null
    }
  },
  mounted() {
    this.getData()

    //      console.log(this.opt)
  },
  methods: {
    getData() {
      fetchList().then(res => {
        if (res.code === 20000) {
          const list = []
          this.devList = res.data.items
          const data = [...this.devList]
          for (let i = 0; i < data.length; i++) {
            list.push({
              name: data[i].devName,
              value: [data[i].devLon, data[i].devLat, 100]
            })
          }
          this.opt.series[0].data = [...list]
          this.chart = echarts.init(this.$refs.chart)
          this.chart.setOption(this.opt)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
  .chart-container{
    position: relative;
    width: 100%;
    height: calc(100vh - 84px);
  }

  #bMap{
    width: 100%;
    height: calc(100vh - 84px);
  }
</style>
