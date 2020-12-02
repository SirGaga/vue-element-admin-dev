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
                    <el-input v-model="tbSysDept.deptCode" placeholder="请输入部门编码" clearable prefix-icon="el-icon-c-scale-to-original" />
                  </el-form-item>
                </el-col>
                <el-col :span="13">
                  <el-form-item label="部门名称" prop="deptName">
                    <!-- :maxlength="11" show-word-limit -->
                    <el-input v-model="tbSysDept.deptName" placeholder="请输入部门名称" clearable prefix-icon="el-icon-s-home" />
                  </el-form-item>
                </el-col>
                <el-col :span="13">
                  <el-form-item label="上级部门编码" prop="parentCode">
                    <el-input v-model="tbSysDept.parentCode" placeholder="请输入上级部门编码" clearable prefix-icon="el-icon-c-scale-to-original" />
                  </el-form-item>
                </el-col>
                <el-col :span="13">
                  <el-form-item label="上级部门名称" prop="parentName">
                    <el-input v-model="tbSysDept.parentName" placeholder="请输入上级部门名称" clearable prefix-icon="el-icon-s-home" />
                  </el-form-item>
                </el-col>
                <el-col :span="13">
                  <el-form-item class="el-row--flex is-justify-end">
                    <el-button type="success" icon="el-icon-plus" @click="addDept">新增子部门</el-button>
                    <el-button type="warning" icon="el-icon-edit" @click="editDept">修改部门</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="deleteDept">删除部门</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-form>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { findMultiDeptTree } from '@/api/dept'

export default {
  name: 'Dept',
  data() {
    return {
      deptNameFilter: '',
      tbSysDept: {
        id: -1,
        deptCode: '',
        deptName: '',
        parentCode: '',
        parentName: ''
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
    append(data) {
      const newChild = { id: this.id++, deptName: 'newDeptName', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    handleNodeClick({ id, deptCode, deptName, parentCode, parentName }) {
      // 切换部门
      this.tbSysDept = { id, deptCode, deptName, parentCode, parentName }
    },
    addDept() {
      console.log('add')
    },
    editDept() {
      console.log('edit')
    },
    deleteDept() {
      console.log('delete')
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
