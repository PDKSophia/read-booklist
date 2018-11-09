---
title: JavaScript高级程序设计 - 打卡第五天
date: 2018-11-08 09:52:32
tags: card-5、setTimeout和setInterval、用户代理检测

---

# JavaScript高级程序设计 - 第三版

## Chapter Eight
### Window对象
BOM 的核心对象是 `window`，它表示浏览器的一个实例。在浏览器中，window 对象有双重角色， 它既是通过 JavaScript 访问浏览器窗口的一个接口，又是 ECMAScript 规定的 Global 对象。这意味着 在网页中定义的任何一个对象、变量和函数，都以 window 作为其 Global 对象

#### 全局作用域
所有在全局作用域中声明的变量、函数都会变成 window 对象的属性和方法
```javascript
  var age = 29
  function sayAge () {
    console.log(this.age)
  }
  console.log(window.age) // 29
  sayAge() // 29
  window.sayAge() // 29
```
抛开全局变量会成为window对象的属性不谈，定义全局变量与在window对象上直接定义属性还是有一点差别: __全局变量不能通过 delete 操作符删除，而直接在 window 对象上的定义的属性可以__。
```javascript
  var age = 29
  window.color = "red"
  //在IE < 9 时抛出错误，在其他所有浏览器中都返回false 
  delete window.age

  //在IE < 9 时抛出错误，在其他所有浏览器中都返回true 
  delete window.color //returns true

  alert(window.age)   //29
  alert(window.color) //undefined
```
使用 var 语句添加的 window 属性有一个名为`[[ Configurable ]]`的特性，这个特性的值被设置为 false，因此这样定义的属性不可以通过 delete 操作符删除。
> [[ Configurable ]]: 能否通过delete删除属性从而重新定义属性，能否修改属性的特性，默认false

还要记住一件事: 尝试访问未声明的变量会抛出错误，但是通过查询 window 对象，可以知道某个可能未声明的变量是否存在

```javascript
  //这里会抛出错误，因为 oldValue 未定义 
  var newValue = oldValue
 
  //这里不会抛出错误，因为这是一次属性查询 
  //newValue 的值是 undefined
  var newValue = window.oldValue

```

#### 窗口大小
innerWidth、innerHeight、outerWidth 和 outerHeight 用于确定一个窗口的大小。

- `outerWidth` 和 `outerHeight` 返回浏览器窗口本身的尺寸(无论是从最外层的 window 对象还是从 某个框架访问)

- `innerWidth` 和 `innerHeight` 则表示该容器中页面视图区的大小(减去边框宽度)

在 Chrome 中，outerWidth、outerHeight 与 innerWidth、innerHeight 返回相同的值，即视口(viewport)大小而非浏览器窗口大小

在 IE、Firefox、Safari、Opera 和 Chrome 中，`document.documentElement.clientWidth` 和 `document.documentElement.clientHeight` 中保存了页面视口的信息。在 IE6 中，这些属性必须在标准模式下才有效; 如果是混杂模式，就必须通过 `document.body.clientWidth` 和 `document.body. clientHeight` 取得相同信息。而对于混杂模式下的 Chrome，则无论通过 document.documentElement 还是 document.body 中的 clientWidth 和 clientHeight 属性，都可以取得视口的大小。虽然最终无法确定浏览器窗口本身的大小，但却可以取得页面视口的大小

> 通过 document.compatMode 来检查确定页面是否处于标准状态
```javascript
  var pageWidth = window.innerWidth
  var pageHeight = window.innerHeight

  if (typeof pageWidth != "number"){
    if (document.compatMode == "CSS1Compat") {
      pageWidth = document.documentElement.clientWidth
      pageHeight = document.documentElement.clientHeight
    } else {
        pageWidth = document.body.clientWidth
        pageHeight = document.body.clientHeight
    }
  }
```

对于移动设备，`window.innerWidth` 和 `window.innerHeight` 保存着可见视口，也就是屏幕上可见页面区域的大小。移动 IE 浏览器不支持这些属性，但通过 document.documentElement.clientWidth 和 document.documentElement.clientHeihgt 提供了相同的信息。随着页面的缩放，这些值也会相应变化

