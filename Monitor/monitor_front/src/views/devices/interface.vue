<template>
  <div class="app-container">
    <!--搜索条件区-->
    <div class="filter-container">
      <el-row type="flex" :gutter="10">
        <el-col :span="20">
          <el-alert
            :title="'设备名称：'+devName"
            type="success"
            :closable="false"
          />
        </el-col>
        <el-col :span="1" style="padding-top: 8px">
          <svg-icon icon-class="search" />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="listQuery.portName"
            placeholder="端口名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="listQuery.portDec"
            placeholder="端口描述"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="5">
          <el-select v-model="listQuery.portStat" class="filter-item" placeholder="端口状态" @change="handleFilter">
            <el-option key="0" label="-请选择-" :value="0" />
            <el-option v-for="item in pStas" :key="item.key" :value="item.value" :label="item.value" />
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" />
        </el-col>
        <el-col :span="1">
          <el-button class="filter-item" type="primary" @click="goBack()">返回</el-button>
        </el-col>
      </el-row>

    </div>

    <el-table :data="getList.pageData" border fit highlight-current-row style="width: 100%;" height="536">
      <el-table-column sortable prop="portName" label="端口名称" width="200" />
      <el-table-column prop="portStat" label="端口状态" width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.portStat | pState">{{ scope.row.portStat }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="portDec" label="端口描述" />
      <el-table-column prop="refIP" label="归属设备IP" width="130" />
      <el-table-column sortable prop="portUp" label="上行流量(KB/s)" width="150" />
      <el-table-column sortable prop="portDown" label="下行流量(KB/s)" width="150" />
      <el-table-column label="历史流量" width="100" >
        <template slot-scope="scope">
          <el-button type="primary" size="small">
          <router-link :to="{name:'FlowChart', query:{portName:scope.row.portName,refIP:scope.row.refIP,devName:devName}}">
            查看
          </router-link>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页组件-->
    <pagination v-show="getList.total>0" :total="getList.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchPort } from '@/api/portlist'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'

import FlowChart from '@/views/devices/flowchart'

export default {
  components: {
    Pagination
  },
  filters: {
    // 对部门人员数量进行数据格式化
    pState(value) {
      return value === '中断' ? 'danger' : (value === '关闭' ? 'warning' : 'success')
    }
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        portDec: '',
        portStat: '',
        portName: ''
      },
      searchTime:'2019-11-11 18:00:00',
      devIP:'192.168.1.1', //默认显示该设备端口
      devName: 'XSK5F_DCN_SW1',//默认设备名称
      portList: [],
      msg: 'vue模板页',
      pStas: [
        { key: 1, value: '开启' },
        { key: 2, value: '关闭' },
        { key: 3, value: '中断' }
      ]
    }
  },
  computed: {
    getList() {
      const { page, limit, portDec, portStat, portName } = this.listQuery

      // 进行过滤
      let filterData = []
      filterData = this.portList.filter(item => {
        if (portName && item.portName.indexOf(portName) === -1) { return false }
        if (portDec && item.portDec.indexOf(portDec) === -1) { return false }
        if (portStat && item.portStat.indexOf(portStat) === -1) { return false }
        return true
      })

      const pageData = filterData.filter((item, idx) => {
        return idx >= limit * (page - 1) && idx < limit * page
      })
      const total = filterData.length

      return { pageData: pageData, total: total }
    }
  },
  created(){
    if(this.$route.query.devName){
      this.devName = this.$route.query.devName
      this.devIP = this.$route.query.devIP
    }
  },
  mounted() {


    fetchPort(this.listQuery)
      .then(
        res => {
          let tmpList=res.data.items.filter(item => {
            if (this.devIP && item.refIP.indexOf(this.devIP) === -1) { return false }
            if (this.searchTime && item.getTime.indexOf(this.searchTime) === -1) { return false }
            return true
          })

          this.portList = tmpList
        }
      )
  },
  methods: {
    goBack(){
      this.$router.back();
    },
    handleFilter() {},
    handleDownload() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['端口名称', '端口状态', '端口描述', '归属设备IP', '上行流量(KB/s)', '下行流量(KB/s)', '统计时间']
          const filterVal = ['portName', 'portStat', 'portDec', 'refIP', 'portUp', 'portDown', 'getTime']
          const data = this.formatJson(filterVal, this.portList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.devName
          })
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }

  }
}
</script>

<style>

</style>
