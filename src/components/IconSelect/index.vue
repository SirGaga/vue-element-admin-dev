<!-- @author ZhangJie -->
<template>
  <div class="icon-body">
    <el-input v-model="name" style="position: relative;" clearable placeholder="请输入图标名称" @clear="filterIcons" @input.native="filterIcons">
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <el-tabs type="border-card">
      <el-tab-pane label="svg图标">
        <div class="icon-list">
          <div v-for="(item, index) in iconList" :key="index" class="icon-item" @click="selectedIcon(item)" >
            <svg-icon :icon-class="item" style="height: 30px;width: 16px;" />
            <span>{{ item }}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="内置图标">
        <div class="icon-list">
          <div v-for="(item, index) in elementIconList" :key="index" class="icon-item" @click="selectedIcon('el-icon-'+ item)">
            <i :class="'el-icon-' + item" style="height: 30px;width: 16px;" />
            <span>{{ item }}</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import icons from '@/components/IconSelect/requireIcons'
import elementIcons from '@/components/IconSelect/element-icons'
export default {
  name: 'IconSelect',
  data() {
    return {
      name: '',
      iconList: icons,
      elementIconList: elementIcons
    }
  },
  methods: {
    filterIcons() {
      this.iconList = icons
      this.elementIconList = elementIcons
      if (this.name) {
        this.iconList = this.iconList.filter(item => item.includes(this.name))
        this.elementIconList = this.elementIconList.filter(item => item.includes(this.name))
      }
    },
    selectedIcon(name) {
      this.$emit('selected', name)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.iconList = icons
      this.elementIconList = elementIcons
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .icon-body {
    width: 100%;
    padding: 10px;
    .icon-list {
      height: 400px;
      overflow-y: scroll;
      div {
        height: 30px;
        line-height: 30px;
        margin-bottom: -5px;
        cursor: pointer;
        width: 33%;
        float: left;
      }
      .icon-item {
        height: 85px;
        text-align: center;
        float: left;
        font-size: 30px;
        color: #24292e;
        cursor: pointer;
      }
      span {
        display: block;
        font-size: 16px;
        margin-top: 10px;
      }
    }
  }
</style>
