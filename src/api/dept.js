import request from '@/utils/request'

/**
 * 获取部门线性结构信息，再通过js方法转成树形结构供页面使用
 * @returns {AxiosPromise<any>}
 */
export const findDeptTree = () => {
  return request.get('/system/dept/tree')
}

/**
 * 获取由后台转义的可以直接使用的树形结构
 * @returns {AxiosPromise<any>}
 */
export const findMultiDeptTree = () => {
  return request.get('/system/dept/multiTree')
}
