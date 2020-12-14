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
          @click="addMenu"
        >
          新增
        </el-button>
        <el-button
          class="filter-item"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="toDelete"
        >
          删除
        </el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table
      ref="menuTable"
      :data="menuData"
      row-key="id"
      :tree-props="{children: 'children',hasChildren: 'hasChildren'}"
      @select="selectChange"
      @select-all="selectAllChange"
      @selection-change="selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" label="菜单标题" width="165px" prop="label" />
      <el-table-column prop="icon" label="图标" align="center" width="60px">
        <template slot-scope="scope">
          <i v-if="scope.row.icon && scope.row.icon.indexOf('el-icon') !== -1" :class="scope.row.icon" />
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
            <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--表单渲染-->
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="680px" @close="close">
      <el-form ref="menuForm" :inline="true" :model="menuForm" size="small" label-width="80px">
        <el-input v-model="menuForm.id" type="hidden" />
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="menuForm.type" size="mini" style="width: 178px">
            <el-radio-button label="0">目录</el-radio-button>
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="menuForm.type.toString() !== '2'" label="菜单图标" prop="icon">
          <el-popover
            placement="bottom-start"
            width="550"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <icon-select ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="menuForm.icon" style="width: 450px;" placeholder="点击选择图标" readonly>
              <i v-if="menuForm.icon && menuForm.icon.indexOf('el-icon') !== -1" slot="prefix" :class="menuForm.icon+ ' el-input__icon'" />
              <svg-icon v-else-if="menuForm.icon && menuForm.icon.indexOf('el-icon') === -1" slot="prefix" :icon-class="menuForm.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item v-show="menuForm.type.toString() !== '2'" label="菜单可见" prop="hidden">
          <el-radio-group v-model="menuForm.hidden" size="mini">
            <el-radio-button label="0">是</el-radio-button>
            <el-radio-button label="1">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="menuForm.type.toString() === '1'" label="固钉" prop="affix">
          <el-radio-group v-model="menuForm.affix" size="mini">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="menuForm.type.toString() !== '2'" label="菜单标题" prop="title">
          <el-input v-model="menuForm.title" style="width: 450px" placeholder="菜单标题" />
        </el-form-item>
        <el-form-item v-if="menuForm.type.toString() === '2'" label="按钮名称" prop="title">
          <el-input v-model="menuForm.title" placeholder="按钮名称" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path">
          <el-input v-model="menuForm.path" placeholder="路由地址" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="menuSort">
          <el-input-number v-model.number="menuForm.orderNum" :min="0" :max="999" controls-position="right" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-show="menuForm.type.toString() === '1'" label="组件名称" prop="componentName">
          <el-input v-model="menuForm.name" style="width: 178px;" placeholder="匹配组件内Name字段" />
        </el-form-item>
        <el-form-item v-show="menuForm.type.toString() === '1'" label="组件路径" prop="component">
          <el-input v-model="menuForm.component" style="width: 178px;" placeholder="组件路径" />
        </el-form-item>
        <el-form-item label="上级类目" prop="pid">
          <treeselect
            v-model="menuForm.parentId"
            :options="treeSelectData"
            searchable
            style="width: 450px;"
            placeholder="选择上级类目"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findMultiMenuTree, saveMenu, updateMenuById, deleteMenuByIds } from '@/api/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect'

