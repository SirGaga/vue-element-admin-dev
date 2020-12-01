import request from '@/utils/request'

/**
 * 根据用户填写的用户名判断是否重复
 * @param userName 用户名
 * @param id user主键id
 * @returns {AxiosPromise<any>}
 */
export const checkUserName = (userName, id) => {
  return request.get('/validate/checkUserName', {
    params: {
      userName,
      id
    }
  })
}

/**
 * 根据用户填写的公民身份号码判断是否重复
 * @param gmsfhm 公民身份号码
 * @param id user主键id
 * @returns {AxiosPromise<any>}
 */
export const checkGmsfhm = (gmsfhm, id) => {
  return request.get('/validate/checkGmsfhm', {
    params: {
      gmsfhm,
      id
    }
  })
}
