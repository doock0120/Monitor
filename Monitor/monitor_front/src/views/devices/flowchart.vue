<template>
  <div class="area">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="1"style="padding-top: 20px" :offset="22">
            <el-button type="primary" @click="goBack()">返回</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div class="chart-container">
          <div ref="chart" style="height: 80%;width: 100%" />
        </div>
      </el-main>
    </el-container>

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
        refIP:'',
        portName: ''
      }
    }
  },
  methods:{
    goBack(){
      this.$router.back();
    }
  },
  computed: {
    getList() {
      const { portName,refIP } = this.listQuery

      // 进行过滤
      let filterData = []
      filterData = this.portList.filter(item => {
        if (portName && item.portName !== portName) { return false }
        if (refIP && item.refIP !== refIP) { return false }
        return true
      })

      const chartList = filterData
      const upFlow = []
      const downFlow = []
      chartList.forEach((item) => {
        upFlow.push([item.getTime,item.portUp])
        downFlow.push([item.getTime,item.portDown])
      })

      return { upFlow: upFlow, downFlow: downFlow }
    }
  },
  created() {
    this.listQuery.refIP=this.$route.params.refIP;
    this.listQuery.portName=this.$route.params.portName;
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
        color: [ '#80D645','#46A6FF'],
        legend: {
          data: ['下行流量(KB/s)', '上行流量(KB/s)']
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
            type: 'time',
            boundaryGap: false,
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],

        dataZoom: [// 这个dataZoom组件，若未设置xAxisIndex或yAxisIndex，则默认控制x轴。
          {
            type: 'slider',//这个 dataZoom 组件是 slider 型 dataZoom 组件（只能拖动 dataZoom 组件导致窗口变化）
            xAxisIndex: 0, //控制x轴
            minValueSpan:3600 * 24 * 1000 * 0.5, //限制窗口大小的最小值
            start: 0, 	// 左边在 0% 的位置
            end: 50 	// 右边在 50% 的位置
          },
          {
            type: 'inside',//这个 dataZoom 组件是 inside 型 dataZoom 组件（能在坐标系内进行拖动，以及用滚轮（或移动触屏上的两指滑动）进行缩放）
          }],
        series: [
          {
            name: '下行流量(KB/s)',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: this.getList.downFlow
          },
          {
            name: '上行流量(KB/s)',
            type: 'line',
            stack: '总量',
            areaStyle: {},
           data: this.getList.upFlow
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
