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
  return request({
    url: '/logout',
    method: 'post'
  })
}
