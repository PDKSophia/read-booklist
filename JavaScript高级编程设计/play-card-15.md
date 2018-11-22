---
title: JavaScript高级程序设计 - 打卡第十五天
date: 2018-11-22 11:09:42
tags: card-15、XMLHttpRequest

---
# JavaScript高级程序设计 - 第三版

## Chapter Twenty-One
### XMLHttpRequest对象
<strong>Ajax 技术的核心是 [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 对象(简称 XHR)</strong>，在 XHR 出现之前，Ajax 式的通信必须借助一些 hack 手段来实现，大多数是使用隐藏的框架或内嵌框架。XHR 为向服务器发送请求和解析服务器响应提供了流畅的接口。能够以异步方式从服务器取得更多信息，意味着用户单击后，可以不必刷新页面也能取得新数据。 也就是说，可以使用 XHR 对象取得新数据，然后再通过 DOM 将新数据插入到页面中。

那么我们如何创建一个 XHR 对象呢？
```javascript
  var xhr = new XMLHttpRequest()
```
如果你必须还要支持 IE 的早期版本，那么可以这么做 :
```javascript
  function createXHR () {
    if (typeof XMLHttpRequest != 'undefined') {
      return new XMLHttpRequest()  // 返回IE7及更高版本
    } else if (typeof ActiveObject != 'undefined') { // 适用于IE7之前的版本
      if (typeof arguments.callee.activeXString != 'String') {
        var version = [ "MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"]
        var i, len
        for (i = 0; i < versions.length; i++) {
          try {
            new ActiveObject(versions[i])
            arguments.callee.activeXString = versions[i]
            break
          } catch (error) {
            // 跳过
          }
        }
      }
      return new ActiveObject(arguments.callee.activeXString)
    } else {
      throw new Error('NO XHR object available')
    }
  }
```
这个函数中新增的代码首先检测原生 XHR 对象是否存在，如果存在则返回它的新实例。如果原生 对象不存在，则检测 ActiveX 对象。如果这两种对象都不存在，就抛出一个错误。

### XHR的用法
在使用 XHR 对象时，要调用的第一个方法是 `open()`，它接受 3 个参数，注意， `URL` 相对于执行代码的当前页面(当然也可以使用绝对路径)，调用 `open()` 方法并不会真正发送请求， 而只是启动一个请求以备发送。

- 要发送的请求的类型（'GET', 'POST'等)

- 请求的URL

- 是否异步发送请求的布尔值

*要发送特定的请求，必须像下面这样调用 send()方法*，这里的 `send()` 方法接收一个参数，即要作为请求主体发送的数据。如果不需要通过请求主体发送数据，则必须传入 `null`，因为这个参数对有些浏览器来说是必需的。调用 send()之后，请求就会被分派到服务器。


由于这次请求是`同步`的，JavaScript 代码会等到服务器响应之后再继续执行。在收到响应后，响应的数据会自动填充 XHR 对象的属性，相关的属性简介如下 :

- responseText : 作为响应主体被返回的文本。

- responseXML : 如果响应的内容类型是"text/xml"或"application/xml"，这个属性中将保存包含着响应数据的 XML DOM 文档。

- status : 响应的 HTTP 状态。

- statusText : HTTP 状态的说明

发送同步请求当然没有问题，但多数情况下，<strong>我们还是要发送异步请求，才能让 JavaScript 继续执行而不必等待响应</strong>。此时，可以检测 XHR 对象的 `readyState` 属性，该属性表示请求/响应过程的当前活动阶段。这个属性可取的值如下

- 0 : 未初始化。尚未调用 open()方法。

- 1 : 启动。已经调用 open()方法，但尚未调用 send()方法。

- 2 : 发送。已经调用 send()方法，但尚未接收到响应。

- 3 : 接收。已经接收到部分响应数据。

- 4 : 完成。已经接收到全部响应数据，而且已经可以在客户端使用了。

只要 readyState 属性的值由一个值变成另一个值，都会触发一次 `readystatechange` 事件。可以利用这个事件来检测每次状态变化后 readyState 的值。通常，<strong>我们只对 readyState 值为 4 的阶段感兴趣，因为这时所有数据都已经就绪</strong>。不过，必须在调用 open()之前指定 onreadystatechange 事件处理程序才能确保跨浏览器兼容性。

