import request from '@/utils/request'

/**
 * 获取该角色下可以使用的组件信息
 * @param roleNames
 * @returns {AxiosPromise<any>}
 */
export function getComponents(roleNames) {
  return request.post('/components', roleNames)
}

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

/**
 * 获取所有的角色
 * @returns {AxiosPromise}
 */
export function getRoles(roleVo) {
  return request.post('/system/role/', roleVo)
}

export function getMenuIdsByRoleId(id) {
  return request.post('/system/role/roleMenu/' + id)
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}
