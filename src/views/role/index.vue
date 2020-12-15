<template>
  <div class="app-container">
    <div class="head-container">
      <div>
        <el-input v-model="listQuery.nameFilter" clearable size="small" placeholder="请输入角色名称" style="width: 200px;" class="filter-item" />
        <span>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="roleTableFilter">搜索</el-button>
          <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="resetTableFilter">重置</el-button>
        </span>
      </div>
      <div class="crud-opts">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addRole"
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
    <!-- 表单渲染 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="520px" @close="close">
      <el-form ref="roleForm" :inline="true" :model="roleForm" size="small" label-width="80px">
        <el-input v-model="roleForm.id" type="hidden" />
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" style="width: 380px;" />
        </el-form-item>
        <el-form-item label="角色中文" prop="roleNameCh">
          <el-input v-model="roleForm.roleNameCh" style="width: 380px;" />
        </el-form-item>
        <el-form-item label="描述信息" prop="roleRemark">
          <el-input v-model="roleForm.roleRemark" style="width: 380px;" rows="5" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table
            ref="roleTable"
            highlight-current-row
            style="width: 100%;"
            :data="roles"
            @selection-change="selectionChangeHandler"
            @current-change="handleCurrentChange"
          >
            <!--:selectable="checkboxT"-->
            <el-table-column type="selection" width="55" />
            <el-table-column prop="roleName" label="名称" />
            <el-table-column prop="roleNameCh" label="中文名称" />
            <!--<el-table-column prop="dataScope" label="数据权限" />-->
            <!--<el-table-column prop="level" label="角色级别" />-->
            <el-table-column :show-overflow-tooltip="true" prop="roleRemark" label="描述" />
            <el-table-column :show-overflow-tooltip="true" width="135px" prop="createTime" label="创建日期">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getRolesPage" />
        </el-card>
      </el-col>
      <!-- 菜单授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              :disabled="!showButton"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
            >保存</el-button>
          </div>
          <el-tree
            ref="menu"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            accordion
            show-checkbox
            check-strictly
            node-key="id"
            @check="menuChange"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { findMultiMenuTree } from '@/api/menu'
import { getRoles, saveRole, updateRoleById, deleteRoleByIds } from '@/api/role'
import Pagination from '@/components/Pagination'
import { saveRoleMenu } from '@/api/role-menu'

export default {
  name: 'Role',
  components: {
    Pagination
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      idField: 'id',
      selections: [],
      showButton: false,
      rolePrepared: {
        id: -1,
        roleName: '',
        roleNameCh: '',
        roleRemark: ''
      },
      roleForm: {},
      menus: [],
      menuIds: [],
      currentId: '',
      roles: [],
      total: 0,
      listQuery: {
        nameFilter: '',
        page: 1,
        limit: 20
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.roleForm = JSON.parse(JSON.stringify(this.rolePrepared))
    this.getMenuMultiTree()
    this.getRolesPage()
  },
  methods: {
    async getMenuMultiTree() {
      const { data } = await findMultiMenuTree()
      this.menus = data.records
    },
    async getRolesPage() {
      const { data } = await getRoles(this.listQuery)
      this.total = data.total
      this.roles = data.records
    },
    roleTableFilter() {
      this.menuIds = []
      this.$refs.menu.setCheckedKeys(this.menuIds)
      this.listQuery.page = 1
      this.getRolesPage()
    },
    resetTableFilter() {
      this.listQuery.nameFilter = ''
      this.roleTableFilter()
    },
    addRole() {
      this.dialogTitle = '新增菜单'
      this.dialogVisible = true
    },
    async toDelete() {
      if (this.selections && this.selections.length) {
        await this.$confirm(`确认删除选中的${this.selections.length}条数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRoleByIds(this.selections.map(e => this.getDataId(e)))
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.menuIds = []
              this.$refs.menu.setCheckedKeys(this.menuIds)
              this.getRolesPage()
            }).catch(e => {
              this.$alert(e.message + '，请联系管理员!!', '提示', {
                confirmButtonText: '确定',
                type: 'error'
              })
            })
        }).catch(() => {
        })
      } else {
        this.$alert('请选择要删除的菜单', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    handleEdit(index, row) {
      this.dialogTitle = '更新菜单'
      this.roleForm = row
      this.dialogVisible = true
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
    // 切换选中状态
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
      if (selection && selection.length === this.roles.length) {
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
    // 触发单选
    async handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 清空菜单的选中
        this.$refs.menu.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        // 初始化默认选中的key
        this.menuIds = []
        if (val.menuId && val.menuId.length) {
          val.menuId.split(',').forEach(data => {
            _this.menuIds.push(parseInt(data))
          })
        }
        this.showButton = true
      }
    },
    // 保存菜单
    async saveMenu() {
      const role = { roleId: this.currentId, menuIds: [] }
      // 得到已选中的 key 值
      this.menuIds.forEach(id => {
        role.menuIds.push(id)
      })
      // 调用后台方法进行角色-菜单的保存
      await saveRoleMenu(role)
        .then(() => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.getRolesPage()
        }).catch(e => {
          this.$alert(e.message + '，请联系管理员!!', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    },
    menuChange(menu) {
      // 获取该节点的所有子节点，id 包含自身
      this.filter(JSON.parse(JSON.stringify(this.menus)), menu.id)
      this.$refs.menu.setCheckedKeys(this.menuIds)
    },
    filter(array, nodeId) {
      for (let index = 0; index < array.length; index++) {
        const element = array[index]
        if (element.id === nodeId) {
          this.menuIds.indexOf(element.id) !== -1 ? this.menuIds.splice(this.menuIds.indexOf(element.id), 1) : this.menuIds.push(element.id)
          // 判断element.children是对象
          if (element.children !== null && element.children && element.children.length) {
            // 查找叶子节点
            this.parseChildren(element.children)
          }
        } else {
          // 判断element.children是对象
          if (element.children !== null && element.children && element.children.length) {
            // 继续遍历子节点查找当前nodeId
            this.filter(element.children, nodeId)
          }
        }
      }
    },
    parseChildren(array) {
      for (let index = 0; index < array.length; index++) {
        const element = array[index]
        this.menuIds.indexOf(element.id) !== -1 ? this.menuIds.splice(this.menuIds.indexOf(element.id), 1) : this.menuIds.push(element.id)
        // 1.判断element.children是对象
        if (element.children !== null && element.children && element.children.length) {
          this.parseChildren(element.children)
        }
      }
    },
    close() {
      this.roleForm = JSON.parse(JSON.stringify(this.rolePrepared))
      this.dialogVisible = false
    },
    async submit() {
      if (this.roleForm.id === -1) {
        await saveRole(this.roleForm).then(() => {
          this.$message({
            type: 'success',
            message: '角色添加成功!',
            duration: 5 * 1000
          })
          this.getRolesPage()
          this.close()
        }).catch(e => {
          this.$alert(e.message + '，请联系管理员!!', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
      } else {
        await updateRoleById(this.roleForm.id, this.roleForm).then(() => {
          this.$message({
            type: 'success',
            message: '角色更新成功!',
            duration: 5 * 1000
          })
          this.getRolesPage()
          this.close()
        }).catch(e => {
          this.$alert(e.message + '，请联系管理员!!', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.role-span {
  font-weight: bold;color: #303133;
  font-size: 15px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__multi-value{
  margin-bottom: 0;
}
::v-deep .vue-treeselect__multi-value-item{
  border: 0;
  padding: 0;
}
</style>
