---
title: 图解HTTP - 打卡第三天
date: 2018-11-14 10:26:05
tags: card-3、

---

# 图解HTTP 

## Chapter Three

### HTTP报文内的HTTP信息

<strong>用于HTTP协议交互的信息叫做 `HTTP报文`</strong>，客户端的请求HTTP报文叫做请求报文，服务器端的叫做响应报文。下图为请求报文(上)和响应报文(下)

<!-- <img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-13.png' width=550 height=300> -->

HTTP在传输数据时可以按照数据原貌直接传输，但也可以在传输过程中通过编码提升传输速率。通过在传输时编码，能有效地处理大量的访问请求，但是，编码的操作需要计算机来完成，因此会消耗更多的CPU等资源

#### 报文主体和实体主体的差异
- 报文 : 是HTTP通信中的基本单位，由8位组字节流组成，通过HTTP通信传输

- 实体 : 作为请求或响应的有效载贺数据被传输，其内容由实体首部和实体主体组成

HTTP报文的主体用于传输请求或响应的实体主体，通常，报文主体等于实体主体，只有当传输中进行编码操作时，实体主体的内容发生变化，才导致它和报文主体产生差异

HTTP协议中，有一种被称为内容编码的功能也能进行压缩再发送

<!-- <img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-14.png' width=550 height=300> -->

常见的内容编码有下边几种
- gzip (GNU zop)

- compress (UNIX系统的标准压缩)

- deflate (zlib)

- identity (不进行编码)

#### 分割发送的分块传输编码
在HTTP通信过程中，请求的编码实体资源尚未全部传输完成之前，浏览器无法显示请求页面。在传输大量内容数据时，通过把数据分割成多块，能够让浏览器逐步显示页面

这种通过把实体主体分块的功能称为 `分块传输编码`

<!-- <img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-15.png' width=550 height=300> -->

分块传输编码会将实体主体分成多个部分(块)，每一块都会用十六进制来标记块的大小，而实体主体的最后一块会使用 `0(CR+LF)` 来标记

使用分块传输编码的实体主体会由接受的客户端负责解码，恢复到编码前的实体主体

#### 获取部分内容的范围请求
范围请求(Range Request) : 对一份10000字节大小的资源，如果使用范围请求，可以只请求5001～10000字节内的资源

<!-- <img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-16.png' width=550 height=300> -->

byte 范围的指定形式
```javascript
  // 5001 ~ 10000
  Range: bytes=5001-10000

  // 从 5001 字节之后全部的
  Range: bytes=5001~

  // 从一开始到3000字节和5000～7000字节的多重范围
  Range: bytes=-3000, 5000-7000
```
> 针对范围请求，响应会返回状态码为206 Partial Content的响应报文。另外，对于多重范围的范围情求，响应会在首部字段Content-Type标明 multipart/byteranges 后返回响应报文

#### 内容协商返回最合适的内容
内容协商机制是值客户端和服务器端就响应的资源内容进行交涉，然后提供给客户端最为合适的资源

内容协商有三种类型
- 服务器驱动协商

- 客户端驱动协商

- 透明协商

-----------

## Chapter Four

### 返回结果的HTTP状态码
状态码的职责是当客户端向服务器发送请求时，描述返回的请求结果。借助状态码，用户可以知道服务器是否正常处理，还是出现了错误

状态码如: 200 OK，是由3位数字和原因短语组成

状态码的类别

|  | 类别 | 原因短语 | 
| :------: | :------: | :------: | 
| 1XX | Informational(信息性状态码) |  接收的请求正在处理 |
| 2XX | Success(成功状态码) |  接收的请求处理完毕 |
| 3XX | Redirection(重定向状态码) |  需要进行附加操作以完成请求 |
| 4XX | Client Error(客户端错误状态码) |  服务器无法处理请求 |
| 5XX | Server Error(服务器端错误状态码) | 服务器处理请求出错 |


`1xx` 状态码

- 100 Continue 继续，一般在发送post请求时，已发送了http header之后服务端将返回此信息，表示确认，之后发送具体参数信息

`2xx` 状态码

- 200 表示成功，并返回信息 (OK)
- 201 请求成功并且服务器创建了新的资源 (Created)
- 202 服务器接受请求，但尚未处理 (Accepted)
- 204 服务器请求已成功处理，但是返回的响应报文中不含实体的主体内容 (No Content)

`3xx` 状态码

- 301 永久性重定向 (Moved Permanently)
- 302 临时性重定向 (Move temporarily)
- 303 临时性重定向，并总是使用GET请求新的URL (See Other)
- 304 自从上次请求后，请求的网页未修改过 (Not Modified)

`4xx` 状态码

- 400 服务器无法理解请求的格式，客户端不应当尝试再次使用相同的内容发起请求 (Bad Request)
- 401 请求未授权 (Unauthorized)
- 403 禁止访问 (Forbidden)
- 404 未找到相匹配的资源 (Not Found)
- 408 请求超时，客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改 (Request Timeout)

`5xx` 状态码

- 500 最常见的服务器端错误。(Internal Server Error)
- 502 作为网关或者代理工作的服务器尝试执行请求时，从上游服务器接收到无效的响应 (Bad Gateway)
- 503 服务器端暂时无法处理请求（可能是过载或维护）(Service Unavailable)
