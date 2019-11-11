
<template>
  <div class="app-container">

    <!--搜索条件区-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.deptName"
        placeholder="部门名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.personCount" class="filter-item" placeholder="人员数量" @change="handleFilter">
        <el-option key="0" value="0" label="&#45;&#45;请选择&#45;&#45;" />
        <el-option v-for="item in personCount" :key="item.key" :value="item.key" :label="item.value" />
      </el-select>

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

    <!--部门数据表格-->
    <el-table v-loading="listLoading" :data="pageData" border>
      <el-table-column sortable prop="id" label="编号" align="center" width="100" />
      <el-table-column sortable prop="peoples" label="人员数量" align="center" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.peoples | hotTagType">{{ scope.row.peoples }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="部门名称" min-width="500" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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

export default {
  components: { Pagination },
  filters: {
    hotTagType(value) {
      return value >= 25 ? 'danger' : (value >= 15 ? 'warning' : 'success')
    }
  },
  data() {
    return {
      // 控制等待画面显示与否
      listLoading: false,

      deviceList: [],
      total: 0,

      // 查询条件
      listQuery: {
        page: 1,
        limit: 10
      },

      // 当前页数据
      pageData: []
    }
  },
  mounted() {
    this.freshList()
  },
  methods: {
    freshList() {

    },

    getList() {

    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }

  }
}
</script>

<style>

</style>

