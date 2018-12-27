/**
 * 模块依赖
 */
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
/**
 * 数据库连接
 */
var mysql = require('mysql');
var pool = mysql.createPool({
  host: 'xx.xxx.xxx.xx',
  user: 'root',
  password: 'root',
  database: 'erek_market',
  port: 3306,
  debug: true
});

/**
 * 1 . 确保自己服务器的3306端口是打开的，也就是安全组的配置，以及修改 /etc/mysql/mysql.conf/mysql.conf， 将 bind_address 127.0.0.1 注释掉
 * 2 . 如果还是没能连接，登陆mysql，因为可能mysql只允许localhost域登陆。不允许 ip xxx.xx.xx.xx 登陆，这时候只需要将mysql user表的 localhost 改为 % 就好了
 */

/**
 * 中间件
 */
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

/**
 * 获取所有用户数据
 */
app.get('/list', function(req, res) {
  pool.getConnection(function(err, connection) {
    connection.query('SELECT * FROM erek_user', function(err, rows) {
      connection.release();
      if (err) throw err;
      console.log('长度是 : ', rows.length);
      console.log('数据是 : ', rows);
      res.send(JSON.stringify(rows));
    });
  });
  // res.send('Hello, uyes');
});

/**
 * 跨域
 */
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type'); //预检请求使用
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS'); //预检请求使用
  next();
});

/**
 * 端口
 */
app.set('port', process.env.PORT || 3009);
app.listen(app.get('port'), function() {
  console.log('Express server is running at : ' + app.get('port'));
});
