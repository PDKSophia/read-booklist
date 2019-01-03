const code = require('../utils/code')
const express = require('express')
const router = express.Router()
const pool = require('../mysql')
const url = require('url')

/**
 * 分类获取所有商品数据
 * @param {Object} type
 */
router.get('/commodity/list/cate', function(req, res) {
  const { pageNum, pageSize, type } = url.parse(req.url, true).query
  var sql = ''
  var startCount = pageNum === 1 ? 0 : (pageNum - 1) * pageSize
  var endCount = pageNum * pageSize
  sql = `SELECT * FROM commodity WHERE kind = "${type}" AND state != "FINISH" ORDER BY time Desc LIMIT ${startCount}, ${endCount}`
  pool.getConnection(function(err, connection) {
    connection.query(sql, function(error, rows) {
      if (error) throw error
      else if (rows.length === 0) {
        res.json({
          code: code.FETCH_COMMODITY_NO_CONTENT,
          msg: '暂无更多商品信息',
          data: []
        })
      } else {
        res.json({
          code: code.FETCH_COMMODITY_LIST_SUCCESS,
          msg: `为您更新${rows.length}条记录~`,
          data: rows
        })
      }
    })
    connection.release()
  })
})

/**
 * 顺序获取所有商品数据
 * @param {Object} sort
 */
router.get('/commodity/list/sort', function(req, res) {
  const { pageNum, pageSize, sort } = url.parse(req.url, true).query
  var sql = ''
  var startCount = pageNum === 1 ? 0 : (pageNum - 1) * pageSize
  var endCount = pageNum * pageSize
  // 热度
  if (sort === 'VIEW') {
    sql = `SELECT * FROM commodity WHERE state != "FINISH" ORDER BY time Desc LIMIT ${startCount}, ${endCount}`
  } else if (sort === 'TIME') {
    sql = `SELECT * FROM commodity WHERE state != "FINISH" ORDER BY view Desc LIMIT ${startCount}, ${endCount}`
  }
  pool.getConnection(function(err, connection) {
    connection.query(sql, function(error, rows) {
      if (error) throw error
      else if (rows.length === 0) {
        res.json({
          code: code.FETCH_COMMODITY_NO_CONTENT,
          msg: '暂无更多商品信息',
          data: []
        })
      } else {
        res.json({
          code: code.FETCH_COMMODITY_LIST_SUCCESS,
          msg: `为您更新${rows.length}条记录~`,
          data: rows
        })
      }
    })
    connection.release()
  })
})

/**
 * 根据common_id获取商品详情
 * @param {Number} common_id
 */
router.get('/commodity/find', function(req, res) {
  const { commo_id } = url.parse(req.url, true).query
  const sql = `SELECT * FROM commodity WHERE id = ${commo_id}`
  pool.getConnection(function(err, connection) {
    connection.query(sql, function(error, rows) {
      if (err) throw error
      else if (rows.length === 0) {
        res.json({
          code: code.FETCH_FIND_COMMODITY_FAIL,
          msg: '获取商品详情失败',
          data: []
        })
      } else {
        res.json({
          code: code.FETCH_FIND_COMMODITY_SUCCESS,
          msg: `获取商品详情成功`,
          data: rows[0]
        })
      }
    })
  })
})
module.exports = router
