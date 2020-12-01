<template>
  <div>
    <el-dialog :visible.sync="dialogVisibleChild" title="修改用户" @close="close">
      <el-row :gutter="15">
        <el-form ref="elForm" :model="tbSysUser" :rules="rules" size="medium" label-width="100px">
          <el-col :span="24">
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户名" prop="userName">
                  <!-- :maxlength="11" show-word-limit -->
                  <el-input v-model="tbSysUser.userName" placeholder="请输入姓名" clearable prefix-icon="el-icon-user" :style="{width: '100%'}" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="姓名" prop="realName">
                  <!-- :maxlength="11" show-word-limit -->
                  <el-input v-model="tbSysUser.realName" placeholder="请输入姓名" clearable prefix-icon="el-icon-user" :style="{width: '100%'}" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证号码" prop="gmsfhm">
                  <el-input v-model="tbSysUser.gmsfhm" placeholder="请输入身份证号码" clearable prefix-icon="el-icon-user" :style="{width: '100%'}" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="警号" prop="jh">
                  <el-input v-model="tbSysUser.jh" placeholder="请输入警号" clearable prefix-icon="el-icon-user" :style="{width: '100%'}" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="登录密码" prop="pwd">
                  <el-input v-model="tbSysUser.pwd" placeholder="请输入登录密码" clearable prefix-icon="el-icon-user" :style="{width: '100%'}" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <dept-cascader prop="deptCode" :dept-code="deptCode" :dept="dept" :dept-map="deptMap" @handleChange="handleChange" />
              </el-col>
            </el-row>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DeptCascader from '../../../components/Cascader/DeptCascader'
import { updateUserById } from '@/api/user'
import { checkGmsfhm, checkUserName } from '@/api/validate'
import { checkCode, checkDate, isEmpty } from '@/utils/validate'

export default {
  name: 'UserAdd',
  components: {
    DeptCascader
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    deptCode: {
      type: String,
      required: true,
      default: ''
    },
    dept: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    deptMap: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    tbSysUserRow: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisibleChild: this.dialogVisible,
      tbSysUser: this.tbSysUserRow,
      rules: {
        userName: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }, {
          validator: isEmpty,
          trigger: 'blur'
        }, {
          validator: this.checkUserNameDuplicate,
          trigger: 'blur'
        }],
        realName: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }, {
          validator: isEmpty,
          trigger: 'blur'
        }
          // ,{
          //   pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          //   message: '手机号格式错误',
          //   trigger: 'blur'
          // }
        ],
        gmsfhm: [{
          required: true,
          message: '请输入身份证号码',
          trigger: 'blur'
        }, {
          validator: isEmpty,
          trigger: 'blur'
        }, {
          validator: this.checkGmsfhmDuplicate,
          trigger: 'blur'
        }],
        jh: [{
          required: true,
          message: '请输入警号',
          trigger: 'blur'
        }, {
          validator: isEmpty,
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: '请输入登录密码',
          trigger: 'blur'
        }, {
          validator: isEmpty,
          trigger: 'blur'
        }],
        deptCode: [{
          required: true,
          message: '请选择部门',
          trigger: 'blur'
        }, {
          validator: isEmpty,
          trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    // 监听父组件中是否显示窗口的值的变化
    dialogVisible(val) {
      this.dialogVisibleChild = val
    },
    tbSysUserRow(val) {
      this.tbSysUser = val
    }
  },
  methods: {
    async checkUserNameDuplicate(rule, userName, callback) {
      const result = await checkUserName(userName, this.tbSysUserRow.id)
      if (result.success === false) {
        callback(new Error(result.message))
      } else {
        callback()
      }
    },
    async checkGmsfhmDuplicate(rule, gmsfhm, callback) {
      const gmsfhm15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/
      let regResult = false
      if (gmsfhm.trim().length === 0) {
        callback(new Error('请输入身份证号码'))
      }
      if (gmsfhm.length !== 15 && gmsfhm.length !== 18) {
        callback(new Error('请输入正确的公民身份号码'))
      }
      if (gmsfhm.length === 15) {
        regResult = gmsfhm15.test(gmsfhm)
      } else if (gmsfhm.length === 18) {
        regResult = checkCode(gmsfhm) ? checkDate(gmsfhm.substring(6, 14)) : false
      }
      if (regResult) {
        const result = await checkGmsfhm(gmsfhm, this.tbSysUserRow.id)
        if (result.success === false) {
          callback(new Error(result.message))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入正确的公民身份号码'))
      }
    },
    handleChange(value) {
      this.tbSysUser.deptCode = value
      if (value !== '') {
        const element = this.deptMap.filter(e => e.deptCode === value)[0]
        this.tbSysUser.deptName = element.deptName
        this.tbSysUser.deptId = element.id
      }
    },
    close() {
      this.$refs['elForm'].resetFields()
      this.$emit('hideUpdateDialog')
    },
    async handleConfirm() {
      const valid = await this.$refs['elForm'].validate().then(t => {
        return t
      }).catch(e => {
        return e
      })
      if (valid) {
        await updateUserById(this.tbSysUserRow.id, this.tbSysUser).then(() => {
          this.$message({
            type: 'success',
            message: '用户更新成功!',
            duration: 5 * 1000
          })
          this.$emit('getUserList')
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
<style>
</style>
