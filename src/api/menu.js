import request from '@/utils/request'

/**
 * 获取由后台转义的可以直接使用的树形结构
 * @returns {AxiosPromise<any>}
 */
export const findMultiMenuTree = () => {
  return request.get('/system/menu/tree')
}

/**
 * 保存菜单
 * @param menu 菜单实体
 * @returns {AxiosPromise<any>}
 */
export const saveMenu = (menu) => {
  return request.post('/system/menu/add', menu)
}

/**
 * 更新菜单
 * @returns {AxiosPromise<any>}
 */
export const updateMenuById = (id, menu) => {
  return request.put('/system/menu/update/' + id, menu)
}

/**
 * 删除菜单
 * @returns {AxiosPromise<any>}
 */
export const deleteMenuByIds = (ids) => {
  return request.delete('/system/menu/delete', {
    data: {
      ids: ids
    }
  })
}
