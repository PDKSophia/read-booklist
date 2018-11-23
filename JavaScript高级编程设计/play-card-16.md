---
title: JavaScript高级程序设计 - 打卡第十六天
date: 2018-11-23 15:57:32
tags: card-16、XMLHttpRequest

---
# JavaScript高级程序设计 - 第三版

## Chapter Twenty-One
### 跨域资源共享
通过 XHR 实现 Ajax 通信的一个主要限制，来源于跨域安全策略。默认情况下，XHR 对象只能访、问与包含它的页面位于同一个域中的资源。这种安全策略可以预防某些恶意行为。

` CORS(Cross-Origin Resource Sharing，跨源资源共享) ` 定义了在必须访问跨源资源时，浏览器与服务器应该如何沟通。<strong>CORS 背后的基本思想，就是使用自定义的 HTTP 头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功，还是应该失败。</strong>

比如一个简单的使用 ` GET ` 或 ` POST ` 发送的请求，它没有自定义的头部，而主体内容是 text/plain。在 发送该请求时，需要给它附加一个额外的 Origin 头部，其中包含请求页面的源信息(协议、域名和端口)，以便服务器根据这个头部信息来决定是否给予响应。比如下边这个示例:

```javascript
  origin: http://www.pengdaokuan.cn
```
如果服务器认为这个请求可以接受，就在 `Access-Control-Allow-Origin` 头部中回发相同的源信息(如果是公共资源，可以回发 " * " )

```javascript
  Access-Control-Allow-Origin: http://www.pengdaokuan.cn
```

如果没有这个头部，或者有这个头部但源信息不匹配，浏览器就会驳回请求。正常情况下，浏览器会处理请求。注意, *请求和响应都不包含 cookie 信息*。

### IE 对 CORS 的实现
在IE8中，引入了 ` XDR(XDomainRequest) ` 类型，这个对象与 XHR 类似，但能实现安全可靠的跨域通信, 它与XHR的不同之处如下 :

- `cookie` 不会随请求发送，也不会随响应返回。

- 只能设置请求头部信息中的 `Content-Type` 字段。

- 不能访问响应头部信息。

- 只支持 `GET` 和 `POST` 请求

这些变化使 <strong>CSRF(Cross-Site Request Forgery，跨站点请求伪造)</strong> 和 </strong>XSS(Cross-Site Scripting，跨站点脚本)</strong>的问题得到了缓解。被请求的资源可以根据它认为合适的任意数据(用户代理、来源页面等) 来决定是否设置 ` Access-Control- Allow-Origin ` 头部。作为请求的一部分，Origin 头部的值表示请求的来源域，以便远程资源明确地识别 XDR 请求。

XDR 对象的使用方法与 XHR 对象非常相似。也是创建一个 XDomainRequest 的实例，调用 open() 方法，再调用 send()方法。但与 XHR 对象的 open()方法不同，<strong>XDR 对象的 open()方法只接收两个参数: 请求的类型和 URL。</strong>也就是没有第三个参数，决定是否异步或同步，因为所以的 XDR 请求都是异步的

> 所有 XDR 请求都是 `异步执行` 的，不能用它来创建同步请求。请求返回之后，会触发 load 事件，响应的数据也会保存在 responseText 属性中

```javascript
  var xdr = new XDomainRequest()
  xdr.onload = function () {
    console.log(xdr.responseText)
  }
  xdr.open('get', 'http://www.pengdaokuan.cn/xxx')
  xdr.send(null)
```

在接收到响应后，只能访问响应的原始文本; 没有办法确定响应的状态代码。而且，只要响应有效就会触发 load 事件，如果失败(包括响应中缺少 `Access-Control-Allow-Origin` 头部)就会触发 error 事件。遗憾的是，除了错误本身之外，没有其他信息可用，因此唯一能够确定的就只有请求未成功了。要检测错误，可以像下面这样指定一个 onerror 事件处理程序。

