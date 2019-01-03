# Day4

## 前言

《了不起的 Node.js》在第 6 章之后就开始边上手例子边学习了，《Node.js 开发指南》也是在第五章开始做一个 Web 应用，所以我跟着做了一遍，这边就不贴出来了，直接跳过所以书籍中的教程小例子，开始做一个项目吧。这个是我 node 写“校内共享平台”的真实后端代码。很 low，先凑合吧

- [Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin](https://stackoverflow.com/questions/18642828/origin-http-localhost3000-is-not-allowed-by-access-control-allow-origin)

这次自己捣鼓的项目是一个校内共享平台所延伸出来的一个商品平台，采用 Vue + Node Express + Mysql 实现的。可能 Node 这边代码写的会比较 low，理解理解哈，毕竟刚学 Node，后面再慢慢进步哈～

## 后端代码文件架构布局

```
·
├── package-lock.json
|
├── package.json
│
├── node_modules
│
├── app.js
│
└─
```

## 开始手把手搭建一个 node + express + mysql

### 1. 新建后端文件夹，这里我取名叫做 node-server

```javascript
  mkdir node-server
```

### 2. package.json 的配置

新建 package.json

```javascript
  touch package.json
```

加入需要的模块依赖

```json
  1. 编辑修改
  vim package.json
  2. 添加下边的依赖，根据自己需要自己下载
  {
    "name": "node-server",
    "version": "1.0.0",
    "description": "",
    "main": "app.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "cross-env NODE_ENV=production pm2 start app.js --node-args='--harmony' --name 'server'"
    },
    "author": "PDK",
    "license": "ISC",
    "dependencies": {
      "body-parser": "^1.17.1",
      "dotenv": "^4.0.0",
      "express": "^4.15.2",
      "express-formidable": "^1.0.0",
      "express-session": "^1.15.2",
      "express-winston": "^2.3.0",
      "jsonwebtoken": "^7.3.0",
      "mysql": "^2.16.0",
      "mysql-server": "^1.0.5",
      "objectid-to-timestamp": "^1.3.0",
      "winston": "^2.3.1"
    }
  }
```

安装依赖

```javascript
  npm install
```

ok，这时候你的文件夹 node-server 下就会有 node_modules 和 package.json 跟 package-lock.json 文件了

### 3. 新增 app.js

```javascript
/**
 * 模块依赖
 */
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
/**
 * 数据库连接
 */
var mysql = require('mysql')
var pool = mysql.createPool({
  host: 'xxx.xxx.xxx.xxx', // 主机，本地的话就填127.0.0.1
  user: 'root', // 用户
  password: 'root', // 密码
  database: 'erek_market', // 数据库
  port: 3306, // 端口
  debug: true // 是否开启debug
})
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
)
app.use(bodyParser.json())
/**
 * 获取所有用户数据
 */
app.get('/list', function(req, res) {
  pool.getConnection(function(err, connection) {
    connection.query('SELECT * FROM erek_user', function(err, rows) {
      connection.release()
      if (err) throw err
      console.log('长度是 : ', rows.length)
      console.log('数据是 : ', rows)
      res.send(JSON.stringify(rows))
    })
  })
  // res.send('Hello, uyes');
})
/**
 * 跨域
 */
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type') //预检请求使用
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS') //预检请求使用
  next()
})
/**
 * 端口
 */
app.set('port', process.env.PORT || 3009)
app.listen(app.get('port'), function() {
  console.log('Express server is running at : ' + app.get('port'))
})
```

首先我说明一点，我没有在本地装 mysql，用的是我自己远程服务器上的 mysql，其实没区别。这里可能会出现的问题就是 :

- 问题 1 : Can 't connect to local MySQL server through socket '/tmp/mysql.sock '(2) "

- 问题 2 : [Error: connect ECONNREFUSED](https://stackoverflow.com/questions/30266221/node-js-mysql-error-connect-econnrefused) 、[connect ECONNREFUSED 127.0.0.1:3306](https://github.com/mysqljs/mysql/issues/1675)

- 问题 3 : [Host 'xxx.xxx.xxx..xx' is not allowed to connect to this MySQL server](https://blog.csdn.net/EI__Nino/article/details/25069391)、[或者查看这个](https://blog.csdn.net/symoriaty/article/details/78425920)

关于上边的三个问题，我先安装本地 mysql，然后出现第一个问题的时候，好像是套接字啥的问题，我就卸载了，直接连接远程 mysql，如果你有第一个问题，google、百度一下，很多教程。自己解决一下哈

然后我接着遇到了第二个问题，第二个问题我一开始也不知道为什么。然后我就先去看了下 mysql。我远程登陆之后，远程进入 mysql 是 ok 的。然后想起来好像是 “安全组” 没配，于是去配了一下安全组。开放了 3306 端口，这时候我再去 `telnet xxx.xxx.xxx.xxx 3306` 是 ok 的了

接着遇到第三个问题。说我这个 ip 不被允许连接到 mysql，由于我装了 phpmyadmin，所以我直接把用户表的 `Host` 字段改成了 `%` ，因为数据库只允许 `localhost` 的连接。解决方法我上边也给连接了

代码这块，我们这里有一句 `app.get('/list', function(req, res) { }`。通过路由 `localhost:3009/list` 就可以获取到数据了。这里我们启动 app.js

```javascript
  node app.js
```

<div>
  <img src='https://github.com/PDKSophia/read-booklist/raw/master/Node%E5%85%A5%E9%97%A8%E5%8F%8A%E5%AE%9E%E8%B7%B5/node-image/node-4.png' width=800 />
</div>

## 常见问题

- [How to allow CORS ?](https://stackoverflow.com/questions/7067966/how-to-allow-cors#answer-7069902)

- [Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin](https://stackoverflow.com/questions/18642828/origin-http-localhost3000-is-not-allowed-by-access-control-allow-origin)

- [github cors](https://github.com/expressjs/cors)
