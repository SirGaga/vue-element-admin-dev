import request from '@/utils/request'

/**
 * 用户登录
 * @param data 用户名密码
 * @returns {AxiosPromise<any>}
 */
export function login(data) {
  // 结合了spring security之后必须使用formData来进行登录提交
  const formData = new FormData()
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })
  return request.post('/login', formData)
}

/**
 * 获取用户信息
 * @param token
 * @returns {AxiosPromise<any>}
 */
export function getInfo(token) {
  return request.get('/userInfo')
}

/**
 * 用户退出
 * @returns {AxiosPromise<any>}
 */
export function logout() {
  return request.post('/logout')
}

/**
 * 获取查询列表
 * @param userVo 用户实体
 * @returns {AxiosPromise<any>}
 */
export const findUserList = (userVo) => {
  return request.post('/system/user/', userVo)
}

/**
 * 获取查询列表
 * @param userVo 用户实体
 * @returns {AxiosPromise<any>}
 */
export const checkUserName = (userName) => {
  return request.get('/system/user/checkUserName', {
    params: {
      userName
    }
  })
}
