<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="9" :sm="6" :md="5" :lg="6" :xl="4">
        <div class="head-container">
          <el-input
            v-model="deptNameFilter"
            clearable
            size="small"
            placeholder="输入部门名称\部门编码搜索"
            prefix-icon="el-icon-search"
            class="filter-item"
          />
        </div>
        <el-tree
          ref="tree"
          :data="deptData"
          :props="defaultProps"
          node-key="id"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :xs="15" :sm="18" :md="19" :lg="18" :xl="20">
        <!--内容展示区域-->
        <el-row :gutter="30">
          <el-form ref="elForm" :model="tbSysDept" size="medium" label-width="150px">
            <el-col :span="24">
              <el-row>
                <el-col :span="24">
                  <el-input v-model="tbSysDept.id" type="hidden" :style="{width: '100%'}" />
                </el-col>
                <el-col :span="13">
                  <el-form-item label="部门编码" prop="deptCode">
                    <!-- :maxlength="11" show-word-limit -->
                    <el-input v-model="tbSysDept.deptCode" placeholder="请输入部门编码" clearable prefix-icon="el-icon-c-scale-to-original" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="13">
                  <el-form-item label="部门名称" prop="deptName">
                    <!-- :maxlength="11" show-word-limit -->
                    <el-input v-model="tbSysDept.deptName" placeholder="请输入部门名称" clearable prefix-icon="el-icon-s-home" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="13">
                  <el-form-item label="上级部门编码" prop="parentCode">
                    <el-input v-model="tbSysDept.parentCode" placeholder="请输入上级部门编码" clearable prefix-icon="el-icon-c-scale-to-original" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="13">
                  <el-form-item label="上级部门名称" prop="parentName">
                    <el-input v-model="tbSysDept.parentName" placeholder="请输入上级部门名称" clearable prefix-icon="el-icon-s-home" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="13">
                  <el-form-item class="el-row--flex is-justify-end">
                    <el-button type="success" icon="el-icon-plus" :disabled="deptAddable" @click="showAddDeptDialog">新增子部门</el-button>
                    <el-button type="warning" icon="el-icon-edit" :disabled="deptEditable" @click="editDept">修改部门</el-button>
                    <el-button type="danger" icon="el-icon-delete" :disabled="deptDeletable" @click="deleteDept">删除部门</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-form>
        </el-row>
      </el-col>
    </el-row>
    <el-drawer
      ref="drawer"
      title="新增部门"
      :before-close="cancelSave"
      :visible.sync="addDeptVisible"
      :show-close="false"
    >
      <div>
        <el-form ref="drawerForm" :model="tbSysDeptDrawer" size="medium" label-width="150px">
          <el-col :span="24">
            <el-row>
              <el-col :span="24">
                <el-input v-model="tbSysDeptDrawer.id" type="hidden" :style="{width: '100%'}" />
              </el-col>
              <el-col :span="20">
                <el-form-item label="部门编码" prop="deptCode">
                  <!-- :maxlength="11" show-word-limit -->
                  <el-input v-model="tbSysDeptDrawer.deptCode" placeholder="请输入部门编码" clearable prefix-icon="el-icon-c-scale-to-original" />
                </el-form-item>
              </el-col>
              <el-col :span="20">
                <el-form-item label="部门名称" prop="deptName">
                  <!-- :maxlength="11" show-word-limit -->
                  <el-input v-model="tbSysDeptDrawer.deptName" placeholder="请输入部门名称" clearable prefix-icon="el-icon-s-home" />
                </el-form-item>
              </el-col>
              <el-col :span="20">
                <el-form-item label="上级部门编码" prop="parentCode">
                  <el-input v-model="tbSysDeptDrawer.parentCode" placeholder="请输入上级部门编码" clearable prefix-icon="el-icon-c-scale-to-original" :readonly="true" />
                </el-form-item>
              </el-col>
              <el-col :span="20">
                <el-form-item label="上级部门名称" prop="parentName">
                  <el-input v-model="tbSysDeptDrawer.parentName" placeholder="请输入上级部门名称" clearable prefix-icon="el-icon-s-home" :readonly="true" />
                </el-form-item>
              </el-col>
              <el-col :span="20">
                <el-form-item class="el-row--flex is-justify-center">
                  <el-button type="success" icon="el-icon-check" @click="addOrUpdateDept">保存</el-button>
                  <el-button type="warning" icon="el-icon-close" @click="cancelSave">取消</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { findMultiDeptTree, saveDept, updateDeptById, deleteDeptById } from '@/api/dept'

