import request from '@/utils/request'

export const findDeptTree = () => {
  return request.get('/system/dept/tree')
}
