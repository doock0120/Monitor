<template>
  <div class="area">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="5" style="padding-top: 20px" :offset="18">
            <el-select v-model="topoNum" class="filter-item" placeholder="机房选择" @change="handleFilter">
              <el-option key="0" label="-请选择-" :value="0" />
              <el-option v-for="item in topos" :key="item.key" :value="item.key" :label="item.value" />
            </el-select>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="20" :offset="1">
            <img src="../../../public/XSK.jpg" alt="新时空机房" v-show="topoNum==1">
            <img src="../../../public/XDF.jpg" alt="新东方机房" v-show="topoNum==2">
            <img src="../../../public/XSJ.jpg" alt="新世界机房" v-show="topoNum==3">
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        topoNum:1,
        topos: [
          { key: 1, value: '新时空机房' },
          { key: 2, value: '新东方机房' },
          { key: 3, value: '新世界机房' }
        ]
      }
    }
  }

</script>

<style>

</style>