```javascript
  var xdr = new XDomainRequest()
  xdr.onload = function () {
    console.log(xdr.responseText)
  }
  xdr.onerror = function () {
    console.log('an error occurred')
  }
  xdr.open('get', 'http://www.pengdaokuan.cn/xxx')
  xdr.send(null)

```
为支持 POST 请求，XDR 对象提供了 `contentType` 属性，用来表示发送数据的格式，如下面的例子所示。
```javascript
  var xdr = new XDomainRequest()
  xdr.onload = function () {
    console.log(xdr.responseText)
  }
  xdr.onerror = function () {
    console.log('an error occurred')
  }
  xdr.open('post', 'http://www.pengdaokuan.cn/xxx')
  xdr.contentType = "application/x-www-form-urlencoded" // 发送数据的格式
  xdr.send(null)

```

### 其他浏览器对CORS的实现
Firefox 3.5+、Safari 4+、Chrome、iOS 版 Safari 和 Android 平台中的 WebKit 都通过 XMLHttpRequest 对象实现了对 CORS 的原生支持。

与 IE 中的 XDR 对象不同，通过跨域 XHR 对象可以访问 status 和 statusText 属性，而且还支持同步请求。跨域 XHR 对象也有一些限制，但为了安全这些限制是必需的。如下

- 不能使用 setRequestHeader()设置自定义头部。

- 不能发送和接收 cookie。

- 调用 getAllResponseHeaders() 方法总会返回空字符串。

> getAllResponseHeaders() 方法则可以取得一个包含所有头部信息的长字符串。

### 带凭证的请求
默认情况下，跨源请求不提供凭据(cookie、HTTP 认证及客户端 SSL 证明等)。通过将 `withCredentials` 属性设置为 true，可以指定某个请求应该发送凭据。如果服务器接受带凭据的请求，会用下面的 HTTP 头部来响应。

```javascript
  Access-Control-Allow-Credentials: true
```

### 跨浏览器的 CORS
由于 IE 对 CORS 的请求是 XDR，而其他浏览器对 CORS 的请求是 XHR，所以存在差异，但所有浏览器都支持简单的(非 Preflight 和不带凭据的)请求因此有必要实现一个跨浏览器的方案。检测 XHR 是否支持 CORS 的最简单方式，就是检查是否存在 withCredentials 属性。再结合检测 XDomainRequest 对象是否存在，就可以兼顾所有浏览器了。

```javascript
  function createCORSRequest (method, url) {
    var xhr = new XMLHttpRequest()
    if ('withCredentials' in xhr) {
      xhr.open(method, url, true)
    } else if (typeof XDomainRequest != 'undefined') {
      xhr = new XDomainRequest()
      xhr.open(method, url)
    } else {
      xhr = null
    }
    return xhr
  }

  var request = createCORSRequest('get', 'http://www.pengdaokuan.cn/request.php')
  if (request) {
    request.onload = function () {
      if ((request.status >= 200 && request.status < 300) || request.status == 304) {
        console.log(request.responseText)
      } else {
        console.log("Request was unsuccessful: " + request.status)
      }
    }
    request.onerror = function () {
      console.log('an error occurred')
    }
    request.send()
  }
  
```

### Comet跨域
如果说Ajax是一种页面向服务器请求数据的技术，那么Comet就是一种服务器向页面推送数据的技术，而且能够让信息以近乎实时地推送到页面上，我们常将它称之为“服务器推送”

有两种实现 Comet 的方式: 长轮询和流。长轮询是传统轮询(也称为短轮询)的一个翻版，即浏览器定时向服务器发送请求，看有没有更新的数据

短轮训的时间线

<!-- <img src='https://github.com/PDKSophia/blog.io/raw/master/image/comet-1.png'> -->

长轮询把短轮询颠倒了一下。页面发起一个到服务器的请求，然后服务器一直保持连接打开，直到 有数据可发送。发送完数据之后，浏览器关闭连接，随即又发起一个到服务器的新请求。这一过程在页 面打开期间一直持续不断。

长轮训的时间线

