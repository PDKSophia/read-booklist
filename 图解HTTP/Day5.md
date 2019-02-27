---
title: 图解HTTP - 打卡第五天
date: 2018-11-16 09:55:05
tags: card-5、HTTP报文首部、HTTPS通信步骤、HTTPS的优缺点
---

# 图解 HTTP

## Chapter Six

### HTTP 报文首部

HTTP 协议的请求和响应报文中必定包含 HTTP 首部。首部内容为客户端和服务器分别处理请求和响应提供所需要的信息。

#### HTTP 请求报文

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-20.png' width=450 height=220>

比如请求访问: www://jackr.jp 时，请求报文的首部信息

```javascript
  GET / HTTP/1.1
  Host: jackr.jp
  User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) ...
  Accept: text/html, application/xhtml+xml, application/xml; ...
  Accept-Language: ja,en-us;q=0.7,en;q=0.3
  Accept-Encoding: gzip, deflate
  DNT: 1
  Connection: keep-alive
  Cache-Control: max-age=0
  ...
```

#### HTTP 响应报文

在响应中，HTTP 报文由 HTTP 版本、状态码 (数字和原因短语)、HTTP 首部字段 3 部分构成

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-21.png' width=450 height=220>

以下示例是之前请求: www://jackr.jp 时，响应报文的首部信息

```javascript
  HTTP/1.1 304 Not Modified
  Date: Thu, 07 Jun 2018 09:53:31 GMT
  Server: Apache
  Connection: close
  Etag: '45bae1-16a-46d776ac'
```

### HTTP 首部字段

首部字段是为了给浏览器和服务器提供报文主体大小、所使用的语言、认证信息等内容

HTTP 首部字段是由首部字段名和字段值构成，中间由冒号 `:` 分割

```base
  首部字段名: 字段值
```

_字段值对应单个 HTTP 首部字段可以有多个值_，比如

```javascript
  Keep-Alive: timeout=15, max=100
```

<strong>如果 HTTP 报文首部出现了两个或者两个以上具有相同首部字段名时怎么办 ? </strong>，由于这种情况在范围内尚未明确，因此有的浏览器内部处理逻辑的不同，结果可能会不一致，有的可能会返回第一次出现的首部字段，有的会优先处理最后出现的首部字段

#### 四种 HTTP 首部字段类型

- 通用首部字段: 请求报文和响应保温都会使用的字段

- 请求首部字段: 从客户端向服务器端发送请求报文时使用的首部，补充了请求的附加内容、客户端的信息、响应内容相关优先级信息

- 响应首部字段: 从服务器端向客户端返回响应报文时使用的首部，补充了响应的附加内容、也会要求客户端附加额外的内容信息

- 实体首部字段: 针对请求报文和响应报文的实体部分使用的首部，补充了资源内容更新时间等与实体有关的信息

### 通用首部字段

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-22.png' width=450 height=320>

> 关于 Cache-Control 中的说明: no-cache 不是不缓存，它是代表不缓存过期的资源，缓存会向源服务器进行有效期确定后处理资源； no-store 才是真正地不进行缓存

### 请求首部字段

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-23.png' width=450 height=620>

### 响应首部字段

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-24.png' width=450 height=350>

### 实体首部字段

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-25.png' width=450 height=350>

### 为 Cookie 服务的首部字段

| 首部字段名 |            说明             |   首部类型   |
| :--------: | :-------------------------: | :----------: |
| Set-Cookie | 开始状态管理所使用的 Cookie | 响应首部字段 |
|   Cookie   | 服务器接收到的 Cookie 字段  | 请求首部字段 |

#### Set-Cookie

```javascript
  Set-Cookie: status=enable; expires=Tue, 05 Jul 2019 10:42:32
```

