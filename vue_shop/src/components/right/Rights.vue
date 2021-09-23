<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table
        :data="RightsList"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          style="width: 10%">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          style="width: 30%">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
          style="width: 30%">
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级">
          <template v-slot="scope">
            <el-tag :type="RightsTypeMap[scope.row.level.toString()]">{{ RightsMap[scope.row.level.toString()] }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      RightsList: {

      },
      RightsMap: {
        0: '一级',
        1: '二级',
        2: '三级'
      },
      RightsTypeMap: {
        0: '',
        1: 'success',
        2: 'warning'
      }
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取列表失败')
      this.RightsList = res.data
      console.log(this.RightsList)
    }
  }
}

</script>

<style scoped>

</style>