<!-- <img src='https://github.com/PDKSophia/blog.io/raw/master/image/comet-2.png'> -->

无论是短轮询还是长轮询，浏览器都要在接收数据之前，先发起对服务器的连接。两者最大的区别在于: <strong>服务器如何发送数据</strong>。短轮询是服务器立即发送响应，无论数据是否有效，而长轮询是等待发送响应。轮询的优势是所有浏览器都支持，因为使用 XHR 对象和 setTimeout()就能实现。而你要做的就 是决定什么时候发送请求


通过HTTP流。流不同于上述两种轮询，因为它在页面的整个生命周期内只 使用一个 HTTP 连接。具体来说，就是浏览器向服务器发送一个请求，而服务器保持连接打开，然后周期性地向浏览器发送数据。

```php
  <?php
    $i = 0;
    while (true) {
      // 输出一些数据，然后立即刷新输出缓存
      echo 'number is $i';

      flush();
      
      // 等待一会
      sleep(10);

      $i++;
    }
```
所有服务器端语言都支持打印到输出缓存然后刷新(将输出缓存中的内容一次性全部发送到客户端)的功能。而这正是实现 HTTP 流的关键所在。

通过侦听 readystatechange 事件及检测 readyState 的值是否为 3，就可以利用 XHR 对象实现 HTTP 流。随着不断从服务器接收数据，readyState 的值会周期性地变为 3。当 readyState 值变为 3 时，responseText 属性中就会保存接收到的所有数据。此时，就需要比较此前接收到的数据，决定从什么位置开始取得最新的数据。当 readyState 值变为4，说明结束，传入响应返回的全部内容。使用 XHR 对象实现 HTTP 流的典型代码如下所示。

```javascript
  function createStreamingClient (url, progress, finished) {
    var xhr = new XMLHttpRequest()
    var received = 0

    xhr.open('get', url, true)
    xhr.onreadystatechange = function () {
      var result;

      if (xhr.readyState == 3) {
        // 取得最新数据
        result = xhr.responseText.substring(received)  // 从什么位置开始取得最新数据
        receive  += result.length 

        // 调用progress回调函数
        progress(result)
      } else if (xhr.readyState == 4) {
        finished(xhr.responseText)
      }
    }
    xhr.send(null)
    return xhr
  }

  var client = createStreamingClient ('streaming.php', function (data) {
    console.log('received: ', data)
  }, function (data) {
    console.log('Done')
  })

```
#### 服务器发送事件
SSE(Server-Sent Events，服务器发送事件) 是围绕只读 Comet 交互推出的 API 或者模式。SSE API 用于创建到服务器的单向连接，服务器通过这个连接可以发送任意数量的数据。服务器响应的 MIME 类型必须是 text/event-stream，而且是浏览器中的 JavaScript API 能解析格式输出。SSE 支持短轮询、长轮询和 HTTP 流，而且能在断开连接时自动确定何时重新连接。

SSE 的 JavaScript API 与其他传递消息的 JavaScript API 很相似。要预订新的事件流，首先要创建一
个新的 EventSource 对象，并传进一个入口点:
```javascript
  var source = new EventSource("myevents.php")
```
注意，传入的 URL 必须与创建对象的页面同源(相同的 URL 模式、域及端口)。EventSource 的实例有一个 `readyState` 属性，<strong>值为 0 表示正连接到服务器，值为 1 表示打开了连接，值为 2 表示关闭了连接。</strong>

另外，还有以下三个事件。
- open:在建立连接时触发。

- message:在从服务器接收到新事件时触发。

- error:在无法建立连接时触发。

就一般的用法而言，onmessage 事件处理程序也没有什么特别的。
```javascript
  source.onmessage = function (event) { 
    var data = event.data //处理数据
  };
```

服务器发回的数据以字符串形式保存在 event.data 中。默认情况下，EventSource 对象会保持与服务器的活动连接。如果连接断开，还会重新连接。这就意味着 SSE 适合长轮询和 HTTP 流。如果想强制立即断开连接并且不再重新连接，可以调用 close() 方法