export default {
  name: 'Dept',
  components: { IconSelect, Treeselect },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      nameFilter: '',
      idField: 'id',
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        path: [{ required: true, message: '请输入路径', trigger: 'blur' }]
      },
      menuForm: {
      },
      menuPrepared: {
        type: 0,
        icon: '',
        hidden: 0,
        affix: 0,
        name: '',
        title: '',
        path: '',
        parentId: 0,
        orderNum: 0,
        component: '',
        id: -1
      },
      menuData: [],
      treeSelectData: [],
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
    this.menuForm = JSON.parse(JSON.stringify(this.menuPrepared))
  },
  methods: {
    async getMenuMultiTree() {
      const { data } = await findMultiMenuTree()
      this.menuData = data.records
      // 构建树形结构
      const root = { id: 0, parentId: null, children: [], label: '菜单树' }
      root.children = this.filterAttrNull(JSON.parse(JSON.stringify(data.records)))
      // 为treeselect组件准备数据
      this.treeSelectData = []
      this.treeSelectData.push(root)
    },
    getDataId(data) {
      return data[this.idField]
    },
    // 用于树形表格多选，单选的封装
    selectChange(selection, row) {
      // 如果selection中存在row代表是选中，否则是取消选中
      if (selection.find(val => { return this.getDataId(val) === this.getDataId(row) })) {
        if (row.children) {
          row.children.forEach(val => {
            this.$refs['menuTable'].toggleRowSelection(val, true)
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
    // 切换选中状态
    toggleRowSelection(selection, data) {
      if (data.children) {
        data.children.forEach(val => {
          this.$refs['menuTable'].toggleRowSelection(val, false)
          if (val.children) {
            this.toggleRowSelection(selection, val)
          }
        })
      }
    },
    selectAllChange(selection) {
      // 如果选中的数目与请求到的数目相同就选中子节点，否则就清空选中
      if (selection && selection.length === this.menuData.length) {
        selection.forEach(val => {
          this.selectChange(selection, val)
        })
      } else {
        this.$refs['menuTable'].clearSelection()
      }
    },
    selectionChangeHandler(selection) {
      this.selections = selection
    },
    menuTableFilter() {
      // 获取到最新数据
      this.getMenuMultiTree().then(() => {
        this.menuData = this.filter(this.menuData, this.nameFilter)
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
    },
    selected(name) {
      this.menuForm.icon = name
    },
    addMenu() {
      this.dialogTitle = '新增菜单'
      this.dialogVisible = true
      this.saveOrUpdate = 'save'
    },
    close() {
      this.saveOrUpdate = ''
      this.menuForm = JSON.parse(JSON.stringify(this.menuPrepared))
      this.dialogVisible = false
    },
    async submit() {
      if (this.menuForm.id === -1) {
        await saveMenu(this.menuForm).then(() => {
          this.$message({
            type: 'success',
            message: '菜单添加成功!',
            duration: 5 * 1000
          })
          this.getMenuMultiTree()
          this.close()
        }).catch(e => {
          this.$alert(e.message + '，请联系管理员!!', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
      } else {
        await updateMenuById(this.menuForm.id, this.menuForm).then(() => {
          this.$message({
            type: 'success',
            message: '菜单添加成功!',
            duration: 5 * 1000
          })
          this.getMenuMultiTree()
          this.close()
        }).catch(e => {
          this.$alert(e.message + '，请联系管理员!!', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
      }
    },
    filterAttrNull(tree) {
      // 遍历后台传来的路由字符串，转换为组件对象
      return tree.filter(node => {
        // 如果meta属性是空值需要删除route中的meta属性
        if (node.children === null) {
          delete node.children
        } else if (node.children && node.children.length) {
          node.children = this.filterAttrNull(node.children)
        }
        return node.type !== '2'
      })
    },
    handleEdit(index, row) {
      this.saveOrUpdate = 'update'
      this.dialogTitle = '更新菜单'
      this.menuForm = row
      this.menuForm.title = row.title
      this.menuForm.component = row.component
      this.dialogVisible = true
    },
    toDelete() {
      if (this.selections && this.selections.length) {
        this.$confirm(`确认删除选中的${this.selections.length}条数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMenuByIds(this.selections.map(e => this.getDataId(e)))
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getMenuMultiTree()
            }).catch()
        }).catch(e => {
          this.$alert(e.message + '，请联系管理员!!', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
      } else {
        this.$alert('请选择要删除的菜单', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
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
