<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <dept-cascader :dept-code="userVo.deptCode" :dept="formInline.dept" :dept-map="formInline.deptMap" @handleChange="handleChange" />
        <el-form-item label="用户名">
          <el-input v-model="userVo.userName" clearable placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="userVo.realName" clearable placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="公民身份号码">
          <el-input v-model="userVo.gmsfhm" clearable placeholder="请输入公民身份号码" />
        </el-form-item>
        <el-form-item label="警号">
          <el-input v-model="userVo.jh" clearable placeholder="请输入警号" />
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="userVo.status" clearable placeholder="请选择用户状态">
            <el-option
              v-for="item in formInline.statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh" @click="resetUserVo">重置</el-button>
          <el-button type="primary" icon="el-icon-search" @click="getUserList">查询</el-button>
          <el-button type="success" icon="el-icon-plus" @click="showDialog">添加</el-button>
          <el-button icon="el-icon-download" @click="onSubmit">导出</el-button>
        </el-form-item>
      </el-form>
      <!--  表格内容显示区域    -->
      <el-table
        :data="tableData"
        border
        style="width: 100%;"
        max-height="890"
      >
        <el-table-column
          type="index"
          label="#"
          :index="indexMethod"
        />
        <el-table-column
          prop="userName"
          label="用户名"
          width="180"
        />
        <el-table-column
          prop="realName"
          label="姓名"
          width="180"
        />
        <el-table-column
          prop="jh"
          label="警号"
          width="180"
        />
        <el-table-column
          prop="gmsfhm"
          label="公民身份号码"
          width="200"
        />

        <el-table-column
          prop="deptName"
          label="部门名称"
          width="500"
        />

        <el-table-column
          prop="lastLoginIp"
          label="最后登录地址"
          width="120"
        />
        <el-table-column
          prop="status"
          label="是否禁用"
          width="120"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#eeeeee"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="权限" placement="top">
              <el-button type="warning" size="small" icon="el-icon-s-tools" @click="handlePermission(scope.$index, scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="padding-top: 15px"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20, 50, 100,200,1000]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <user-add :dialog-visible="dialogVisible" :dept-code="userVo.deptCode" :dept="formInline.dept" :dept-map="formInline.deptMap" @hideDialog="hideDialog" />
    </el-card>
  </div>
</template>

<script>
import { findUserList } from '@/api/user'
import DeptCascader from '../../components/Cascader/DeptCascader'
import { findDeptTree } from '@/api/dept'
import UserAdd from './component/UserAdd'
import { listConvertTree } from '@/utils/array-list'

export default {
  name: 'User',
  components: {
    DeptCascader,
    UserAdd
  },
  data() {
    return {
      dialogVisible: false,
      userVo: {
        userName: '',
        deptName: '',
        realName: '',
        deptCode: '',
        status: '',
        jh: '',
        gmsfhm: '',
        current: 1,
        size: 20
      },
      formInline: {
        deptMap: [],
        statusOptions: [{
          value: '',
          label: '全部'
        }, {
          value: '0',
          label: '有效'
        }, {
          value: '1',
          label: '禁用'
        }],
        dept: []
      },
      tableData: [],
      currentPage: 1,
      total: 1,
      pageSize: 20
    }
  },
  // Vue生命周期函数，在组件被创建的时候进行执行，
  // 在这里可以执行一些数据初始化的操作
  created() {
    this.getUserList()
    this.getDeptList()
  },
  methods: {
    async getUserList() {
      this.userVo.size = this.pageSize
      this.userVo.current = this.currentPage
      const { data } = await findUserList(this.userVo)
      console.log(data)
      // 使用es6的数据解构语法是这样写，
      // 代表的是定义一个常量，这个常量自动接收返回数据中的data属性的值
      // const {data} = await findUserList();
      this.total = data.total
      this.tableData = data.records
    },
    async getDeptList() {
      const { data } = await findDeptTree()
      this.formInline.deptMap = data.records
      const root = listConvertTree(this.formInline.deptMap)
      this.formInline.dept = root.children
    },
    onSubmit() {
      console.log('submit!')
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUserList()
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + (index + 1)
    },
    handleChange(value) {
      this.userVo.deptCode = value
      // console.log(this.deptCode,value);
      // 这里待完善 根据value获取对应的deptName
      // 主要是清空存在问题
      // if (value !== null){
      //   console.log((this.deptMap.filter(e => e.deptCode===value)[0]).deptName);
      // }
    },
    // 这里获取到的value是最终选中的节点按照层级组成的数组
    resetUserVo() {
      this.userVo.deptCode = ''
      this.userVo.userName = ''
      this.userVo.deptName = ''
      this.userVo.gmsfhm = ''
      this.userVo.jh = ''
      this.userVo.realName = ''
      this.userVo.status = ''
    },
    showDialog() {
      this.dialogVisible = true
    },
    hideDialog() {
      this.dialogVisible = false
    },
    // 处理编辑 后台传入id，然后查询出来信息后返回弹框中
    handleEdit(index, row) {
      console.log(index, row)
    },
    // 处理删除，后台传入id，然后重新按照初始化的分页进行查询
    handleDelete(index, row) {
      console.log(index, row)
    },
    // 处理权限配置，后台传入id，然后级联获取权限信息，返回弹窗
    handlePermission(index, row) {
      console.log(index, row)
    }
  }
}
</script>

<style scoped>
</style>
