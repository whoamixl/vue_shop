<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row class="add_button">
        <el-button type="primary" @click="showAddClassify">添加分类</el-button>
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
            <el-button type="primary" size="small" icon="el-icon-edit" @click="showeditCateItem(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="showdeleteCateItem(scope.row)">删除</el-button>
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
<!--    添加商品分类的弹窗-->
    <el-dialog
      title="添加分类"
      :visible.sync="addClassifydialogVisible"
      width="30%"
      >
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <Cascader :data="this.createTreeData(this.parrentCateList, this.cascaderTreeMap)" v-model="selectedData" change-on-select></Cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addClassifydialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

<!--    编辑分类对话框-->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateVisible"
      width="30%"
    >
      <el-form :model="editCate" :rules="addCateFormRules" ref="editCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      cateList: [],
      total: 0,
      addClassifydialogVisible: false,
      editCateVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      parrentCateList: [],
      selectedData: [],
      cascaderTreeMap: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      editCate: {
        id: '',
        cat_name: ''
      },
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
      this.cateList = res.data.result
      this.total = res.data.total

      this.$message.success(res.meta.msg)
    },
    handleCurrentChange(newPg) {
      this.queryInfo.pagenum = newPg
      this.getCateList()
    },
    showAddClassify() {
      this.getParrentCateList()

      this.addClassifydialogVisible = true
    },
    async getParrentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parrentCateList = res.data
      console.log(this.parrentCateList)
    },
    parrentCateChanged() {
    },
    addCate() {
      console.log(this.selectedData)
      this.addCateForm.cat_level = this.selectedData.length
      if (this.selectedData.length === 0) {
        this.addCateForm.cat_pid = 0
      } else {
        this.addCateForm.cat_pid = this.selectedData[this.selectedData.length - 1]
      }
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return this.$message.error('输入的参数有误！')
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        await this.getCateList()
        this.addCateForm.cat_name = ''
        this.selectedData = []
        this.addClassifydialogVisible = false
      })
    },
    createTreeData(tree, cascaderTreeMap) {
      const result = []
      tree.forEach(item => {
        let value = item[cascaderTreeMap.value]
        let label = item[cascaderTreeMap.label]
        let children = item[cascaderTreeMap.children]
        // 如果子节点,递归
        if (children) {
          children = this.createTreeData(children, cascaderTreeMap)
        }
        result.push({ value, label, children })
      })
      return result
    },
    showeditCateItem(item) {
      this.editCateVisible = true
      this.editCate.cat_name = item.cat_name
      this.editCate.id = item.cat_id
    },
    editCateItem() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return this.$message.error('参数填写错误')
        const { data: res } = await this.$http.put(`categories/${this.editCate.id}`, { cat_name: this.editCate.cat_name })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editCateVisible = false
        await this.getCateList()
      })
    },
    showdeleteCateItem(item) {
      this.$confirm('此操作将删除该类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${item.cat_id}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        await this.getCateList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.add_button{
  margin-bottom: 15px;
}
</style>
