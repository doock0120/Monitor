<template>
    <div class="app-container">
      <div class="filter-container">
        <el-select
          v-model="listQuery.devAddress"
          placeholder="机房名称"
          style="width: 200px"
          class="filter-item" @change="getChart1()"
        ><el-option
            v-for="item in addOptions"
            :key="item.key"
            :label="item.value"
            :value="item.value">
        </el-option>
        </el-select>
        <el-select
          v-model="listQuery.devName"
          placeholder="设备名称"
          style="width: 200px"
          class="filter-item" @change="getChart2()"
        ><el-option
          v-for="item in nameOptions"
          :key="item.key"
          :label="item.value"
          :value="item.key">
        </el-option>
        </el-select>
      </div>

      <div class="chart-container">
        <div class="chart-wrapper">
          <div ref="chart1" class="chart"></div>
        </div>
        <div class="chart-wrapper">
          <div ref="chart2" class="chart"></div>
        </div>
      </div>

      <el-table  border>
        <el-table-column prop="devName" label="设备名称" align="center" min-width="75" />
        <el-table-column prop="time" label="最近一次告警时间" align="center" min-width="160" />
      </el-table>

    </div>
</template>

<script>
  import {fetchList} from '@/api/devlist'
  import {fetchPort} from '@/api/portlist'
  import echarts from 'echarts'
  export default {
    data() {
      return {
        list:[],
        listQuery:{
          devAddress:'',
          devName:''
        },
        addOptions:[{
          key: '选项1',
          value: '新时空机房'
        }, {
          key: '选项2',
          value: '新世界机房'
        }, {
          key: '选项3',
          value: '新东方机房'
        }],
        nameOptions:[],
        devList:[],
        portList:[],
        chart1:null,
        chart2:null,
        opt1:{
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data:['路由器','交换机'],
            textStyle:{
              fontSize:12
            }
          },
          color:['#66CCFF','#EFC31A'],
          series: [
            {
              name:'设备类型',
              type:'pie',
              radius: ['40%', '70%'],
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
        opt2:{
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
        }
      }
    },
    mounted(){
      fetchList().then(res=> {
        this.devList = res.data.items;
        console.log(this.devList)
        for (let i = 0; i < this.devList.length; i++){
          this.nameOptions.push({
            key:this.devList[i].devIP,
            value:this.devList[i].devName
          })
        }
        this.getChart1();
      }).catch(err=>{
        console.log(err)
      })

      fetchPort().then(res=> {
        this.portList = res.data.items;
        console.log(this.portList)
        this.getChart2();
      }).catch(err=>{
        console.log(err)
      })

    },
    methods:{
      handleFilter(){},
      getChart1() {
        let {devAddress}=this.listQuery
        let list = [{value: 0, name: '路由器'},
          {value: 0, name: '交换机'}];

        for (let i = 0; i < this.devList.length; i++) {
          if(devAddress === this.devList[i].devAddress){
            if (this.devList[i].devType === "路由器") {
              list[0].value++
            } else {
              list[1].value++
            }
          }
        }

        console.log(list)
        this.opt1.series[0].data = [...list]
        console.log(this.opt1.series[0].data);

        this.chart1 = echarts.init(this.$refs.chart1)
        this.chart1.setOption(this.opt1)
      },
      getChart2(){
        let {devName}=this.listQuery
        let list = [{value: 0, name: '开启'},
          {value: 0, name: '关闭'},
          {value: 0, name: '中断'}];

        for (let i = 0; i < this.portList.length; i++) {
          if(devName===this.portList[i].refIP){
            if (this.portList[i].portStat === "开启") {
              list[0].value++
            } else if(this.portList[i].portStat === "关闭"){
              list[1].value++
            }else {
              list[2].value++
            }
          }

        }

        this.opt2.series[0].data = [...list]
        console.log(this.opt2.series[0].data);

        this.chart2 = echarts.init(this.$refs.chart2)
        this.chart2.setOption(this.opt2)
      },
    }
  }
</script>

<style scoped>

  .chart-container{
    margin-top: 20px;
    position: relative;
    width: 100%;
    height: 300px;
    display: table;
  }

  .chart-wrapper{
    width: 33.3%;
    padding-left: 16px;
    padding-right: 16px;
    display: inline-block;
  }

  .chart-wrapper:first-child{
    padding-left: 0;
  }

  .chart-wrapper:last-child{
    padding-right: 0;
  }

  .chart{
    padding: 16px;
    width: 100%;
    height: 300px;
    margin-bottom: 32px;
    background-color: #f0f2f5;
  }

</style>
