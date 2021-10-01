<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div>
        <el-alert
          title="警告提示的文案"
          type="warning"
          :closable="false"
          show-icon>
        </el-alert>
      </div>
      <div>
        <el-row class="chooseSetParamsItem">
          <el-col :span="2.4" style="font-size: 20px">选择商品类型：</el-col>
          <el-col :span="21.6"> <Cascader>
          </Cascader></el-col>
        </el-row>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="first">
            <el-row>
              <el-col>
                <el-button type="primary" class="addParams">添加参数</el-button>
              </el-col>
            </el-row>
            <el-table>

            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="second">静态属性</el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="less" scoped>
.chooseSetParamsItem{
  margin: 15px 0px
}
</style>
