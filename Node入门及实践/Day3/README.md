- [Day3](#Day3)
  - [文件系统](#文件系统)
  - [发送一个简单的 HTTP 请求](#发送一个简单的HTTP请求)

# Day3

## 文件系统

fs 模块是文件操作的封装，它提供了文件的读取、写入、更名、删除、遍历目录、链接等文件系统操作。与其他模块不同的是，fs 模块中所有的操作都提供了`异步`的和`同步`的两个版本，例如读取文件内容的函数有异步的 fs.readFile() 和同步的 fs.readFileSync()

### fs.readFile

fs.readFile(filename,[encoding],[callback(err,data)])是最简单的读取 文件的函数。它接受一个必选参数 filename，表示要读取的文件名。第二个参数 encoding 是可选的，表示文件的字符编码。callback 是回调函数，用于接收文件的内容。

如果不指定 encoding，则 callback 就是第二个参数。回调函数提供两个参数 err 和 data，err 表示有没有错误发生，data 是文件内容。如果指定了 encoding，data 是一个解析后的字符串，否则 data 将会是以 `Buffer` 形式表示的二进制数据。

现在一文本 `pdk.txt`

```javascript
// pdk.txt
Text Content: 我是大帅哥
```

```javascript
var fs = require('fs')

fs.readFile('pdk.txt', function(err, data) {
  if (err) {
    console.error(err)
  } else {
    console.log(data)
  }
})

// 假设 pdk.txt 中的内容是 UTF-8 编码的 Text 文本文件示例，运行结果如下:
<Buffer 54 65 78 74 20 e6 96 87 e6 9c ac e6 96 87 e4 bb b6 e7 a4 ba e4 be 8b>
```

这个程序以二进制的模式读取了文件的内容，data 的值是 Buffer 对象。如果我们给 fs.readFile 的 encoding 指定编码 :

```javascript
var fs = require('fs')

fs.readFile('pdk.txt', 'utf-8', function(err, data) {
  if (err) {
    console.error(err)
  } else {
    console.log(data)
  }
})

// 指定编码，那么结果是
Text Content: 我是大帅哥
```

### fs.readFileSync

fs.readFileSync(filename, [encoding])是 fs.readFile 同步的版本。它接受的参数和 fs.readFile 相同，而读取到的文件内容会以函数返回值的形式返回。如果有错 误发生，fs 将会抛出异常，你需要使用 try 和 catch 捕捉并处理异常。

### fs.open

fs.open(path, flags, [mode], [callback(err, fd)])是 POSIX open 函数的封装, 它接受两个必选参数，path 为文件的路径， flags 可以是以下值。

- r :以读取模式打开文件。

- r+ :以读写模式打开文件。

- w :以写入模式打开文件，如果文件不存在则创建。

- w+ :以读写模式打开文件，如果文件不存在则创建。

- a :以追加模式打开文件，如果文件不存在则创建。

- a+ :以读取追加模式打开文件，如果文件不存在则创建

mode 参数用于创建文件时给文件指定权限，默认是 06661。回调函数将会传递一个文件描述符 fd。文件描述符是一个非负整数，表示操作系统内核为当前进程所维护的打开文件的记录表索引。

### fs.read

fs.read(fd, buffer, offset, length, position, [callback(err, bytesRead, buffer)])是 POSIX read 函数的封装，相比 fs.readFile 提供了更底层的接口。

fs.read 的功能是从指定的文件描述符 fd 中读取数据并写入 buffer 指向的缓冲区对象。offset 是 buffer 的写入偏移量。length 是要从文件中读取的字节数。position 是文件读取的起始 位置，如果 position 的值为 null，则会从当前文件指针的位置读取。回调函数传递 bytesRead 和 buffer，分别表示读取的字节数和缓冲区对象。

## 发送一个简单的 HTTP 请求

## GET 请求

新建两个文件，server.js 和 client.js

```javascript
// server.js

var http = require('http')

http
  .createServer(function(req, res) {
    res.writeHead(200)
    res.end('Hello, world')
  })
  .listen(3001)
```

```javascript
// client.js
var http = require('http')

http
  .request(
    {
      host: 'localhost',
      port: 3001,
      url: '/',
      method: 'GET'
    },
    function(res) {
      var body = ''
      res.setEncoding('utf8')
      res.on('data', function(chunk) {
        body += chunk
      })
      res.on('end', function() {
        console.log('请求得到 : ' + body)
      })
    }
  )
  .end()
```

### POST 请求

```javascript
// server.js

var http = require('http')
var qs = require('querystring')
http
  .createServer(function(req, res) {
    var body = ''
    req.on('data', function(chunk) {
      body += chunk
    })
    req.on('end', function() {
      res.writeHead(200)
      res.end('Done')
      console.log('接受的 name  : ', qs.parse(body).name)
    })
  })
  .listen(3001)
```

```javascript
// client.js
var http = require('http')
var qs = require('querystring')
function send(name) {
  http
    .request(
      {
        host: 'localhost',
        port: 3001,
        url: '/',
        method: 'POST'
      },
      function(res) {
        res.setEncoding('utf8')
        res.on('end', function() {
          console.log('request complete')
          process.stdout.write('\n your name: ')
        })
      }
    )
    .end(
      qs.stringify({
        name: name
      })
    )
}

process.stdout.write('\n your name : ')
process.stdin.resume()
process.stdin.setEncoding('utf-8')
process.stdin.on('data', function(name) {
  console.log('你输入的name是: ', name)
  send(name.replace('\n', ''))
})
```
