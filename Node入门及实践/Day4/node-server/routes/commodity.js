const code = require('../utils/code')
const express = require('express')
const router = express.Router()
const url = require('url')
const commoModal = require('../model/commodity')

/**
 * @分类获取所有商品数据
 * @param {String} type
 * @param {String} pageNum
 * @param {String} pageSize
 */
router.get('/commodity/list/cate', async (req, res) => {
  const { pageNum, pageSize, type } = url.parse(req.url, true).query
  var startCount = pageNum === 1 ? 0 : (pageNum - 1) * pageSize
  var endCount = pageNum * pageSize
  await commoModal
    .getListByCate(type, startCount, endCount)
    .then(response => {
      if (response.length === 0) {
        res.json({
          code: code.FETCH_COMMODITY_NO_CONTENT,
          msg: '暂无更多商品信息',
          data: []
        })
      } else {
        res.json({
          code: code.FETCH_COMMODITY_LIST_SUCCESS,
          msg: `为您更新${response.length}条记录~`,
          data: response
        })
      }
    })
    .catch(error => {
      throw new Error(error)
    })
})

/**
 * 顺序获取所有商品数据
 * @param {String} sort
 * @param {String} pageNum
 * @param {String} pageSize
 */
router.get('/commodity/list/sort', async (req, res) => {
  const { pageNum, pageSize, sort } = url.parse(req.url, true).query
  var startCount = pageNum === 1 ? 0 : (pageNum - 1) * pageSize
  var endCount = pageNum * pageSize
  await commoModal
    .getListBySort(sort, startCount, endCount)
    .then(response => {
      if (response.length === 0) {
        res.json({
          code: code.FETCH_COMMODITY_NO_CONTENT,
          msg: '暂无更多商品信息',
          data: []
        })
      } else {
        res.json({
          code: code.FETCH_COMMODITY_LIST_SUCCESS,
          msg: `为您更新${response.length}条记录~`,
          data: response
        })
      }
    })
    .catch(error => {
      throw new Error(error)
    })
})

/**
 * 根据common_id获取商品详情
 * @param {Number} common_id
 */
router.get('/commodity/find', async (req, res) => {
  const { common_id } = url.parse(req.url, true).query
  await commoModal
    .getCommodityID(common_id)
    .then(response => {
      res.json({
        code: code.FETCH_FIND_COMMODITY_SUCCESS,
        msg: `获取商品详情成功`,
        data: response[0]
      })
    })
    .catch(error => {
      throw new Error(error)
    })
})

module.exports = router
