<template>
    <div class="app-container">
      <div class="filter-container">
        <el-input
          v-model="listQuery.devName"
          placeholder="设备名称"
          style="width: 150px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.devIP"
          placeholder="设备IP"
          style="width: 150px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          class="filter-item"
          type="primary"
          style="margin-left: 10px;"
          icon="el-icon-search"
          @click="handleFilter"
        >
          查询
        </el-button>
      </div>
      <div class="chart-container">
        <div ref="chart1" class="chart"></div>
      </div>
    </div>
</template>

<script>
  import {fetchList} from '@/api/devlist'
  import echarts from 'echarts'
  export default {
    data() {
      return {
        list:[],
        listQuery:{
          devName:'',
          devIP:''
        },
        devList:[],
        chart1:null,
        opt1:{
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data:['路由器','交换机']
          },
          series: [
            {
              name:'设备类型',
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:[]
            }
          ]
        }
      }
    },
    mounted(){
      fetchList().then(res=> {
        this.devList = res.data.items;
        console.log(this.devList)
        this.getChart1();
      }).catch(err=>{
        console.log(err)
      })
    },
    methods:{
      handleFilter(){},
      getChart1() {
        let list = [{value: 0, name: '路由器'},
          {value: 0, name: '交换机'}];

        for (let i = 0; i < this.devList.length; i++) {
          if (this.devList[i].devType === "路由器") {
            list[0].value++
          } else {
            list[1].value++
          }
        }


        this.opt1.series[0].data = [...list]
        console.log(this.opt1.series[0].data);

        this.chart1 = echarts.init(this.$refs.chart1)
        this.chart1.setOption(this.opt1)
      }
    }
  }
</script>

<style scoped>
  .chart-container{
    position: relative;
    width: 100%;
    height: 300px;
  }

  .chart{
    width: 304.98px;
    height: 300px;
  }

</style>
