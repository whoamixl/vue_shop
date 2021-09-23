<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addRoleVisible = true">添加角色</el-button>
      <el-table
        :data="rolesList"
        border
        style="width: 100%">
        <el-table-column type="expand">
        </el-table-column>
        <el-table-column
          type="index"
          style="width: 10%">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          style="width: 30%">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          style="width: 30%">
        </el-table-column>
        <el-table-column
          prop="level"
          label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--    添加角色对话框-->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleVisible"
      width="50%"
      @closed="addRoleClose"
    >
          <span>
            <el-form :model="addRoleInfo" :rules="addInfoRules" ref="addRoleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="角色名称" prop="rolename">
                <el-input v-model="addRoleInfo.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roledescribe">
                <el-input v-model="addRoleInfo.roleDesc"></el-input>
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addRoleVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {

      rolesList: {

      },

      addRoleVisible: false,

      addRoleInfo: {
        roleName: '',
        roleDesc: ''
      },

      addInfoRules: {
        rolename: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roledescribe: [
          { required: false, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
  },

  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('请求角色列表失败')
      this.rolesList = res.data
    },

    addRoleClose() {
      this.addRoleInfo.roleName = ''
      this.addRoleInfo.roleDesc = ''
      this.$refs.addRoleForm.resetFields()
      console.log('sssssssssssss')
    },

    addRole() {
      this.$refs.addRoleForm.validate(async valid => {
        if (!valid) return console.log('aaaaaaaaaaaaa')
        const { data: res } = await this.$http.post('roles', this.addRoleInfo)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
        this.addRoleVisible = false
        await this.getRolesList()
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
