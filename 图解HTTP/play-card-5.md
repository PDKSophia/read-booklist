---
title: 图解HTTP - 打卡第五天
date: 2018-11-16 09:55:05
tags: card-5、HTTP报文首部、HTTPS通信步骤、HTTPS的优缺点

---

# 图解HTTP 

## Chapter Six

### HTTP报文首部
HTTP协议的请求和响应报文中必定包含HTTP首部。首部内容为客户端和服务器分别处理请求和响应提供所需要的信息。

#### HTTP请求报文

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

#### HTTP响应报文
在响应中，HTTP报文由HTTP版本、状态码 (数字和原因短语)、HTTP首部字段3部分构成

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-21.png' width=450 height=220>

以下示例是之前请求: www://jackr.jp 时，响应报文的首部信息
```javascript
  HTTP/1.1 304 Not Modified
  Date: Thu, 07 Jun 2018 09:53:31 GMT
  Server: Apache
  Connection: close
  Etag: '45bae1-16a-46d776ac'
```

### HTTP首部字段
首部字段是为了给浏览器和服务器提供报文主体大小、所使用的语言、认证信息等内容

HTTP首部字段是由首部字段名和字段值构成，中间由冒号 `:` 分割
```base
  首部字段名: 字段值
```
*字段值对应单个HTTP首部字段可以有多个值*，比如
```javascript
  Keep-Alive: timeout=15, max=100
```

<strong>如果HTTP报文首部出现了两个或者两个以上具有相同首部字段名时怎么办 ? </strong>，由于这种情况在范围内尚未明确，因此有的浏览器内部处理逻辑的不同，结果可能会不一致，有的可能会返回第一次出现的首部字段，有的会优先处理最后出现的首部字段

#### 四种HTTP首部字段类型
- 通用首部字段: 请求报文和响应保温都会使用的字段

- 请求首部字段: 从客户端向服务器端发送请求报文时使用的首部，补充了请求的附加内容、客户端的信息、响应内容相关优先级信息

- 响应首部字段: 从服务器端向客户端返回响应报文时使用的首部，补充了响应的附加内容、也会要求客户端附加额外的内容信息

- 实体首部字段: 针对请求报文和响应报文的实体部分使用的首部，补充了资源内容更新时间等与实体有关的信息

### 通用首部字段

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-22.png' width=450 height=320>

> 关于Cache-Control中的说明: no-cache不是不缓存，它是代表不缓存过期的资源，缓存会向源服务器进行有效期确定后处理资源； no-store才是真正地不进行缓存

### 请求首部字段

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-23.png' width=450 height=620>

### 响应首部字段

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-24.png' width=450 height=350>

### 实体首部字段

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-25.png' width=450 height=350>


### 为Cookie服务的首部字段
| 首部字段名 | 说明 | 首部类型 | 
| :------: | :------: | :------: | 
| Set-Cookie | 开始状态管理所使用的Cookie |  响应首部字段 |
| Cookie | 服务器接收到的Cookie字段 |  请求首部字段 |

#### Set-Cookie
```javascript
  Set-Cookie: status=enable; expires=Tue, 05 Jul 2019 10:42:32
```

