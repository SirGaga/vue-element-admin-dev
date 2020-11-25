// asyncRoutes,
import { constantRoutes } from '@/router'
import { getComponents } from '@/api/role'
import Layout from '@/layout/index'
const _import = require('@/utils/trans-str-to-component') // 获取组件的方法

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     console.log(route.meta)
//     console.log(route.meta.roles)
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []
//
//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })
//
//   return res
// }

export function filterAsyncRoutes(routes) {
  // 遍历后台传来的路由字符串，转换为组件对象
  return routes.filter(route => {
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
    if (route.children && route.children.length) {
      route.children = filterAsyncRoutes(route.children)
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
      console.log(components)
      const accessedRoutes = filterAsyncRoutes(components.data.records)
      console.log(accessedRoutes)
      // let accessedRoutes
      // eslint-disable-next-line prefer-const
      // accessedRoutes = filterAsyncRoutes(asyncRoutes, components)
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      commit('SET_ROUTES', accessedRoutes)
      console.log(constantRoutes)
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