在其他移动浏览器中，<strong>document.documentElement 度量的是布局视口，即渲染后页面的实际大小(与可见视口不同，可见视口只是整个页面中的一小部分)</strong>。移动 IE 浏览器把布局视口的信息保存在 document.body.clientWidth 和 document.body.clientHeight 中。这些值不会随着页面缩放变化

__由于与桌面浏览器间存在这些差异，*最好是先检测一下用户是否在使用移动设备*，然后再决定使用哪个属性__


### 超时调用和间歇调用
JavaScript 是单线程语言，但它允许通过设置超时值和间歇时间值来调度代码在特定的时刻执行。 前者是在指定的时间过后执行代码，而后者则是每隔指定的时间就执行一次代码

超时调用需要使用 window 对象的 setTimeout()方法，它接受两个参数:要执行的代码和以毫秒表示的时间(即在执行代码前需要等待多少毫秒)。其中，第一个参数可以是一个包含 JavaScript 代码的字符串)，也可以是一个函数。例如，下面对 setTimeout() 的两次调用都会在一秒钟后显示一个警告框。

```javascript
  // 不建议传递字符串
  setTimeout('alert("Hello World")', 1000)

  // 推荐的调用方式
  setTimeout(function () {
    alert("Hello World")
  }, 1000)
```
虽然这两种调用方式都没有问题，但由于<strong>传递字符串可能导致性能损失</strong>，因此不建议以字符串作为第一个参数。这也是内存泄漏的原因之一

第二个参数是一个表示`等待多长时间的毫秒数`，*但经过该时间后指定的代码不一定会执行*。 JavaScript 是一个单线程序的解释器，因此一定时间内只能执行一段代码。为了控制要执行的代码，就有一个 JavaScript 任务队列。这些任务会按照将它们添加到队列的顺序执行。

setTimeout()的第二个参数告诉 JavaScript 再过多长时间把当前任务添加到队列中。如果队列是空的，那么添加的代码会立即执行; 如果队列不是空的，那么它就要等前面的代码执行完了以后再执行

<strong>你不知道的 setTimeout 之 delay = 0 和 第三个参数</strong>
```javascript
  setTimeout(() => {
    // code
  }, 0)

  // 虽然 setTimeout 延时 delay = 0，但是它还是异步。这是因为 HTML5 标准规定这个函数第二个参数不得小于 4 毫秒，不足会自动增加。

  // setTimeout 的第三个以后的参数是作为第一个func()的参数传进去，比如下边的代码
  function sum (x, y, z) {
    console.log(x+y+z)
  }

  setTimeout(sum, 1000, 1, 2, 3) 
  // 883  这是 setTimeout的 timeId
  // 6    这是执行setTimeout的结果

```
调用 setTimeout()之后，该方法会返回一个数值 ID，表示超时调用。这个超时调用 ID 是计划执行代码的唯一标识符，可以通过它来取消超时调用。要取消尚未执行的超时调用计划，可以调用 clearTimeout()方法并将相应的超时调用 ID 作为参数传递给它

```javascript
  //设置超时调用
  var timeoutId = setTimeout(function() {
    alert("Hello world!")
  }, 1000)
  //把它取消 
  clearTimeout(timeoutId)
```

间歇调用与超时调用类似，只不过它会按照指定的时间间隔重复执行代码，直至间歇调用被取消或 者页面被卸载。设置间歇调用的方法是 setInterval()，它接受的参数与 setTimeout()相同: 要执行的代码(字符串或函数)和每次执行之前需要等待的毫秒数

>  setInterval 的第三个以后的参数是作为第一个func()的参数传进去

```javascript
  // 不建议传递字符串
  setInterval('alert("Hello World")', 10000)

  // 推荐的调用方式
  setInterval(function () {
    alert("Hello World")
  }, 10000)
```
调用 setInterval()方法同样也会返回一个间歇调用 ID，该 ID 可用于在将来某个时刻取消间歇调用。要取消尚未执行的间歇调用，可以使用 clearInterval()方法并传入相应的间歇调用 ID。__取消间歇调用的重要性要远远高于取消超时调用__，因为在不加干涉的情况下，间歇调用将会一直执行到页面卸载

