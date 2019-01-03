const code = require('../utils/code')
const express = require('express')
const router = express.Router()
const pool = require('../mysql')

/**
 * 获取token
 */
router.post('/user/login', function(req, res) {
  const sql = `SELECT * FROM user WHERE user_id = "${req.body.user_id}"`
  pool.getConnection(function(err, connection) {
    connection.query(sql, function(error, rows) {
      connection.release()
      if (error) throw error
      if (rows.length === 0) {
        res.json({
          code: code.NOT_FOUND_USER,
          msg: '用户不存在',
          data: null
        })
      } else {
        const result = {
          user_id: rows[0].user_id,
          token: rows[0].token
        }
        res.json({
          code: code.LOGIN_SUCCESS_CODE,
          msg: '登陆成功',
          data: result
        })
      }
    })
  })
})

/**
 * @通过token登陆
 */
router.get('/user/auth_token', function(req, res) {
  const sql = `SELECT * FROM user WHERE token = "${
    req.headers['x-auth-token']
  }"`
  pool.getConnection(function(err, connection) {
    connection.query(sql, function(error, rows) {
      connection.release()
      if (error) throw error
      if (rows.length === 0) {
        res.json({
          code: code.USER_NO_AUTHORITY,
          msg: '无权限',
          data: null
        })
      } else {
        res.json({
          code: code.AUTH_TOKEN_SUCCESS,
          msg: '获取用户信息成功',
          data: rows[0]
        })
      }
    })
  })
})

/**
 * 获取所有用户数据
 */
router.get('/user/list', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  pool.getConnection(function(err, connection) {
    connection.query('SELECT * FROM user', function(error, rows) {
      connection.release()
      if (error) throw error
      res.send(JSON.stringify(rows))
    })
  })
})
module.exports = router
