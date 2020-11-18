import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条央视
import { getToken } from '@/utils/auth' // 从cookie中获取token，以后要使用后台传送过来的jwt
import getPageTitle from '@/utils/get-page-title'// 获取页面title

NProgress.configure({ showSpinner: false }) // 进度条基本配置

const whiteList = ['/login', '/auth-redirect'] // 不用重定向的白名单，可以在浏览器地址栏直接使用该url
// 对每一次请求都会进行一次过滤
router.beforeEach(async(to, from, next) => {
  // 开始使用进度条
  NProgress.start()

  // 设置dom的title，保证每一次页面跳转都能获取title
  document.title = getPageTitle(to.meta.title)

  // 通过获取token来判断用户是否登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经登录还去login的话直接跳转到 / 路径下
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // 判断该用户是否已经获取其权限（该权限需要提前和path提前进行匹配）
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
