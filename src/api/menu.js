import request from '@/utils/request'

/**
 * 获取由后台转义的可以直接使用的树形结构
 * @returns {AxiosPromise<any>}
 */
export const findMultiMenuTree = () => {
  return request.get('/system/menu/tree')
}
