<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-button type="primary">添加分类</el-button>
      </el-row>
      <el-row>
        <tree-table :data="cateList" :columns="cataColumns"></tree-table>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: '',
        pagenum: 1,
        pagesize: 5
      },
      cataColumns: [{
        label: '分类名称',
        prop: 'cat_name'
      }]
    }
  },
  created() {
    this.getCateList()
  },

  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res)
      this.cateList = res.data.result
      console.log(this.cateList)
      this.$message.success(res.meta.msg)
    }
  }
}
</script>

<style scoped>

</style>