#### 为什么要用setTimeout模拟setInterval ?
我们需要知道，`浏览器`是个`多线程`应用，而Javascript是个`单线程`语言，当JS引擎执行代码块如setTimeOut时（也可来自浏览器内核的其他线程,如鼠标点击、AJAX异步请求等），会将对应任务添加到事件线程中。 由于JS的单线程关系，所以这些待处理队列中的事件都得排队等待JS引擎处理（当JS引擎空闲时才会去执行）

> 再次强调，定时器指定的时间间隔，表示的是何时将定时器的代码添加到消息队列，而不是何时执行代码。所以真正何时执行代码的时间是不能保证的，取决于何时被主线程的事件循环取到，并执行。

我们来看个例子: 
```javascript
  setInterval(function() {
    // code ...
  }, 100)
```
<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/js-red-eight-1.png'>

<ol>
  <li>setInterval每隔100ms往队列中添加一个事件; 100ms 后，添加T1定时器至Task队列中，主线程中的执行栈有任务在执行，所以等待。</li> 
  <li>some event 执行结束后，执行栈为空，于是去Task队列中拿出需要执行的代码，放至执行栈中执行，所以some event 执行结束后执行T1定时器代码</li> 
  <li>又过了100ms，T2定时器被添加到Task队列中，主线程还在执行T1代码，所以等待；</li>
  <li>又过了100ms，理论上又要往Task队列中推一个定时器代码，但<strong>由于此时T2还在队列中，所以T3不会被添加，结果就是跳过</strong></li>
  <li>而且这里我们能够看到，T1定时器执行结束后立即执行了T2代码，所以并没有达到定时器的效果</li>
</ol>
所以我们能知道，setInterval有两个缺点:

- 使用setInterval时，某些间隔会被跳过

- 可能多个定时器会连续执行

所以我们这么理解: <strong>每个setTimeout产生的任务会直接push到任务队列中；而setInterval在每次把任务push到任务队列前，都要进行一下判断(看上次的任务是否仍在队列中，在则跳过，不在则添加至Task队列)</strong>

