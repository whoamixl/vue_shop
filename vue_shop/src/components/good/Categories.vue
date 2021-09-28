<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row class="add_button">
        <el-button type="primary">添加分类</el-button>
      </el-row>
      <el-row>
        <tree-table
          :data="cateList"
          :columns="cataColumns"
          :selection-type="false"
          :expand-type="false"
          :show-index="true"
          index-text="#"
          border
          :show-row-hover="false">
<!--          是否有效模板-->
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: green;"></i>
            <i class="el-icon-error" v-else style="color: red;"></i>
          </template>
<!--          排序-->
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>
<!--          操作-->
          <template slot="opt" slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete">删除</el-button>
          </template>
        </tree-table>
      </el-row>
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          layout="total, prev, pager, next, jumper"
          :total="total"
          :page-size="5">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      cateList: [],
      total: 0,
      queryInfo: {
        type: '',
        pagenum: 1,
        pagesize: 5
      },
      cataColumns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        // 指定类型为模板类
        type: 'template',
        // 指定作用域插槽名
        template: 'isok'
      },
      {
        label: '排序',
        // 指定类型为模板类
        type: 'template',
        // 指定作用域插槽名
        template: 'order'
      },
      {
        label: '操作',
        // 指定类型为模板类
        type: 'template',
        // 指定作用域插槽名
        template: 'opt'
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
      this.total = res.data.total
      console.log(this.cateList)
      this.$message.success(res.meta.msg)
    },
    handleCurrentChange(newPg) {
      this.queryInfo.pagenum = newPg
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.add_button{
  margin-bottom: 15px;
}
</style>
