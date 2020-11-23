<template>
  <el-form-item label="部门" prop="deptCode">
    <el-cascader
        v-model="deptCodeChild"
        :options="dept"
        ref="cascader"
        clearable
        filterable
        :show-all-levels="false"
        :props="{ expandTrigger: 'hover',checkStrictly: true, emitPath: false, value: 'deptCode', label: 'deptName'}"
        @change="handleChange">
      <template slot-scope="{ node, data }">
        <span>{{ data.deptName }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template>
    </el-cascader>
  </el-form-item>
</template>

<script>
export default {
  name: "DeptCascader",
  props: {
    deptCode: {
      type: String,
      required: true,
      default: ''
    },
    dept: {
      type: Array,
      required: true,
      default: []
    },
    deptMap: {
      type: Array,
      required: true,
      default: []
    }
  },
  data() {
    return {
      deptCodeChild: this.deptCode,
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('handleChange',value===null?'':value);
      // console.log(this.deptCode,value);
      // 这里待完善 根据value获取对应的deptName
      // 主要是清空存在问题
      // if (value !== null){
      //   console.log((this.deptMap.filter(e => e.deptCode===value)[0]).deptName);
      // }
    }
  }
}
</script>

<style scoped>

</style>