你可能需要看下这篇文章: [Event loop](https://github.com/PDKSophia/blog.io/blob/master/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AF%87-Event-Loop.md)

#### 如何模拟？
setTimeout模拟setInterval，也可理解为链式的setTimeout
```javascript
  setTimeout(function() {
    // 任务
    setTimeout(arguments.callee, delay)
  }, delay)
```

### 系统对话框
- alert(): 接受一个字符串并将其显示给用户，结果就是向用户显示一个系统对话框

- confrim(): 显示“确定”和“取消”按钮。两个按钮可以让用户决定是否执行给定的操作

- prompt(): 用于提示用户输入一些 文本。提示框中除了显示 OK 和 Cancel 按钮之外，还会显示一个文本输入域，以供用户在其中输入内容

- find(): 显示查找对话框

- print(): 显示打印对话框

### location 对象
location 对象是很特别的一个对象，因为它既是 window 对象的属性，也是 document 对象的属性; 换句话说， *window.location 和 document.location 引用的是同一个对象*。 location 对象的用处不只表现在它保存着当前文档的信息，还表现在它将 URL 解析为独立的片段，让 开发人员可以通过不同的属性访问这些片段

| 属性名 | 例子 | 说明 | 
| :------: | :------: | :------: | 
| hash | `#contents` |  返回URL中的hash(#号后跟零或多个字符)，如果URL 中不包含散列，则返回空字符串 | 
| host | `www.abc.com:80` |  返回服务器名称和端口号(如果有) | 
| hostname | `www.abc.com` |  返回不带端口号的服务器名称 | 
| href | `http://www.abc.com` |  返回当前加载页面的完整URL |
| pathname | `/Files/` |  返回URL中的目录和(或)文件名 | 
| port | `8080` |  返回URL中指定的端口号。如果URL中不包含端口号，则 这个属性返回空字符串 | 
| protocol | `http:` | 返回页面使用的协议。通常是http:或https: | 
| search | `?q=javascript` | 返回URL的查询字符串。这个字符串以问号开头 | 

#### 查询字符串参数
尽管 location.search 返回从问号到 URL 末尾的所有内容，但却没有办法逐个 访问其中的每个查询字符串参数。为此，可以像下面这样创建一个函数，用以解析查询字符串，然后返 回包含所有参数的一个对象
```javascript
  function getQueryStringArgs () {
    // 取得查询字符串并去掉开头的问号
    var qs = (location.search.length > 0? location.search.substring(1) : '')

    // 保存数据的对象
    var args = {}
    
    // 取得每一项
    var items = qs.length ? qs.split('&') : []
    var item = null, name = null, value = null

    // for 循环， 逐个添加到 对象中
    for (let i = 0; i < items.length; i++) {
      item = items[i].split('=')
      name = decodeURIComponent(item[0])
      value = decodeURIComponent(item[1])
      
      if (name.length) {
        args[name] = value
      }
    }

    return args
  }

  // 假设查询字符串location.search为: ?tag=javascript&num=10
  var res = getQueryStringArgs()
  console.log(res['tag']) // javascript
  console.log(res['num']) // 10
```

#### 位置操作
改变浏览器位置的方法中，最常用的是设置 location.href 属性。另外，修改 location 对象的其他属性也可以改变当前加载的页面。下面的例子展示了通过将 hash、 search、hostname、pathname 和 port 属性设置为新值来改变 URL

```javascript
  //假设初始 URL 为 http://www.baidu.com/Files/

  //将 URL 修改为"http://www.baidu.com/Files/#section1"
  location.hash = "#section1"

  //将 URL 修改为"http://www.baidu.com/Files/?q=javascript" 
  location.search = "?q=javascript"

  //将 URL 修改为"http://www.yahoo.com/Files/" 
  location.hostname = "www.yahoo.com"

  //将 URL 修改为"http://www.yahoo.com/mydir/" 
  location.pathname = "mydir"

  //将 URL 修改为"http://www.yahoo.com:8080/Files/" 
  location.port = 8080
```

当通过上述任何一种方式修改 URL 之后，浏览器的历史记录中就会生成一条新记录，因此用户通 过单击“后退”按钮都会导航到前一个页面。

要禁用这种行为，可以使用 `replace()` 方法。这个方法只接受一个参数，*即要导航到的 URL*; 结果虽然会导致浏览器位置改变，但不会在历史记录中生成新记录。在调用 replace()方法之后，用户不能回到前一个页面

与位置有关的最后一个方法是 `reload()`，作用是*重新加载当前显示的页面*。如果调用 reload() 时不传递任何参数，页面就会以最有效的方式重新加载。也就是说，如果页面自上次请求以来并没有变过，页面就会从浏览器缓存中重新加载。如果要强制从服务器重新加载，则需要像下面这样为该方法传递参数 true。

```javascript
  location.reload()  //  重新加载(有可能从缓存中加载)
  location.reload(true)  // 重新加载(从服务器重新加载)
```

#### history 对象
history 对象保存着用户上网的历史记录，从窗口被打开的那一刻算起。因为 history 是 window 对象的属性，因此每个浏览器窗口、每个标签页乃至每个框架，都有自己的 history 对象与特定的 window 对象关联

使用 go()方法可以在用户的历史记录中任意跳转，可以向后也可以向前。这个方法接受一个参数， 表示向后或向前跳转的页面数的一个整数值。负数表示向后跳转(类似于单击浏览器的“后退”按钮)， 8 正数表示向前跳转(类似于单击浏览器的“前进”按钮)。

```javascript
  //后退一页 
  history.go(-1)

  //前进一页 
  history.go(1)

  //前进两页 
  history.go(2)
```
也可以给 go()方法传递一个字符串参数，此时浏览器会跳转到历史记录中包含该字符串的第一个位置——可能后退，也可能前进，具体要看哪个位置最近。如果历史记录中不包含该字符串，那么这个方法什么也不做

```javascript
  //跳转到最近的 wrox.com 页面 
  history.go("wrox.com")

  //跳转到最近的 nczonline.net 页面 
  history.go("nczonline.net")
```
另外，还可以使用两个简写方法 back()和 forward()来代替 go()。顾名思义，这两个方法可以 模仿浏览器的“后退”和“前进”按钮。
```javascript
  //后退一页
  history.back()

  //前进一页 
  history.forward() 
```

history 对象还有一个 length 属性，保存着历史记录的数量。这个数量包括所有历史记录，即所有向后和向前的记录。对于加载到窗口、标签页或框架中的第一个页面而言， history.length 等于 0。通过像下面这样测试该属性的值，可以确定用户是否一开始就打开了你的页面。
```javascript
  if (history.length === 0) {
    // 用户打开窗口后的第一个页面
    // code
  }
```

## Chapter Nine
### 能力检测
客户端检测形式是能力检测(又称特性检测)。能力检测的目标不是识别特定的浏览器，而是`识别浏览器的能力`。采用这种方式不必顾及特定的浏览器如何如何，只要确定浏览器支持特定的能力，就可以给出解决方案

*能力检测，不是浏览器检测*。检测某个或某几个特性并不能够确定浏览器。下面给出的这段代码(或与之差不多的代码)可以在 许多网站中看到，这种“浏览器检测”代码就是错误地依赖能力检测的典型示例。
```javascript
  //错误!还不够具体
  var isFirefox = !!(navigator.vendor && navigator.vendorSub)
  //错误!假设过头了
  var isIE = !!(document.all && document.uniqueID)
```
这两行代码代表了对能力检测的典型误用。以前，确实可以通过检测 navigator.vendor 和 navigator.vendorSub 来确定 Firefox 浏览器。但是，Safari 也依葫芦画瓢地实现了相同的属性。于是， 这段代码就会导致人们作出错误的判断。

为检测 IE，代码测试了 document.all 和 document. uniqueID。这就相当于假设 IE 将来的版本中仍然会继续存在这两个属性，同时还假设其他浏览器都不会实现这两个属性。最后，这两个检测都使用了双逻辑非操作符来得到布尔值

### 怪癖检测
与能力检测类似，怪癖检测(quirks detection)的目标是识别浏览器的特殊行为。但与能力检测确 认浏览器支持什么能力不同，怪癖检测是想要知道浏览器存在什么缺陷(“怪癖”也就是 bug)。这通常 需要运行一小段代码，以确定某一特性不能正常工作。例如，IE8 及更早版本中存在一个 bug，即如果 某个实例属性与[[Enumerable]]标记为 false 的某个原型属性同名，那么该实例属性将不会出现在 fon-in 循环当中。可以使用如下代码来检测这种“怪癖”。
```javascript
  var hasDontEnumQuirk = function () {
    var obj = {
      toString: function () {}
    }

    for (let prop in obj) {
      if (prop == 'toString') {
        return false
      }
    }
    return true
  }()
```
以上代码通过一个匿名函数来测试该“怪癖”，函数中创建了一个带有 toString()方法的对象。 在正确的 ECMAScript 实现中，toString 应该在 for-in 循环中作为属性返回

一般来说，“怪癖”都是个别浏览器所独有的，而且通常被归为 bug。在相关浏览器的新版本中，这 些问题可能会也可能不会被修复。

### 用户代理检测
第三种，也是争议最大的一种客户端检测技术叫做`用户代理检测`。用户代理检测通过检测用户代理字符串来确定实际使用的浏览器。在每一次 HTTP 请求过程中，用户代理字符串是作为响应首部发送的, 而且该字符串可以通过 JavaScript 的 __navigator.userAgent__ 属性访问。在服务器端，通过检测用户代理字符串来确定用户使用的浏览器是一种常用而且广为接受的做法。而在客户端，用户代理检测一般被当作一种万不得已才用的做法，其优先级排在能力检测和(或)怪癖检测之后

具体过程不说了，下面是完整的用户代理字符串检测脚本，包括检测呈现引擎、平台、Windows 操作系统、移动设备
和游戏系统。
```javascript
  var client = function () {
    
    // 呈现引擎
    var engine = {
      ie: 0,
      gecko: 0,
      webkit: 0,
      khtml: 0,
      opera: 0,

      // 完整的版本号
      ver: null
    };

    // 浏览器
    var browser = {
      // 主流浏览器
      ie: 0,
      firefox: 0,
      safari: 0,
      konq: 0,
      opera: 0,
      chrome: 0,

      // 具体版本号
      ver: null
    };

    // 平台、设备和操作系统
    var system = {
      win: false,
      mac: false,
      x11: false,

      // 移动设备
      iphone: false,
      ipod: false,
      ipad: false,
      ios: false,
      android: false,
      nokiaN: false,
      winMobile: false,

      // 游戏系统
      wii: false,
      ps: false
    };

    //检测呈现引擎和浏览器
    var ua = navigator.userAgent
    if (window.opera) {
      engine.ver = browser.ver = window.opera.version()
      engine.opera = browser.opera = parseFloat(engine.ver)
    } else if (/AppleWebKit\/(\S+)/.test(ua)) {
      engine.ver = RegExp["$1"]
      engine.webkit = parseFloat(engine.ver)

      // 确定是 chrome 还是 safari
      if (/Chrome\/(\S+)/.test(ua)) {
        browser.ver = RegExp["$1"]
        browser.chrome = parseFloat(browser.ver)
      } else if (/Version\/(\S+)/.test(ua)) {
        browser.ver = RegExp["$1"]
        browser.safari = parseFloat(browser.ver)
      } else {
        //近似地确定版本号
        var safariVersion = 1
        if (engine.webkit < 100){
          safariVersion = 1
        } else if (engine.webkit < 312){
          safariVersion = 1.2
        } else if (engine.webkit < 412){
          safariVersion = 1.3
        } else {
          safariVersion = 2
        }
        browser.safari = browser.ver = safariVersion
      }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
      engine.ver = browser.ver = RegExp["$1"];
      engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
      engine.ver = RegExp["$1"];
      engine.gecko = parseFloat(engine.ver);

      //确定是不是 Firefox
      if (/Firefox\/(\S+)/.test(ua)){
        browser.ver = RegExp["$1"];
        browser.firefox = parseFloat(browser.ver);
      }
    } else if (/MSIE ([^;]+)/.test(ua)) {
      engine.ver = browser.ver = RegExp["$1"];
      engine.ie = browser.ie = parseFloat(engine.ver);
    }

    // 检测浏览器
    browser.ie = engine.ie;
    browser.opera = engine.opera;
    
    //检测平台
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    
    // 检测window操作系统
    if (system.win) {
      if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
        if (RegExp["$1"] == "NT") {
          switch (RegExp['$2]') {
            case '5.0':
              system.win = '2000';
              break;
            case '5.1':
              system.win = 'XP';
              break;
            case '6.0':
              system.win = 'Vista';
              break;
            case '6.1':
              system.win = '7';
              break;
            default:
              system.win = 'NT';
              break;
          }
        } else if (RegExp["$1"] == "9x") {
          system.win = 'ME'
        } else {
          system.win = RegExp['$1']
        }
      }
    }
  
    // 移动设备
    system.iphone = ua.indexOf("iPhone") > -1;
    system.ipod = ua.indexOf("iPod") > -1;
    system.ipad = ua.indexOf("iPad") > -1;
    system.nokiaN = ua.indexOf("NokiaN") > -1;
    
    //windows mobile
    if (system.win == "CE") {
      system.winMobile = system.win;
    } else if (system.win == "Ph") {
        if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
          system.win = "Phone";
          system.winMobile = parseFloat(RegExp["$1"]);
        } 
      }

    //检测 iOS 版本
    if (system.mac && ua.indexOf("Mobile") > -1) {
      if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
        system.ios = parseFloat(RegExp.$1.replace("_", "."));
      } else {
        system.ios = 2; //不能真正检测出来，所以只能猜测
      } 
    }

    //检测 Android 版本
    if (/Android (\d+\.\d+)/.test(ua)) {
      system.android = parseFloat(RegExp.$1);
    }
    //游戏系统
    system.wii = ua.indexOf("Wii") > -1; 
    system.ps = /playstation/i.test(ua);

    // 返回这些对象
    return {
      engine: engine,
      browser: browser,
      system: system
    }
  }()

```
