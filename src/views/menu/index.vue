<template>
  <div class="app-container">
    <div class="head-container">
      <div>
        <el-input v-model="nameFilter" clearable size="small" placeholder="请输入菜单名称" style="width: 200px;" class="filter-item" />
        <span>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="menuTableFilter">搜索</el-button>
          <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="resetTableFilter">重置</el-button>
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
          type="danger"
          icon="el-icon-delete"
          size="mini"
        >
          删除
        </el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table
      ref="roleTable"
      :data="roleData"
      row-key="id"
      :tree-props="{children: 'children',hasChildren: 'hasChildren'}"
      @select="selectChange"
      @select-all="selectAllChange"
      @selection-change="selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" label="菜单标题" width="165px" prop="name" />
      <el-table-column prop="icon" label="图标" align="center" width="60px">
        <template slot-scope="scope">
          <i v-if="scope.row.icon && scope.row.icon.indexOf('el-icon') !== -1" :class="scope.row.icon"/>
          <svg-icon v-else :icon-class="scope.row.icon ? scope.row.icon : ''" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" align="center" label="排序">
        <template slot-scope="scope">
          {{ scope.row.orderNum }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="path" label="组件路径" />
      <el-table-column prop="hidden" label="可见" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.hidden">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="155px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" size="small" icon="el-icon-edit" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" size="small" icon="el-icon-delete" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { findMultiMenuTree } from '@/api/menu'

export default {
  name: 'Dept',
  data() {
    return {
      nameFilter: '',
      idField: 'id',
      roleData: [],
      selections: [],
      defaultProps: {
        children: 'children',
        hasChildren: 'hasChildren'
      }
    }
  },
  watch: {
    // 监听文本框中的数据变化，动态过滤菜单树
    // nameFilter(val) {
    //   console.log(this.filterData(val))
    // }
  },
  created() {
    this.getMenuMultiTree()
  },
  methods: {
    async getMenuMultiTree() {
      const { data } = await findMultiMenuTree()
      this.roleData = data.records
    },
    getDataId(data) {
      return data[this.idField]
    },
    /**
     * 用于树形表格多选，单选的封装
     * @param selection
     * @param row
     */
    selectChange(selection, row) {
      // 如果selection中存在row代表是选中，否则是取消选中
      if (selection.find(val => { return this.getDataId(val) === this.getDataId(row) })) {
        if (row.children) {
          row.children.forEach(val => {
            this.$refs['roleTable'].toggleRowSelection(val, true)
            selection.push(val)
            if (val.children) {
              this.selectChange(selection, val)
            }
          })
        }
      } else {
        this.toggleRowSelection(selection, row)
      }
    },
    /**
     * 切换选中状态
     * @param selection
     * @param data
     */
    toggleRowSelection(selection, data) {
      if (data.children) {
        data.children.forEach(val => {
          this.$refs['roleTable'].toggleRowSelection(val, false)
          if (val.children) {
            this.toggleRowSelection(selection, val)
          }
        })
      }
    },
    selectAllChange(selection) {
      // 如果选中的数目与请求到的数目相同就选中子节点，否则就清空选中
      if (selection && selection.length === this.roleData.length) {
        selection.forEach(val => {
          this.selectChange(selection, val)
        })
      } else {
        this.$refs['roleTable'].clearSelection()
      }
    },
    selectionChangeHandler(selection) {
      this.selections = selection
    },
    menuTableFilter() {
      // 获取到最新数据
      this.getMenuMultiTree().then(() => {
        this.roleData = this.filter(this.roleData, this.nameFilter)
      })
    },
    resetTableFilter() {
      this.getMenuMultiTree()
      this.nameFilter = ''
    },
    filter(nodes, query) {
      // 条件就是节点的title过滤关键字
      const predicate = function(node) {
        return node.name.indexOf(query) > -1
      }
      if (!(nodes && nodes.length)) {
        return []
      }
      const newChildren = []
      for (const node of nodes) {
        // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
        // 1. 子孙节点中存在符合条件的，即 subs 数组中有值
        // 2. 自己本身符合条件
        const subs = this.filter(node.children, query)
        if (predicate(node)) {
          newChildren.push(node)
        } else if (subs && subs.length) {
          node.children = subs
          newChildren.push(node)
        }

        // 以下只需要考虑自身的节点满足条件即可,不用带上父节点
        // if (predicate(node)) {
        //   newChildren.push(node)
        //   node.children = this.filter(node.children, query)
        // } else {
        //   newChildren.push(...this.filter(node.children, query))
        // }
      }
      return newChildren.length ? newChildren : []
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
