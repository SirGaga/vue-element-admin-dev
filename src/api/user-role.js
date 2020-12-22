import request from '@/utils/request'

/**
 * 通过用户id获取改用户被赋予的角色
 * @param userId 用户id
 * @returns 返回数据
 */
export function getRolesByUserId(userId) {
  return request.post('/system/userRole/' + userId)
}
