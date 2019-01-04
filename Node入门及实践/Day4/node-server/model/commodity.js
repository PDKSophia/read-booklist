const mysql = require('../mysql');

/**
 * @分类获取所有商品数据
 * @param {String} type
 * @param {String} pageNum
 * @param {String} pageSize
 */
let getListByCate = (type, startCount, endCount) => {
  const sql = `SELECT * FROM erek_commodity WHERE kind = "${type}" AND state != "FINISH" ORDER BY time Desc LIMIT ${startCount}, ${endCount}`;
  return mysql.query(sql);
};

/**
 * @顺序获取所有商品数据
 * @param {String} sort
 * @param {String} pageNum
 * @param {String} pageSize
 */
let getListBySort = (sort, startCount, endCount) => {
  var sql = '';
  // 热度
  if (sort === 'VIEW') {
    sql = `SELECT * FROM erek_commodity WHERE state != "FINISH" ORDER BY time Desc LIMIT ${startCount}, ${endCount}`;
  } else if (sort === 'TIME') {
    sql = `SELECT * FROM erek_commodity WHERE state != "FINISH" ORDER BY view Desc LIMIT ${startCount}, ${endCount}`;
  }
  return mysql.query(sql);
};

/**
 * @根据common_id获取商品详情
 * @param {Number} common_id
 */
let getCommodityID = common_id => {
  const sql = `SELECT * FROM erek_commodity WHERE id = ${common_id}`;
  return mysql.query(sql);
};
module.exports = {
  getListByCate,
  getListBySort,
  getCommodityID
};