```javascript
  var xhr = createXHR()
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.log(xhr.responseText)
      } else {
        console.log("Request was unsuccessful: " + xhr.status)
      }
    }
  }
  xhr.open('get', 'www.pengdaokuan.cn/test.php', true) // true 表示异步
  xhr.send(null)
```

使用 `setRequestHeader()` 方法可以设置自定义的请求头部信息。这个方法接受两个参数: 头部字段的名称和头部字段的值。要成功发送请求头部信息，必须在调用 open()方法之后且调用 send()方法 之前调用 `setRequestHeader()` 

默认情况下，在发送 XHR 请求的同时，还会发送下列头部信息。
- Accept : 浏览器能够处理的内容类型。

- Accept-Charset : 浏览器能够显示的字符集。

- Accept-Encoding : 浏览器能够处理的压缩编码。

- Accept-Language : 浏览器当前设置的语言。

- Connection : 浏览器与服务器之间连接的类型。

- Cookie : 当前页面设置的任何 Cookie。

- Host : 发出请求的页面所在的域 。

- Referer : 发出请求的页面的 URI。

- User-Agent : 浏览器的用户代理字符串。

```javascript
  var xhr = createXHR()
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.log(xhr.responseText)
      } else {
        console.log("Request was unsuccessful: " + xhr.status)
      }
    }
  }
  xhr.open('get', 'www.pengdaokuan.cn/test.php', true) // true 表示异步
  xhr.setRequestHeader("MyHeader", "MyValue") // 发送header头部信息
  xhr.send(null)
```

#### XHR的GET请求
GET 是最常见的请求类型，最常用于向服务器查询某些信息。使用 GET 请求经常会发生的一个错误，就是查询字符串的格式有问题。<strong>查询字符串中每个参数的名称和值都必须使用 `encodeURIComponent()` 进行编码，然后才能放到 URL 的末尾; -值对都必须由和号(&)分隔</strong>

```javascript
  // 向现有 URL 的末尾添加查询字符串参数
  function addURLParam(url, name, value) {
    url += (url.indexOf("?") == -1 ? "?" : "&")
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value)
    return url
  }

  var url = "example.php"
  //添加参数
  url = addURLParam(url, "name", "Nicholas")
  url = addURLParam(url, "book", "Professional JavaScript")
  //初始化请求
  xhr.open("get", url, false)

```
#### XHR的POST请求
通常用于向服务器发送应该被保存的数据。POST 请求应该把数据作为请求的主体提交

默认情况下，服务器对 POST 请求和提交 Web 表单的请求并不会一视同仁。因此，服务器端必须有程序来读取发送过来的原始数据，并从中解析出有用的部分。不过，我们可以使用 XHR 来模仿表单提交: <strong>首先将 Content-Type 头部信息设置为 application/x-www-form-urlencoded</strong>，也就是表单提交时的内容类型，其次是以适当的格式创建一个字符串

如果需要将页面中表单的数据进行序列化，然后再通过 XHR 发送到服务器，那么 就可以使用 `serialize()` 函数来创建这个字符串

```javascript
  function submitData () {
    var xhr = createXHR()
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          console.log(xhr.responseText)
        } else {
          console.log("Request was unsuccessful: " + xhr.status)
        }
      }
    }

    xhr.open('post', 'post.php', true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    
    var.form = document.getElementById('userform')
    xhr.send(serialize(form))
  }
```

### XMLHttpRequest 2级
#### FormData
[FormData](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects) 为序列化表单以及创建与表单格式相同的数据(用于通过 XHR 传输)提供了便利，<strong>最常用的就是通过FormData对象上传图片文件</strong>

```javascript
  var data = new FormData()
  data.append('name', '彭道宽')
```
这个 append()方法接收两个参数: 键和值，分别对应表单字段的名字和字段中包含的值。可以像这样添加任意多个键值对儿

```javascript
  var formElement = document.querySelector("form")
  var formData = new FormData(formElement)

  var xhr = createXHR()
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.log(xhr.responseText)
      } else {
        console.log("Request was unsuccessful: " + xhr.status)
      }
    }
  }
  
  xhr.open('POST', 'post.php', true)
  formData.append('username', '彭道宽')
  formData.append('password', '123456')
  xhr.send(formData)
```

