import request from '@/utils/request'

/**
 * 通过用户id获取改用户被赋予的角色
 * @param userId 用户id
 * @returns 返回数据
 */
export function getRolesByUserId(userId) {
  return request.post('/system/userRole/' + userId)
}

/**
 * 保存用户被授予的角色信息
 * @param curdVo 数据实体
 * @returns 返回数据
 */
export function updateUserRole(curdVo) {
  return request.put('/system/userRole/update', curdVo)
}
