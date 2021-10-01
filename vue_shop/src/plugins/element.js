import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message, Container, Aside, Main, Header,
  Menu, MenuItem, Submenu, MenuItemGroup, Breadcrumb, BreadcrumbItem,
  Card, Table, TableColumn, Switch, Tooltip, Row, Col, Pagination, Dialog, MessageBox,
  Tag, Tree, Select, Option, Alert, Tabs, TabPane
} from 'element-ui'
// eslint-disable-next-line camelcase
import { Table as Table_iview, Cascader } from 'iview'

Vue.component('Table', Table_iview)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Row)
Vue.use(Col)
Vue.component(Pagination.name, Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.component('Cascader', Cascader)
Vue.component('el-alert', Alert)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