export default {
  name: 'Dept',
  data() {
    return {
      addDeptVisible: false,
      deptNameFilter: '',
      deptEditable: false,
      deptAddable: false,
      deptDeletable: false,
      tbSysDept: {
        id: -1,
        deptCode: '',
        deptName: '',
        parentCode: '',
        parentName: '',
        parentId: -1
      },
      tbSysDeptDrawer: {
        id: -1,
        deptCode: '',
        deptName: '',
        parentCode: '',
        parentName: '',
        parentId: -1
      },
      deptData: [],
      defaultProps: {
        children: 'children',
        label: 'deptName'
      }
    }
  },
  watch: {
    // 监听文本框中的数据变化，动态过滤部门树
    deptNameFilter(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getDeptMultiTree()
  },
  methods: {
    async getDeptMultiTree() {
      const { data } = await findMultiDeptTree()
      this.deptData = data.records
    },
    filterNode(value, data) {
      // 根据传递过来的值过滤树节点
      return !value ? true : data.deptName.indexOf(value) !== -1
    },
    handleNodeClick({ id, deptCode, deptName, parentCode, parentName, parentId }) {
      // 切换部门
      this.tbSysDept = { id, deptCode, deptName, parentCode, parentName, parentId }
    },
    showAddDeptDialog() {
      if (this.tbSysDept.id === -1) {
        this.$alert('请先选择在哪个部门下添加下级部门', '友情提示', {
          confirmButtonText: '确定'
        })
      } else {
        // 新增部门的数据初始化
        this.tbSysDeptDrawer = JSON.parse(JSON.stringify(this.tbSysDept))
        this.tbSysDeptDrawer.parentCode = this.tbSysDeptDrawer.deptCode
        this.tbSysDeptDrawer.parentName = this.tbSysDeptDrawer.deptName
        this.tbSysDeptDrawer.parentId = this.tbSysDeptDrawer.id
        this.tbSysDeptDrawer.id = -1
        this.tbSysDeptDrawer.deptCode = ''
        this.tbSysDeptDrawer.deptName = ''
        // 按钮，drawer的显示
        this.deptEditable = !this.deptEditable
        this.deptAddable = !this.deptAddable
        this.deptDeletable = !this.deptDeletable
        this.addDeptVisible = true
      }
    },
    async addOrUpdateDept() {
      if (this.tbSysDeptDrawer.id === -1) {
        await saveDept(this.tbSysDeptDrawer).then(({ data }) => {
          this.$message({
            type: 'success',
            message: '部门添加成功!',
            duration: 5 * 1000
          })
          // 根据返回数据的父节点获取到
          const node = this.$refs['tree'].getNode(data.records.parentId)
          // 删除新增节点返回的 children 属性
          delete data.records.children
          delete data.records.deleted
          this.$refs['tree'].append(data.records, node)
        }).catch(e => {
          this.$alert(e.message + '，请联系管理员!!', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
      } else {
        await updateDeptById(this.tbSysDeptDrawer.id, this.tbSysDeptDrawer).then(({ data }) => {
          this.$message({
            type: 'success',
            message: '部门更新成功!',
            duration: 5 * 1000
          })
          // 根据id找到树中的节点
          const node = this.$refs['tree'].getNode(data.records.id)
          // 删除新增节点返回的 children 属性
          node.data.deptName = data.records.deptName
          node.data.deptCode = data.records.deptCode
          this.tbSysDept.deptName = data.records.deptName
          this.tbSysDept.deptCode = data.records.deptCode
        }).catch(e => {
          this.$alert(e.message + '，请联系管理员!!', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
      }
    },
    editDept() {
      if (this.tbSysDept.id === -1) {
        this.$alert('请先在部门树选择要修改的部门', '友情提示', {
          confirmButtonText: '确定'
        })
      } else {
        // object 的深拷贝，避免 tbSysDeptDrawer 的变动引起 tbSysDept 的变动
        this.tbSysDeptDrawer = JSON.parse(JSON.stringify(this.tbSysDept))
        this.deptEditable = !this.deptEditable
        this.deptAddable = !this.deptAddable
        this.deptDeletable = !this.deptDeletable
        this.addDeptVisible = true
      }
    },
    async deleteDept() {
      await this.$confirm('此操作将删除该部门及其下属部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteDeptById(this.tbSysDept.id).then(({ data }) => {
          this.$message({
            type: 'success',
            message: '部门删除成功!',
            duration: 5 * 1000
          })
          // 根据id找到树中的节点
          const node = this.$refs['tree'].getNode(this.tbSysDept.id)
          this.$refs['tree'].remove(node)
          this.initTbSysDept()
        }).catch(e => {
          this.$alert(e.message + '，请联系管理员!!', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
      }).catch(e => {
        return e
      })
    },
    cancelSave() {
      this.initTbSysDeptDrawer()
      this.deptEditable = !this.deptEditable
      this.deptAddable = !this.deptAddable
      this.deptDeletable = !this.deptDeletable
      this.addDeptVisible = false
    },
    initTbSysDeptDrawer() {
      this.tbSysDeptDrawer.id = -1
      this.tbSysDeptDrawer.parentId = -1
      this.tbSysDeptDrawer.deptCode = ''
      this.tbSysDeptDrawer.deptName = ''
      this.tbSysDeptDrawer.parentCode = ''
      this.tbSysDeptDrawer.parentName = ''
    },
    initTbSysDept() {
      this.tbSysDept.id = -1
      this.tbSysDept.parentId = -1
      this.tbSysDept.deptCode = ''
      this.tbSysDept.deptName = ''
      this.tbSysDept.parentCode = ''
      this.tbSysDept.parentName = ''
    }
  }
}
</script>

<style scoped lang="scss">
  .app-container {
    padding: 20px 20px 45px 20px;
  }
  .head-container {
    padding-bottom: 10px;
    .filter-item {
      display: inline-block;
      vertical-align: middle;
      margin: 0 3px 10px 0;
      input {
        height: 30.5px;
        line-height: 30.5px;
      }
    }
    .el-form-item-label {
      margin: 0 3px 9px 0;
      display: inline-block;
      text-align: right;
      vertical-align: middle;
      font-size: 14px;
      color: #606266;
      line-height: 30.5px;
      padding: 0 7px 0 7px;
    }
    .el-button+.el-button {
      margin-left: 0 !important;
    }
    .el-select__caret.el-input__icon.el-icon-arrow-up{
      line-height: 30.5px;
    }
    .date-item {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 10px;
      height: 30.5px !important;
      width: 230px !important;
    }
  }
  .el-range-editor.el-input__inner {
    display: inline-flex !important;
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  :focus{
    outline:0;
  }
</style>
