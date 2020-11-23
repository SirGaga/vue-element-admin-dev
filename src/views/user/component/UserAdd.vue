<template>
  <div>
    <el-dialog :visible.sync="dialogVisibleChild" title="新增用户" @close="close">
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="24">
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名" prop="realName">
                  <!-- :maxlength="11" show-word-limit -->
                  <el-input v-model="formData.realName" placeholder="请输入姓名" clearable prefix-icon="el-icon-user" :style="{width: '100%'}" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证号码" prop="gmsfhm">
                  <el-input v-model="formData.gmsfhm" placeholder="请输入身份证号码" clearable prefix-icon="el-icon-user" :style="{width: '100%'}" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="警号" prop="jh">
                  <el-input v-model="formData.jh" placeholder="请输入警号" clearable prefix-icon="el-icon-user" :style="{width: '100%'}" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="登录密码" prop="password">
                  <el-input v-model="formData.password" placeholder="请输入登录密码" clearable prefix-icon="el-icon-user" :style="{width: '100%'}" />
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
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    deptMap: {
      type: Array,
      required: true,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    }
  },
  data() {
    return {
      dialogVisibleChild: this.dialogVisible,
      formData: {
        realName: '',
        gmsfhm: '',
        jh: '',
        password: '',
        deptCode: '',
        deptName: ''
      },
      rules: {
        realName: [{
          required: true,
          message: '请输入姓名',
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
        }],
        jh: [{
          required: true,
          message: '请输入警号',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入登录密码',
          trigger: 'blur'
        }],
        deptCode: [{
          required: true,
          message: '请选择部门',
          trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    // 监听父组件中是否显示窗口的值的变化
    dialogVisible(val) {
      this.dialogVisibleChild = val
    }
  },
  methods: {
    handleChange(value) {
      this.formData.deptCode = value
      if (value !== '') {
        this.formData.deptName = (this.deptMap.filter(e => e.deptCode === value)[0]).deptName
      }
    },
    close() {
      this.$refs['elForm'].resetFields()
      this.$emit('hideDialog')
    },
    async handleConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // 这里需要完善保存用户信息的方法
        console.log(this.formData)
      })
    }
  }
}

</script>
<style>
</style>