关于 `Set-Cookie 字段的属性
| 属性 | 说明 |
| :------: | :------: | 
| NAME=VALUE | 赋予Cookie的名称和其值(必需)) | 
| expires=DATE | Cookie的有效期限，不明确指定的话，默认为浏览器关闭前为止 |  
| path=PATH | 将服务器上的文件目录作为Cookie的适用对象，不指定默认为文档所在的文件目录 |  
| domain=域名 | 作为Cookie适用对象的域名，不指定默认为创建的服务器的域名 |  
| Secure | 仅在HTTPS安全通信时才会发送Cookie |  
| HttpOnly | 加以限制，使Cookie不能被JavaScript脚本访问 |  

> 设置Set-Cookie: name=value; HttpOnly；使得document.cookie无法读取附加HttpOnly属性后的Cookie内容了。防止跨站脚本攻击(XSS)对Cookie的信息窃取

------

## Chapter Seven

### HTTP的缺点
- 通信使用明文 (不加密)，内容可能会被窃听

- 不验证通信方的身份，可能遭遇伪装

- 无法证明报文的完整性，报文内容可能已被更改

### HTTP+加密+认证+完整性保护 = HTTPS
HTTP传输协议的数据是未加密的，也就是明文传输，因而很不安全，HTTPS协议就是由SSL + HTTP协议构建成的可进行加密传输、身份验证的网络协议。HTTP的端口在80，HTTPS的端口在443。并且HTTPS需要CA证书～

#### HTTPS是身披SSL外壳的HTTP
HTTPS并非是应用层的一种新协议。只是HTTP通信接口部分用SSL和TLS协议代替而已。 通常，HTTP直接和TCP通信，但是使用SSL时，就演变成HTTP先和SSL通信，再由SSL和TCP通信。

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-26.png' width=450 height=220>

SSL采用了一种叫做 <strong>公开密钥加密</strong>的加密处理方式。那么是什么公开密钥加密呢？

> 公开密钥加密: 使用一对非对称的密钥，一把叫做公钥，一把叫做私钥；

使用公开密钥加密方式，发送密文的一方使用对方的`公开密钥`

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-27.png' width=600 height=380>

#### 接下来了解一下HTTPS通信步骤

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-28.png' width=450 height=650 />

1 : 客户端发送Client Hello报文开始SSL通信，报文中包含客户端支持的SSL指定版本，加密组件列表(所使用的加密算法和密钥长度等)

2 : 服务器可进行SSL通信。会以Server Hello报文作为应答。和客户端一样，在报文中会包含SSL的版本以及加密组件；*服务器的加密组件内容是从客户端加密组件内筛选出来的*

3 : 服务器发送Certificate报文，报文中包含公钥证书

4 : 最后服务器发送Server Hello Done报文通知客户端，最初阶段的SSL握手协商部分结束

5 : SSL第一次握手接受后，客户端以 Client Key Exchange 报文作为回应。报文中包含通信加密中使用的一种被称为 `Pre-master-secret` 的随机密码串。报文已用步骤3中的服务器公开密钥进行加密

6 : 接着客户端继续发送 Change Cipher Spec 报文。该报文会提示服务器，接下来的通信会采用 Pre-master-secret 密钥加密

7 : 客户端发送 Finished 报文，该报文包含连接至今全部报文的整体校验值。这次握手协商是否能够成功，要以服务器是否能够正确解密该报文作为判定标准

8 : 服务器同样发送 Change Cipher Spec 报文

9 : 服务器同样发送 Finished 报文

10 : 服务器和客户端的 Finished 报文交换完毕之后，SSL连接就算简历完成。当然，通信会受SSL的保护

11 : 应用层协议通信，发送HTTP响应

12 : 最后由客户端断开连接，断开连接时，发送 close_notify 报文

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/http-29.png' width=720 height=520>

### HTTPS的优缺点

#### 优点 
1 : 使用HTTPS协议可认证用户和服务器，确保数据发送到正确的客户机和服务器

2 : HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，要比http协议安全，可防止数据在传输过程中不被窃取、改变，确保数据的完整性

3 : HTTPS是现行架构下最安全的解决方案，虽然不是绝对安全，但它大幅增加了中间人攻击的成本。

4 : 相比之下，SEO更加友好

#### 缺点
1 : HTTPS协议握手阶段比较费时，会使页面的加载时间延长近50%，增加10%到20%的耗电

2 : HTTPS连接缓存不如HTTP高效，会增加数据开销和功耗，甚至已有的安全措施也会因此而受到影响

3 : SSL证书要钱，而且证书通常需要绑定IP，不能在同一IP上绑定多个域名，IPv4资源不可能支撑这个消耗。