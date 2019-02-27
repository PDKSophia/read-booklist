---
title: 图解HTTP - 打卡第二天
date: 2018-11-13 15:32:05
tags: card-2、简单了解HTTP协议
---

# 图解 HTTP

## Chapter Two

### HTTP 协议用于客户端和服务器端之间的通信

什么叫做客户端 ? 请求访问文本或图像等资源的一端称为客户端

什么叫服务器端 ? 提供资源响应的一端称为服务器端

在两台计算机之间使用 HTTP 协议通信时，一定有一端是客户端，另一端是服务器端

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-8.png' width=550 height=300>

### 通过请求和响应的交换达成通信

请求必定是由客户端发出，服务器端回复响应。换句话说 : <strong>由客户端发起请求建立通信，服务器端在没有接受到请求之前，是不会发送响应端</strong>

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-9.png' width=700 height=350>

下面是从客户端发送给某个 HTTP 服务器端的请求报文中的内容

```javascript
  GET /index.htm HTTP/1.1
  Host: hackr.jp
```

从上述图片来看，客户端发送请求，请求内容的意思是 : 请求访问某台 HTTP 服务器上的 /index.htm 页面资源

那么，<strong>HTTP 请求报文的格式是由什么构成的呢？</strong>

答案就是 : 请求方法 + 请求 URI + 协议版本 + 可选的请求首部字段 + 内容实体

服务器在接收到请求之后，会将请求内容的处理结果以响应的形式返回

```javascript
  HTTP/1.1 200 OK
  Date: Tue, 10 Jul 2018 16:46:21 GMT
  Content-Length: 362
  Content-Type: text/html

  <html>
  ...
```

下边就讲一下上边各字段的含义

- HTTP/1.1 表示服务器对应的 HTTP 版本

- 200 OK 表示请求处理的[状态码](https://github.com/PDKSophia/blog.io/blob/master/%E5%89%8D%E7%AB%AF%E9%9D%A2%E8%AF%95-HTML%E7%AF%87.md#http-%E7%8A%B6%E6%80%81%E7%A0%81)和原因短语

- Date: 创建响应的日期时间，是首部字段内的一个属性

- Content-Length: HTTP 消息实体的传输长度

- Content-Type: 表示具体请求中的媒体类型信息

- 之后的内容，称为资源实体的主体

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-10.png' width=700 height=350>

常见的媒体格式类型如下：

- text/html ： HTML 格式
- text/plain ：纯文本格式
- text/xml ： XML 格式
- image/gif ：gif 图片格式
- image/jpeg ：jpg 图片格式
- image/png：png 图片格式

以 application 开头的媒体格式类型：

- application/xhtml+xml ：XHTML 格式
- application/xml ： XML 数据格式
- application/atom+xml ：Atom XML 聚合格式
- application/json： JSON 数据格式
- application/pdf：pdf 格式
- application/msword ： Word 文档格式
- application/octet-stream ： 二进制流数据（如常见的文件下载）
- application/x-www-form-urlencoded ： `<form encType=””>`中默认的 encType，form 表单数据被编码为 key/value 格式发送到服务器（表单默认的提交数据的格式）

另外一种常见的媒体格式是上传文件之时使用的：

- multipart/form-data ： 需要在表单中进行文件上传时，就需要使用该格式

### HTTP 是不保存状态的协议

也就是说是<strong>无状态协议</strong>, HTTP 协议自身不对请求和响应之间的通信状态进行保存。协议对于发送过的请求或者响应不做持久化处理

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-11.png' width=650 height=320>

HTTP/1.1 中，虽然是无状态协议，但是，为了实现保持状态功能，于是引入了 Cookie 技术。有了 Cookie 之后，再用 HTTP 协议通信，就可以管理状态了

### 告知服务器意图的 HTTP 方法

HTTP/1.1 协议中共定义了八种方法，来表明 Request-URL 指定的资源不同的操作方式

- `GET`: 获取资源，向特定的资源发出请求。它本质就是发送一个请求来取得服务器上的某一资源。资源通过一组 HTTP 头和呈现数据（如 HTML 文本，或者图片或者视频等）返回给客户端。GET 请求中，永远不会包含呈现数据。GET 会将请求的参数数据放在 url 地址中

- `POST`: 传输实体主体，向指定资源提交数据进行处理请求，POST 请求可能会导致新的资源的建立和/或已有资源的修改。 POST 不会将请求的参数数据放在 url 地址中

- `PUT`: 传输文件，可以这么理解，向指定资源位置上传其最新内容，一般用于更新

- `DELETE`: 请求服务器删除 Request-URL 所标识的资源，与 PUT 是相反的方法

- `OPTIONS`: 询问支持的请求方法。也可以利用向 web 服务器发送 ‘\*’ 的请求来测试服务器的功能性

- `HEAD`: 向服务器索与 GET 请求相一致的响应，只不过响应体将不会被返回。这一方法可以再不必传输整个响应内容的情况下，就可以获取包含在响应小消息头中的元信息

- `TRACE`: 让 Web 服务器将之前的请求通信环回给客户端，主要用于测试或诊断

- `CONNECT`: 利用隧道协议连接代理。主要使用 SSL 和 TLS 协议把通信内容加密后经网络隧道传输

### 持久连接节省通信量

由于每次 HTTP 通信都要经过 TCP 三次握手连接，在当年的通信情况来说，不存在什么大问题，但对于现在来讲，问题是大大滴

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-12.png' width=550 height=310>

所以在 HTTP/1.1 中，提出了持久连接的方法，也就是通过 `keep-alive: true`，持久连接的特点是 : 只要任意一端没有明确提出断开连接，则保持 TCP 连接状态

持久连接的好处就是 : <strong>减少了 TCP 连接的重复建立和断开所造成的额外开销，减轻了服务器端的负载。另外，减少开销的那部分时间，使 HTTP 请求和响应能更早得结束，提高 Web 页面的显示速度</strong>

持久连接使得多数请求以`管线化`方式放松成为可能。从前发送请求都需要等到服务器响应之后，才能发下一个请求，但是管线化技术不需要！！！
