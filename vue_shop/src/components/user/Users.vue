<template>
  <div>
<!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图区域-->
    <el-card class="box-card">
<!--        搜索区域-->
        <el-row :gutter=20>
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>

<!--      表格区域-->
      <el-table border
        :data="userList"
        style="width: 100%">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column prop="username"
          label="姓名">
        </el-table-column>
        <el-table-column prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column
          label="状态">
          <template v-slot="scrop">
            <el-switch
              v-model="scrop.row.mg_state" @change="changeUserState(scrop.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="left"
          label="操作">
          <template v-slot="scope">
<!--            修改按钮-->
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
<!--            删除按钮-->
            <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
<!--            分配角色按钮-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
<!--    添加用户对话框-->
      <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
          width="50%"
          @close="addDialogClose"
          >
          <span>
            <el-form :model="addInfo" :rules="addInfoRules" ref="addInfoRuleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addInfo.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addInfo.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addInfo.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input v-model="addInfo.mobile"></el-input>
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
      </el-dialog>
<!--    修改用户对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="EditdialogVisible"
      width="50%"
      >
      <span>
        <el-form :model="editInfo" :rules="editInfoRules" ref="editInfoRuleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="用户名">
                <el-input v-model="editInfo.username" disabled></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="editInfo.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input v-model="editInfo.mobile"></el-input>
              </el-form-item>
            </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    // 验证邮箱的校验规则
    var checkEmai = (rule, value, cb) => {
      const regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证电话的校验规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的电话'))
    }

    return {
      queryInfo: {
        'query': '',
        // 当前的页数
        'pagenum': 1,
        // 每页的条数
        'pagesize': 2
      },

      addInfo: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },

      editInfo: {

      },

      addInfoRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmai, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      editInfoRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmai, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      userList: [],
      total: 0,
      addDialogVisible: false,
      EditdialogVisible: false
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
      console.log(this.userList)
      console.log(this.total)
    },
    // 监听pagesize的改变
    handleSizeChange(newSZ) {
      // console.log(newSZ)
      this.queryInfo.pagesize = newSZ
      this.getUserList()
    },
    // 监听页码值的变化
    handleCurrentChange(newPG) {
      // console.log(newPG)
      this.queryInfo.pagenum = newPG
      this.getUserList()
    },
    // 监听switch开关状态的改变
    async changeUserState(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('修改状态失败')
        // this.getUserList()
      }
      return this.$message.success('修改状态成功')
    },

    addUser() {
      this.$refs.addInfoRuleForm.validate(async valid => {
        if (!valid) return console.log('aaaaaaaaaaaaaaaaaa')
        const { data: res } = await this.$http.post('users', this.addInfo)
        if (res.meta.status !== 201) {
          console.log('dddddddddddddd')
          return this.$message.error('添加用户失败')
        } else {
          console.log('sssssss')
          this.$message.success('添加用户成功')
          this.getUserList()
          this.addDialogVisible = false
        }
      })
    },

    // 监听添加用户对话框的关闭事件
    addDialogClose() {
      this.$refs.addInfoRuleForm.resetFields()
    },

    showEditDialog(data) {
      this.editInfo = data
      console.log(this.editInfo)
      this.EditdialogVisible = true
    },

    editUser() {
      this.$refs.editInfoRuleForm.validate(async valid => {
        if (!valid) return console.log('aaaaaaaaaaaaaaaaaa')
        const { data: res } = await this.$http.put('users/' + this.editInfo.id, {
          email: this.editInfo.email,
          mobile: this.editInfo.mobile
        })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户失败')
          // this.getUserList()
        }
        this.EditdialogVisible = false
        return this.$message.success('修改用户成功')
        // eslint-disable-next-line no-unreachable
        await this.getUserList()
      })
    },
    deleteUser(userId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { data: res } = await this.$http.delete(`users/${userId}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.queryInfo.pagenum = 1
        this.getUserList()
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

</style>
