---
title: 图解HTTP - 打卡第六天
date: 2018-11-16 14:02:05
tags: card-6

---

# 图解HTTP 

## Chapter Nine

### 消除HTTP瓶颈的SPDY

在一些 facebook 等网站上，几乎能实时看到海量用户公开发布的内容，当几百、几千万的用户发布内容时，Web网站为了保存这些新增内容，在很短的时间内就会发送大量的内容更新，为了尽可能实时地显示这些更新的内容，服务器一有内容更新，就需要直接把那些内容反馈到客户端的界面上。虽然看起来简单，但是HTTP无法处理好这项任务

使用HTTP协议探知服务器是否有内容更新，就必须频繁从客户端到服务器端进行确认。如果服务器端没有内容更新，那么就会产生徒劳的通信

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-30.png' width=450 height=220>

#### Ajax 的解决办法
利用 JavaScript 的 DOM 操作，以达到局部 Web 页面替换家在的异步通信手段。和以前的同步通信相比，由于它只更新一部分页面，响应中传输的数据量会因此而减少。

Ajax 的核心技术是名为 `XMLHttpRequest` 的 API，通过 JavaScript 脚本语言的调用就能和服务器进行 HTTP 通信。借由这种手段，就能从已加载完毕的 Web 页面上发起请求，只更新局部页面

__但是，利用 Ajax 实时地从服务器获取内容，有可能会导致大量请求产生。另外，Ajax 仍未解决 HTTP 协议本身存在的问题__

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-31.png' width=450 height=220>

#### Comet 的解决方法
一旦服务器有内容更新了，Comet 不会让请求等待，而是直接给客户端返回响应，这是一种通过延迟应答，模拟实现服务器向客户端推送的功能

通常，服务器端接收到请求，在处理完毕之后回立即返回响应，但是为了实现模拟推送功能，Comet 会将响应至于挂起状态，当服务器端有内容更新时，再返回该响应。

内容上虽然可以做到实时更新，但为了保存响应，一次连接的持续时间变长了。期间，为了维持链接会消耗更多的资源。另外，Ajax 仍未解决 HTTP 协议本身存在的问题

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-32.png' width=450 height=220>

### SPDY 的设计与功能
SPDY在TCP/IP的应用层与运输层之间通过新加回话层的形式运作。同时考虑到安全问题，SPDY规定通信中使用SSL

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-33.png' width=450 height=220>

使用SPDY之后，HTTP协议额外获得一下功能:

- 多路复用流: 通过单一的TCP连接，可以无限制处理多个HTTP请求。所有请求的处理都在一条TCP连接上完成

- 赋予请求优先级: SPDY不仅可以无限制地并发处理请求，还能给请求逐个分配优先级顺序。这是为了在发送多个请求时，解决因带宽低而响应慢的问题

- 压缩HTTP首部: 压缩HTTP首部，这样一来，通信产生的数据包数量和发送的字节就会更少了

- 推送功能: 支持服务器主动向客户端推送数据的功能。这样一来，服务器可直接发送数据，无需等待客户端的请求

- 服务器提示功能: 服务器可以主动提示客户端请求所需的资源

### 使用浏览器进行全双工通信的 WebSocket
建立在HTTP基础上的协议，因此连接的发起方仍是客户端，而一旦确立WebSocket通信协议，不论客户端还是服务器端，都可直接向对方发送报文

为了实现 `WebSocket` 通信，在 HTTP 连接建立之后，需要完成一次 “握手” 的步骤

__成功握手确立 WebSocket 连接之后，通信时不会再使用 HTTP 的数据帧，而是采用 WebSocket 独立的数据帧__

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-34.png' width=450 height=220>

```javascript
  var socket = new WebSocket('ws://www.pengdaokuan.cn')
  socket.onopen = function () {
    setInterval(function () {
      if (socket.bufferedAmount == 0) {
        socket.send(getUpdateData())
      }
    }, 50)
  }
```