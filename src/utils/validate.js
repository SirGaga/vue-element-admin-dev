import { checkUserName, checkGmsfhm } from '@/api/validate'

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  return typeof str === 'string' || str instanceof String
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 判断是否为空
 * @param arg
 */
export function isEmpty(rule, arg, callback) {
  if (isString(arg)) {
    arg.trim().length > 0 ? callback() : callback(new Error('该字段不可为空，不能包含空格'))
  } else {
    arg.toString().trim().length > 0 ? callback() : callback(new Error('该字段不可为空，不能包含空格'))
  }
}
/**
 * 检查用户名是否重复
 * @param rule
 * @param userName
 * @param callback
 * @returns {Promise<void>}
 */

export async function checkUserNameDuplicate(rule, userName, callback) {
  const result = await checkUserName(userName)
  if (result.success === false) {
    callback(new Error(result.message))
  } else {
    callback()
  }
}

export function checkDate(val) {
  const pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/
  if (pattern.test(val)) {
    const year = val.substring(0, 4)
    const month = val.substring(4, 6)
    const date = val.substring(6, 8)
    const date2 = new Date(year + '-' + month + '-' + date)
    if (date2 && date2.getMonth() === (parseInt(month) - 1)) {
      return true
    }
  }
  return false
}

export function checkCode(val) {
  const p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
  const code = val.substring(17)
  if (p.test(val)) {
    let sum = 0
    for (var i = 0; i < 17; i++) {
      sum += val[i] * factor[i]
    }
    if (parity[sum % 11].toString() === code.toUpperCase()) {
      return true
    }
  }
  return false
}

/**
 * 检查gmsfhm是否重复
 * @param rule
 * @param gmsfhm
 * @param callback
 * @returns {Promise<void>}
 */
export async function checkGmsfhmDuplicate(rule, gmsfhm, callback) {
  const gmsfhm15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/
  let regResult = false
  if (gmsfhm.trim().length === 0) {
    callback(new Error('请输入身份证号码'))
  }
  if (gmsfhm.length !== 15 && gmsfhm.length !== 18) {
    callback(new Error('请输入正确的公民身份号码'))
  }
  if (gmsfhm.length === 15) {
    regResult = gmsfhm15.test(gmsfhm)
  } else if (gmsfhm.length === 18) {
    regResult = checkCode(gmsfhm) ? checkDate(gmsfhm.substring(6, 14)) : false
  }
  if (regResult) {
    const result = await checkGmsfhm(gmsfhm)
    if (result.success === false) {
      callback(new Error(result.message))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入正确的公民身份号码'))
  }
}
