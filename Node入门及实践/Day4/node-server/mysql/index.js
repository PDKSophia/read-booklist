/**
 * 数据库连接
 */
var mysql = require('mysql')
var config = require('./default')

var pool = mysql.createPool({
  host: config.database.HOST, // 主机，�本地的话就填127.0.0.1
  user: config.database.USER, // 用户
  password: config.database.PASSWORD, // 密码
  database: config.database.DATABASE, // 数据库
  port: config.port, // 端口
  debug: true // 是否开启debug
})

var query = (sql, value) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        resolve(err)
      } else {
        connection.query(sql, value, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = { pool, query }
