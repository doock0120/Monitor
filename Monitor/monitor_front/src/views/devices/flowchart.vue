<template>
  <div>
    <div class="chart-container">
      <div ref="chart" style="height: 100%;width: 100%" />
    </div>
  </div>

</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'

import { fetchList } from '@/api/portlist'

export default {
  minxins: [resize],
  data() {
    return {
      chart: null,
      devName: '',
      portList: [],
      listQuery: {
        portName: 'Gi 1/1'
      }
    }
  },
  computed: {
    getList() {
      const { portName } = this.listQuery

      // 进行过滤
      let filterData = []
      filterData = this.portList.filter(item => {
        if (portName && item.portName !== portName) { return false }
        return true
      })

      const chartList = filterData
      const tRange = []
      const upFlow = []
      const downFlow = []
      chartList.forEach((item) => {
        tRange.push(item.getTime)
        upFlow.push(item.portUp)
        downFlow.push(item.portDown)
      })

      return { chartList: chartList, tRange: tRange, upFlow: upFlow, downFlow: downFlow }
    }
  },
  created() {
  },
  mounted() {
    fetchList(this.listQuery).then(res => {
      this.devName = res.data.title
      this.portList = res.data.items

      this.chart = echarts.init(this.$refs.chart)
      this.chart.setOption({
        title: {
          text: this.devName + '   ' + this.listQuery.portName
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        color: ['#4472C5', '#ED7C30'],
        legend: {
          data: ['下行流量', '上行流量']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.getList.tRange
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '上行流量',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: this.getList.upFlow
          },
          {
            name: '下行流量',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: this.getList.downFlow
          }
        ]
      })
    })
  }
}
</script>

<style>
  .chart-container{
    position: relative;
    width: 100%;
    height: calc(100vh - 84px);
  }
</style>
