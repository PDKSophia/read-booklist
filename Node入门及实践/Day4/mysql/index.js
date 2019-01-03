/**
 * 数据库连接
 */
var mysql = require('mysql')
var pool = mysql.createPool({
  host: '127.0.0.1', // 主机，本地的话就填127.0.0.1
  user: '你的用户', // 用户
  password: '你的密码', // 密码
  database: '你的数据库', // 数据库
  port: 3306, // 端口
  debug: true // 是否开启debug
})

module.exports = pool
