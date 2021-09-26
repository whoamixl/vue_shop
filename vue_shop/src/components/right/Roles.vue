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
<!--        渲染角色权限列表-->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row align="middle" type="flex" :class="['bdbottom',r1 === 0 ? 'bdtop' : '']" v-for="(right1, r1) in scope.row.children" :key="right1.id">
<!--              渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="cancelUerRole(scope.row, right1.id )">
                  {{right1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
<!--              渲染二三级权限-->
              <el-col :span="19">
<!--                通过for循环嵌套渲染二级权限-->
                <el-row :class="[r2===0?'':'bdtop']" v-for="(right2, r2) in right1.children" :key="right2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="cancelUerRole(scope.row, right2.id )">
                      {{right2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(right3, r3) in right2.children" :key="right3.id" closable @close="cancelUerRole(scope.row, right3.id )">
                        {{right3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
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
            <el-button type="primary" icon="el-icon-edit" @click="getEditUser(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="getRightsListTree(scope.row)">分配权限</el-button>
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
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addRoleInfo.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addRoleInfo.roleDesc"></el-input>
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addRoleVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
          </span>
    </el-dialog>

<!--    //编辑角色对话框-->
      <el-dialog
      title="编辑角色"
      :visible.sync="editRoleVisible"
      width="50%"
      @close="editRoleClose"
    >
          <span>
            <el-form :model="editRoleInfo" :rules="addInfoRules" ref="editRoleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="editRoleInfo.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="editRoleInfo.roleDesc"></el-input>
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editRoleVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRole">确 定</el-button>
          </span>
      </el-dialog>

<!--    分配权限对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="rightConifVisible"
      width="30%"
      @close="clearLeafKeys"
      >
      <span>
<!--                :default-expanded-keys="[105]"-->
        <el-tree
        :data="rightsListTree"
        show-checkbox
        node-key="id"
        :default-checked-keys="leafKeys"
        :props="treeProps"
        :default-expand-all="true"
        ref="treeRef"
        >
        </el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightConifVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {

      rolesList: [],
      rightsListTree: [],
      // 树形结构的嵌套属性绑定
      treeProps: {
        'label': 'authName',
        'children': 'children'
      },
      leafKeys: [],

      addRoleVisible: false,
      editRoleVisible: false,
      rightConifVisible: false,

      // 即将分配权限的角色ID
      roleId: '',

      addRoleInfo: {
        roleName: '',
        roleDesc: ''
      },

      editRoleInfo: {

      },

      addInfoRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
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
      this.$refs.addRoleForm.resetFields()
    },

    editRoleClose() {
      this.$refs.editRoleForm.resetFields()
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
    },

    getEditUser(data) {
      this.editRoleInfo = data
      this.editRoleVisible = true
    },

    editRole() {
      this.$refs.editRoleForm.validate(async valid => {
        if (!valid) return this.$message.error('格式错误')
        const { data: res } = await this.$http.put('roles/' + this.editRoleInfo.id, {
          roleName: this.editRoleInfo.roleName,
          roleDesc: this.editRoleInfo.roleDesc
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        await this.getRolesList()
        this.editRoleVisible = false
      })
    },

    deleteRole(roleId) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { data: res } = await this.$http.delete(`roles/${roleId}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.getRolesList()
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
    },
    cancelUerRole(role, rightId) {
      this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        role.children = res.data
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
    },

    async getRightsListTree(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取列表失败')
      this.rightsListTree = res.data
      console.log(res.data)
      this.getLeafKeys(role, this.leafKeys)
      this.rightConifVisible = true
    },

    // 通过递归的形式获取角色下三级权限的id值保存到leafKeys对象
    getLeafKeys(node, arr) {
      // 如果当前节点下没有children属性，就说明是第三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归item
      node.children.forEach(item =>
        this.getLeafKeys(item, arr))
    },

    clearLeafKeys() {
      this.leafKeys = []
    },

    async allotRights() {
      const treeKeysArr = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const keysArrStr = treeKeysArr.toString()
      console.log(keysArrStr)
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: keysArrStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.rightConifVisible = false
      await this.getRolesList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}

.bdtop{
  border-top: 1px solid #eee;
}

.bdbottom{
  border-bottom: 1px solid #eee;
}
</style>
