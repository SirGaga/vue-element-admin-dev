// asyncRoutes,
import { constantRoutes } from '@/router'
import { getComponents } from '@/api/role'
import Layout from '@/layout/index'
const _import = require('@/utils/trans-str-to-component_' + process.env.NODE_ENV) // 获取组件的方法

export function filterAsyncRoutes(routes) {
  // 遍历后台传来的路由字符串，转换为组件对象
  return routes.filter(route => {
    // 如果meta属性是空值需要删除route中的meta属性
    if (route.meta === null) {
      delete route.meta
    }
    if (route.component) {
      if (route.component === 'Layout') { // Layout组件特殊处理
        route.component = Layout
      } else {
        route.component = _import(route.component)
      }
    }
    // 通过route的children属性判断是否需要进行迭代
    // 如果children属性是空值（主要是后台数据传递转换成json时没有将null值属性去掉）删除该属性
    if (route.children && route.children.length) {
      route.children = filterAsyncRoutes(route.children)
    } else {
      delete route.children
    }
    return true
  })
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}
// 这里需要将传递过来的路由数据转换成组件的形式然后添加到 asyncRoutes 中添加完成后返回出去
const actions = {
  generateRoutes({ commit }, components) {
    return new Promise(resolve => {
      // 解析组件json数组，获取根据component获取到组件
      const accessedRoutes = filterAsyncRoutes(components.data.records)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  async getComponents({ commit }, roleNames) {
    const components = await getComponents(roleNames)
    return components
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
