import request from '@/utils/request'

/**
 * 根据用户填写的用户名判断是否重复
 * @param userName 用户名
 * @returns {AxiosPromise<any>}
 */
export const checkUserName = (userName) => {
  return request.get('/validate/checkUserName', {
    params: {
      userName
    }
  })
}

/**
 * 根据用户填写的公民身份号码判断是否重复
 * @param gmsfhm 公民身份号码
 * @returns {AxiosPromise<any>}
 */
export const checkGmsfhm = (gmsfhm) => {
  return request.get('/validate/checkGmsfhm', {
    params: {
      gmsfhm
    }
  })
}
