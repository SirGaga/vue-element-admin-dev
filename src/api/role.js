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

/**
 * 获取所有的角色
 * @returns {AxiosPromise}
 */
export function getRolesAll(roleVo) {
  return request.post('/system/role/all', roleVo)
}

/**
 * 通过角色获取菜单id集合
 * @param id
 * @returns {AxiosPromise<any>}
 */
export function getMenuIdsByRoleId(id) {
  return request.post('/system/role/roleMenu/' + id)
}

/**
 * 保存角色
 * @param role 角色实体
 * @returns {AxiosPromise<any>}
 */
export const saveRole = (role) => {
  return request.post('/system/role/add', role)
}

/**
 * 根据角色id更新角色
 * @param id 角色id
 * @param role 角色实体
 * @returns {AxiosPromise<any>}
 */
export const updateRoleById = (id, role) => {
  return request.put('/system/role/update/' + id, role)
}

/**
 * 根据角色id集合删除角色
 * @param ids id集合
 * @returns {AxiosPromise}
 */
export const deleteRoleByIds = (ids) => {
  return request.delete('/system/role/delete', {
    data: {
      ids
    }
  })
}