关于 `Set-Cookie 字段的属性
| 属性 | 说明 |
| :------: | :------: |
| NAME=VALUE | 赋予 Cookie 的名称和其值(必需)) |
| expires=DATE | Cookie 的有效期限，不明确指定的话，默认为浏览器关闭前为止 |  
| path=PATH | 将服务器上的文件目录作为 Cookie 的适用对象，不指定默认为文档所在的文件目录 |  
| domain=域名 | 作为 Cookie 适用对象的域名，不指定默认为创建的服务器的域名 |  
| Secure | 仅在 HTTPS 安全通信时才会发送 Cookie |  
| HttpOnly | 加以限制，使 Cookie 不能被 JavaScript 脚本访问 |

> 设置 Set-Cookie: name=value; HttpOnly；使得 document.cookie 无法读取附加 HttpOnly 属性后的 Cookie 内容了。防止跨站脚本攻击(XSS)对 Cookie 的信息窃取

---

## Chapter Seven

### HTTP 的缺点

- 通信使用明文 (不加密)，内容可能会被窃听

- 不验证通信方的身份，可能遭遇伪装

- 无法证明报文的完整性，报文内容可能已被更改

### HTTP+加密+认证+完整性保护 = HTTPS

HTTP 传输协议的数据是未加密的，也就是明文传输，因而很不安全，HTTPS 协议就是由 SSL + HTTP 协议构建成的可进行加密传输、身份验证的网络协议。HTTP 的端口在 80，HTTPS 的端口在 443。并且 HTTPS 需要 CA 证书～

#### HTTPS 是身披 SSL 外壳的 HTTP

HTTPS 并非是应用层的一种新协议。只是 HTTP 通信接口部分用 SSL 和 TLS 协议代替而已。 通常，HTTP 直接和 TCP 通信，但是使用 SSL 时，就演变成 HTTP 先和 SSL 通信，再由 SSL 和 TCP 通信。

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-26.png' width=450 height=220>

SSL 采用了一种叫做 <strong>公开密钥加密</strong>的加密处理方式。那么是什么公开密钥加密呢？

> 公开密钥加密: 使用一对非对称的密钥，一把叫做公钥，一把叫做私钥；

使用公开密钥加密方式，发送密文的一方使用对方的`公开密钥`

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-27.png' width=600 height=380>

#### 接下来了解一下 HTTPS 通信步骤

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-28.png' width=450 height=650 />

1 : 客户端发送 Client Hello 报文开始 SSL 通信，报文中包含客户端支持的 SSL 指定版本，加密组件列表(所使用的加密算法和密钥长度等)

2 : 服务器可进行 SSL 通信。会以 Server Hello 报文作为应答。和客户端一样，在报文中会包含 SSL 的版本以及加密组件；_服务器的加密组件内容是从客户端加密组件内筛选出来的_

3 : 服务器发送 Certificate 报文，报文中包含公钥证书

4 : 最后服务器发送 Server Hello Done 报文通知客户端，最初阶段的 SSL 握手协商部分结束

5 : SSL 第一次握手接受后，客户端以 Client Key Exchange 报文作为回应。报文中包含通信加密中使用的一种被称为 `Pre-master-secret` 的随机密码串。报文已用步骤 3 中的服务器公开密钥进行加密

6 : 接着客户端继续发送 Change Cipher Spec 报文。该报文会提示服务器，接下来的通信会采用 Pre-master-secret 密钥加密

7 : 客户端发送 Finished 报文，该报文包含连接至今全部报文的整体校验值。这次握手协商是否能够成功，要以服务器是否能够正确解密该报文作为判定标准

8 : 服务器同样发送 Change Cipher Spec 报文

9 : 服务器同样发送 Finished 报文

10 : 服务器和客户端的 Finished 报文交换完毕之后，SSL 连接就算简历完成。当然，通信会受 SSL 的保护

11 : 应用层协议通信，发送 HTTP 响应

12 : 最后由客户端断开连接，断开连接时，发送 close_notify 报文

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-29.png' width=720 height=520>

### HTTPS 的优缺点

#### 优点

1 : 使用 HTTPS 协议可认证用户和服务器，确保数据发送到正确的客户机和服务器

2 : HTTPS 协议是由 SSL+HTTP 协议构建的可进行加密传输、身份认证的网络协议，要比 http 协议安全，可防止数据在传输过程中不被窃取、改变，确保数据的完整性

3 : HTTPS 是现行架构下最安全的解决方案，虽然不是绝对安全，但它大幅增加了中间人攻击的成本。

4 : 相比之下，SEO 更加友好

#### 缺点

1 : HTTPS 协议握手阶段比较费时，会使页面的加载时间延长近 50%，增加 10%到 20%的耗电

2 : HTTPS 连接缓存不如 HTTP 高效，会增加数据开销和功耗，甚至已有的安全措施也会因此而受到影响

3 : SSL 证书要钱，而且证书通常需要绑定 IP，不能在同一 IP 上绑定多个域名，IPv4 资源不可能支撑这个消耗。
