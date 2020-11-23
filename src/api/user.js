import request from '@/utils/request'

export function login(data) {
  // 结合了spring security之后必须使用formData来进行登录提交
  const formData = new FormData()
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })
  return request.post('/login', formData)
}

export function getInfo(token) {
  return request.get('/system/user/info')
}

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
