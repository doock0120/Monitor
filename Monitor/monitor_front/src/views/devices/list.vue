<template>
  <div class="app-container">
    <el-table :data="devList" border fit highlight-current-row style="width: 100%;">
      <el-table-column sortable prop="id" label="编号" />
      <el-table-column prop="devName" label="设备名称" />
      <el-table-column prop="devIP" label="设备ip" />
      <el-table-column prop="devAddress" label="设备地址" />
      <el-table-column prop="devType" label="设备类型" />
      <el-table-column prop="devOperator" label="维护人员" />
      <el-table-column prop="devLon" label="经度" />
      <el-table-column prop="devLat" label="纬度" />

    </el-table>

  </div>
</template>

<script>
import { fetchList } from '@/api/devlist'
export default {
  data() {
    return {
      listQuery: 1,
      devList: [],
      msg: 'vue模板页'
    }
  },
  mounted() {
    fetchList(this.listQuery)
      .then(
        res => {
          this.devList = res.data.items
        }
      )
  }
}
</script>

<style>

</style>