#### 超时设定
IE8 为 XHR 对象添加了一个 `timeout` 属性，*表示请求在等待响应多少毫秒之后就终止*。在给 timeout 设置一个数值后，如果在规定的时间内浏览器还没有接收到响应，那么就会触发 timeout 事件，进而会调用 ontimeout 事件处理程序

```javascript
  var xhr = createXHR()
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.log(xhr.responseText)
      } else {
        console.log("Request was unsuccessful: " + xhr.status)
      }
    }
  }

  xhr.open('GET', 'timeout.php', true)
  xhr.timeout = 10000 // 超时时间为10s(仅适应于IE8)
  xhr.ontimeout = function () {
    console.log('request did not return in a 10s')
  }
  xhr.send(null)
``` 
#### overrideMimeType() 方法
用于重写 XHR 响应的 MIME 类型。比如，服务器返回的 MIME 类型是 `text/plain`，但数据中实际包含的是 `XML`。根据 MIME 类型， 即使数据是 XML，responseXML 属性中仍然是 null。通过调用 overrideMimeType()方法，可以保证把响应当作 XML 而非纯文本来处理。
```javascript
  var xhr = createXHR()
  xhr.open("get", "text.php", true)
  xhr.overrideMimeType("text/xml")
  xhr.send(null)
```

### 进度事件
定义了与客户端服务器通信有关的事件。这些事件最早其实只针对 XHR 操作，但目前也被其他 API 借鉴。有以下 6 个进度事件。

- loadstart ：在接收到响应数据的第一个字节时触发。

- progress ：在接收响应期间持续不断地触发。

- error ：在请求发生错误时触发。

- abort ：在因为调用 abort()方法而终止连接时触发。

- load ：在接收到完整的响应数据时触发。

- loadend ：在通信完成或者触发 error、abort 或 load 事件后触发。

<strong>每个请求都从触发 `loadstart` 事件开始，接下来是一或多个 progress 事件，然后触发 error、 abort 或 load 事件中的一个，最后以触发 loadend 事件结束</strong>

#### load 事件
用以替代 readystatechange 事件。响应接收完毕后将触发 load 事件，因此也就没有必要去检查 readyState 属性了。而 <strong>onload 事件处理程序会接收到一个 event 对象，其 target 属性 就指向 XHR 对象实例</strong>，因而可以访问到 XHR 对象的所有方法和属性

```javascript
  var xhr = createXHR()
  xhr.onload = function (event) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      console.log(xhr.responseText)
    } else {
      console.log("Request was unsuccessful: " + xhr.status)
    }
  }

  xhr.open('get', 'www.pengdaokuan.cn/load.php', true) 
  xhr.send(null)
```

#### progress 事件
这个事件会在浏览器接收新数据期间周期 6 性地触发。而 `onprogress` 事件处理程序会接收到一个 `event` 对象，其 target 属性是 XHR 对象，但 包含着三个额外的属性: lengthComputable、position 和 totalSize。

- lengthComputable 是一个表示进度信息是否可用的布尔值

- position 表示已经接收的字节数

- totalSize 表示根据 Content-Length 响应头部确定的预期字节数。

```javascript
  var xhr = createXHR()
  xhr.onload = function (event) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      console.log(xhr.responseText)
    } else {
      console.log("Request was unsuccessful: " + xhr.status)
    }
  }
  
  xhr.onprogress = function (event) {
    var disStatus = document.getElementById('status')
    if (event.lengthComputable) {
      disStatus.innerHTML = 'received: ' + event.position + ' of ' + event.totalSize + ' bytes '
    }
  }

  xhr.open('get', 'www.pengdaokuan.cn/progress.php', true) 
  xhr.send(null)

```

> 为确保正常执行，必须在调用 open()方法之前添加 onprogress 事件处理程序， 每次触发 progress 事件，都会以新的状态信息更新 HTML 元素的内容。如果响应头部中包含 `Content-Length` 字段，那么也可以利用此信息来计算从响应中已经接收到的数据的百分比。