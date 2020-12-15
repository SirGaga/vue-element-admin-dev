import request from '@/utils/request'

/**
 * 保存角色和菜单的授权信息
 * @param roleMenuVo 角色和菜单的关联信息
 * @returns {AxiosPromise<any>}
 */
export function saveRoleMenu(roleMenuVo) {
  return request.post('/system/roleMenu/add', roleMenuVo)
}
