const mysql = require('../mysql')

/**
 * @获取token
 */
let getUserToken = user_id => {
  let sql = `SELECT * FROM erek_user WHERE user_id = "${user_id}"`
  return mysql.query(sql)
}

/**
 * @通过token登陆
 */
let accountLoginToken = token => {
  const sql = `SELECT * FROM erek_user WHERE token = "${token}"`
  return mysql.query(sql)
}

module.exports = {
  getUserToken,
  accountLoginToken
}
