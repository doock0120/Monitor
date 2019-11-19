<template>
  <div class="app-container">

    <!--搜索条件区-->
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
      <el-select v-model="listQuery.devType" class="filter-item" placeholder="设备类型" style="width: 150px" @change="handleFilter">
        <el-option key="0" value="0" label="全部" />
        <el-option v-for="item in devType" :key="item.key" :value="item.key" :label="item.value" />
      </el-select>
      <el-input
        v-model="listQuery.devOperator"
        placeholder="包机人"
        style="width: 150px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>


    </div>

    <!--设备列表数据表格-->
    <el-table v-loading="listLoading" :data="pageData" border>
      <el-table-column sortable prop="id" label="编号" align="center" min-width="75" />
      <el-table-column prop="devName" label="设备名称" align="center" min-width="160" />
      <el-table-column prop="devIP" label="设备IP" align="center" min-width="100" />
      <el-table-column prop="devType" label="设备类型" align="center" />
      <el-table-column prop="devOperator" label="包机人" align="center" />
      <el-table-column prop="devAddress" label="设备地址" min-width="300" />

      <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
          <el-button type="primary" size="small" plain>
            <router-link :to="{name:'DeviceInterface', query:{devName:row.devName,devIP:row.devIP}}">
              端口查看
            </router-link>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="编号" prop="id">
          <el-input :disabled="dialogStatus==='update'"  v-model="temp.id" />
        </el-form-item>
        <el-form-item label="设备名称" prop="devName">
          <el-input v-model="temp.devName" />
        </el-form-item>
        <el-form-item label="设备IP" prop="devIP">
          <el-input v-model="temp.devIP" />
        </el-form-item>
        <el-form-item label="设备类型" prop="devType">
          <el-input v-model="temp.devType" />
        </el-form-item>
        <el-form-item label="包机人" prop="devOperator">
          <el-input v-model="temp.devOperator" />
        </el-form-item>
        <el-form-item label="设备地址" prop="devAddress">
          <el-input v-model="temp.devAddress" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>


    <el-dialog title="提示" :visible.sync="dialogDelVisible">
      <span>请确认是否删除？<br><br></span>

      <el-form :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="编号" prop="id">
          <el-input disabled  v-model="temp.id" />
        </el-form-item>
        <el-form-item label="设备名称" prop="devName">
          <el-input disabled  v-model="temp.devName" />
        </el-form-item>
        <el-form-item label="设备IP" prop="devIP">
          <el-input disabled  v-model="temp.devIP" />
        </el-form-item>
        <el-form-item label="设备类型" prop="devType">
          <el-input disabled  v-model="temp.devType" />
        </el-form-item>
        <el-form-item label="包机人" prop="devOperator">
          <el-input disabled  v-model="temp.devOperator" />
        </el-form-item>
        <el-form-item label="设备地址" prop="devAddress">
          <el-input disabled  v-model="temp.devAddress" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="delData()">
          确定
        </el-button>
      </div>
    </el-dialog>


    <!--分页器-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import { fetchList } from '@/api/devlist'

import DeviceInterface from '@/views/devices/interface'

export default {
  components: { Pagination },
  data() {
    return {

      // 控制等待画面显示与否
      listLoading: true,

      // 获取设备总数据列表
      deviceList: [],
      total: 0,
      // 当前页数据
      pageData: [],

      // 查询条件
      listQuery: {
        page: 1,
        limit: 10,
        devName: '',
        devIP: '',
        devOperator: '',
        devType: ''
      },
      devType: [
        { key: 1, value: '路由器' },
        { key: 2, value: '交换机' }
      ],

      temp: {
        id: undefined,
        devName:'',
        devIP: '',
        devType:'',
        devOperator: '',
        devAddress:''
      },
      dialogFormVisible: false,
      dialogDelVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      // 显示等待画面
      this.listLoading = true

      // 初始获取所有设备数据列表
      fetchList(this.listQuery).then(response => {
        if (response.code === 20000) {
          this.deviceList = response.data.items
          this.total = response.data.items.length

          // 数据分页
          this.paging()

          // 1.5s后关闭等待画面
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        }
      }).catch(err => {
        console.log(err) // 这里catch到错误timeout
      })
    },
    // 筛选、分页方法
    paging() {
      const {page, limit, devName, devIP, devOperator, devType} = this.listQuery

      // 对deptList数据进行过滤
      let filterData = []

      filterData = this.deviceList.filter(item => {
        if (devType === 1 && item.devType !== '路由器') return false
        if (devType === 2 && item.devType !== '交换机') return false
        if (devName && item.devName.indexOf(devName) === -1) return false
        if (devIP && item.devIP.indexOf(devIP) === -1) return false
        if (devOperator && item.devOperator.indexOf(devOperator) === -1) return false
        return true
      })

      // 设置数据总数为过滤后的总数据量
      this.total = filterData.length

      // 对deptList数据进行分页检索
      this.pageData = filterData.slice(limit * (page - 1), limit * page)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.paging()
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        devName: '',
        devIP: '',
        devType: '',
        devOperator: '',
        devAddress: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
//            savList(this.temp).then(res=>{
          this.deviceList.unshift(this.temp)
          this.handleFilter()
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Created Successfully',
            type: 'success',
            duration: 2000
          })
//            })
//                this.getList();
        }
      })


    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          for (const v of this.deviceList) {
            if (v.id === this.temp.id) {
//                updList(this.temp).then(res=>{
              const index = this.deviceList.indexOf(v)
              this.deviceList.splice(index, 1, this.temp)
              this.handleFilter()
//                })
              break
            }
          }
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
//                this.getList()
        }
      })


    },
    handleDelete(row) {
      this.temp = row // copy obj
      this.dialogDelVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    delData() {
//        delList({id:this.temp.id}).then(res=>{
      this.$notify({
        title: 'Success',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.deviceList.indexOf(this.temp)
      this.deviceList.splice(index, 1)
      this.handleFilter()
      this.dialogDelVisible = false
//            this.getList();
//        })
    }
  }
}
</script>

<style>

</style>

