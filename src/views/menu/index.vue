<template>
  <div class="app-container">
    <div class="head-container">
      <div>
        <el-input v-model="condition" clearable size="small" placeholder="请输入菜单名称" style="width: 200px;" class="filter-item" />
        <span>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search">搜索</el-button>
          <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left">重置</el-button>
        </span>
      </div>
      <div class="crud-opts">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
        >
          新增
        </el-button>
        <el-button
          class="filter-item"
          size="mini"
          type="success"
          icon="el-icon-edit"
        >
          修改
        </el-button>
        <el-button
          class="filter-item"
          type="danger"
          icon="el-icon-delete"
          size="mini"
        >
          删除
        </el-button>
        <el-button
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-download"
        >导出</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import { findMultiDeptTree, saveDept, updateDeptById, deleteDeptById } from '@/api/dept'

export default {
  name: 'Dept',
  data() {
    return {
      condition: '',
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

</style>

<style rel="stylesheet/scss" lang="scss">
  :focus{
    outline:0;
  }
</style>
