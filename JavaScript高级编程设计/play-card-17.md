---
title: JavaScript高级程序设计 - 打卡第十七天
date: 2018-11-23 15:57:32
tags: card-17、作用域安全的构造函数

---
# JavaScript高级程序设计 - 第三版

## Chapter Twenty-Two
### 安全的类型检测
JavaScript 内置的类型检测机制并非完全可靠，比如 Safari 在对正则表达式应用 typeof 操作符时会返回 `' function '`，再比如， instanceof 操作符再存在多个全局作用域的情况下，也存在诸多问题。

如何解决？我们都知道，在任何值上调用 Object 原生的 toString() 方法，都会返回一个 `[object NativeConstructorName]` 格式的字符串，。每个类在内部都有一个 [[Class]] 属
性，这个属性中就指定了上述字符串中的构造函数名。

```javascript
  var arr = ['red', 'black']
  console.log(Object.prototype.toString.call(arr)) // [object Array]
```

由于原生数组的构造函数名与全局作用域无关，因此使用 toString() 就能保证返回一致的值，基于这一思路来测试某个值是不是原生函数或正则表达式

```javascript
  function isFunction(value) {
    return Object.prototype.toString.call(value) == '[object Function]'
  }

  function isRegExp(value) {
    return Object.prototype.toString.call(value) == '[object RegExp]'
  }
```
<strong>Object 的 toString() 方法不能检测非原生构造函数的构造函数名</strong>。因此，开发人员定义的任何构造函数都将返回 `[object Object]`。

### 作用域安全的构造函数
构造函数其实就是一个使用 `new` 操作符调用的函数。当使用 new 调用时，构造函数内用到的 this 对象会指向新创建的对象实例。比如下边的例子
```javascript
  function Person (name, age, job) {
    this.name = name
    this.age = age
    this.job = job
  }

  var p1 = new Person('彭道宽', 21, '前端工程师')
  console.log(p1.name) // 彭道宽
  console.log(p1.age) // 21

  console.log(window.name) // ''， 之所以不为undefined是由于window自带name属性，且该属性为 '' 
  console.log(window.age) // undefined

```
上面这个例子中，Person构造函数使用this对象给三个属性赋值: name、age和job。当和new 操作符连用时，则会创建一个新的 Person 对象，同时会给它分配这些属性。

问题出在当没有使用 new 操作符来调用该构造函数的情况上。由于该 this 对象是在运行时绑定的，所以直接调用 Person()， this 会映射到全局对象 window 上，导致错误对象属性的意外增加, 如下边例子

```javascript
  function Person (name, age, job) {
    this.name = name
    this.age = age
    this.job = job
  }

  var p1 = Person('彭道宽', 21, '前端工程师')
  console.log(p1.name) // Uncaught TypeError: Cannot read property 'name' of undefined
  console.log(p1.age) // Uncaught TypeError: Cannot read property 'age' of undefined

  console.log(window.name) // 彭道宽 
  console.log(window.age) // 21
```
这里，原本针对 Person 实例的三个属性被加到 window 对象上，<strong>因为构造函数是作为普通函数调用的</strong>，忽略了 new 操作符。这个问题是由 this 对象的晚绑定造成的，<strong>在这里 this 被解析成了 window 对象</strong>。

那么针对这种情况，如何解决呢？ 解决方式就是 <strong>`创建一个作用域安全的构造函数`</strong>。

作用域安全的构造函数在进行任何更改前，首先确认 this 对象是正确类型的实例。如果不是，那么会创建新的实例并返回

```javascript
  function Person (name, age, job) {
    if (this instanceof Person) {
      this.name = name
      this.age = age
      this.job = job
    } else {
      return new Person(name, age, job)
    }
  }

  var p1 = Person('彭道宽', 21, '前端工程师')
  console.log(window.name)  // ''
  console.log(p1.name)      // 彭道宽

  var p2 = new Person('PDK', 18, 'Web')
  console.log(window.name)  // ''
  console.log(p2.name)      // PDK

```
这段代码中的 Person 构造函数添加了一个检查并确保 this 对象是 Person 实例的 if 语句，它表示要么使用 new 操作符，要么在现有的 Person 实例环境中调用构造函数。任何一种情况下，对象初始化都能正常进行。如果 this 并非 Person 的实例，那么会再次使用 new 操作符调用构造函数并返回结果。最后的结果是，*调用 Person 构造函数时无论是否使用 new 操作符，都会返回一个 Person 的新实例*。

但是你以为这就没问题了嘛？？不存在的，如果你使用了作用域安全的构造函数之后，你就锁定了可以调用构造函数的环境。这时候，如果你使用构造函数窃取模式的继承且不使用原型链，那么这个继承很可能被破坏, 比如下边代码

```javascript
  function Person(len) {
    if (this instanceof Person) {
      this.len = len
      this.getArea = function () {
        return 0
      }
    } else {
      return new Person(len)
    }
  }

  function Child(height, width) {
    Person.call(this, 3)
    this.height = height
    this.width = width
    this.getArea = function () {
      return this.height * this.width
    }
  }

  var ch1 = new Child(5, 10)
  console.log(ch1.len)  // undefined  
  console.log(ch1.constructor) // Child
  console.log(Child.prototype.constructor) // Child
  console.log(ch1.__proto__ === Child.prototype)  // true
  console.log(Child.__proto__ === Person.prototype)  // false
  console.log(Child.__proto__ === Function.prototype)  // true

```
在这段代码中，Person 构造函数是作用域安全的，然而 Child 构造函数则不是。新创建一个 Child 实例之后，这个实例应该通过 Person.call() 来继承 Person 的 len 属性。但是，由于 Person 构造函数是作用域安全的，this 对象并非 Person 的实例，所以会创建并返回一个新的 Person 对象。Child 构造函数中的 this 对象并没有得到增长, 换句话说，Person.call() 并没有实现继承。所以 Child 实例中就没有 len 这个属性

那么又该如何解决呢？<strong>使用构造函数窃取结合使用 `原型链` 或者 `寄生组合` 则可以解决这个问题</strong>

```javascript
  function Person(len) {
    if (this instanceof Person) {
      this.len = len
      this.getArea = function () {
        return 0
      }
    } else {
      return new Person(len)
    }
  }

  function Child(height, width) {
    Person.call(this, 3)
    this.height = height
    this.width = width
    this.getArea = function () {
      return this.height * this.width
    }
  }

  Child.prototype = new Person()

  var ch1 = new Child(5, 10)
  console.log(ch1.len)  // 3
  console.log(ch1.constructor) // Person
  console.log(Child.prototype.constructor) // Person
  console.log(ch1.__proto__ === Child.prototype) // true 
  console.log(Child.__proto__ === Function.prototype) // true
  console.log(Person.__proto__ === Function.prototype) // true
  
```
为什么加了一句 `Child.prototype = new Person()` 就可以了呢？因为一个 Child 实例也同时是一个 Person 实例，所以 Person.call() 会照原意执行，最终为 Child 实例添加了 len 属性

### 惰性载入函数
因为浏览器之间行为的差异，多数 JavaScript 代码包含了大量的 if 语句，将执行引导到正确的代码中。比如说，你调用某一函数判断a的时候，总会走一些其他的分支，比如说 if (a<3) , else if (a > 20)，在你第一次执行该函数的时候就知道 a = 10，那么第二次，第三次执行该函数，就没必要走这些分支了。举个例子，打卡第十五天里的 [createXHR()](https://github.com/PDKSophia/read-booklist/blob/master/JavaScript%E9%AB%98%E7%BA%A7%E7%BC%96%E7%A8%8B%E8%AE%BE%E8%AE%A1/play-card-15.md#xmlhttprequest%E5%AF%B9%E8%B1%A1) 函数:

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
每次调用 createXHR()的时候，它都要对浏览器所支持的能力仔细检查。

首先检查内置的 XHR， 然后测试有没有基于 ActiveX 的 XHR，最后如果都没有发现的话就抛出一个错误。每次调用该函数都是这样，即使每次调用时分支的结果都不变: 如果浏览器支持内置 XHR，那么它就一直支持了，那么这 种测试就变得没必要了。

> 即使只有一个 if 语句的代码，也肯定要比没有 if 语句的慢，所以如果 if 语句不必每次执行，那么代码可以运行地更快一些。解决方案就是称之为 `惰性载入` 的技巧。惰性载入表示函数执行的分支仅会发生一次。

有两种实现惰性载入的方式，第一种就是在函数被调用时再处理函数。在第一次调用的过程中，该函数会被覆盖为另外一个按合适方式执行的函数，这样任何对原函数的调用都不用再经过执行的分支了

```javascript
  function createXHR () {
    if (typeof XMLHttpRequest != 'undefined') {
      createXHR = function () {
        return new XHLHttpRequest()
      }
    } else if (typeof ActiveObject != 'undefined') {
      createXHR = function () {
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
      }
    } else {
      createXHR = function () {
        throw new Error('NO XHR object available')
      }
    }

    return createXHR()
  }

```
在这个惰性载入的 createXHR()中，if 语句的每一个分支都会为 createXHR 变量赋值，有效覆盖了原有的函数。最后一步便是调用新赋的函数。下一次调用 createXHR()的时候，就会直接调用被分配的函数，这样就不用再次执行 if 语句了。

第二种实现惰性载入的方式是在声明函数时就指定适当的函数。这样，第一次调用函数时就不会损失性能了，而在代码首次加载时会损失一点性能。(其实就是通过匿名函数立即执行)

```javascript
  var createXHR = (function() {
    if (typeof XMLHttpRequest != 'undefined') {
      return function () {
        return new XHLHttpRequest()
      }
    } else if (typeof ActiveObject != 'undefined') {
      return function () {
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
      }
    } else {
      return function () {
        throw new Error('NO XHR object available')
      }
    }
  })()
```

### 函数绑定 - bind()

函数绑定要创建一个函数，可以在特定的 this 环境中以指定参数调用另一个函数。该技巧常常和回调函数与事件处理程序一起使用，以便在将函数作为变量传递的同时保留代码执行环境。我们来看段代码:

```javascript
  EventUtil: {
    /*
     * desc: 视情况而定使用不同的事件处理程序
     * @param : element，要操作的元素
     * @param : type，事件名称
     * @param : handler，事件处理程序函数
    */
    addHandler: function (element, type, handler) {
      if (element.addEventListener) { // DOM2级
        element.addEventListener(type, handler, false)
      } else if (element.attachEvent) { // IE级
        element.attachEvent(`on${type}`, handler)
      } else {
        element[`on${type}`] = handler // DOM0级
      }
    }
  }

  var handler = {
    message: 'I am message',

    handleClick: function () {
      console.log(this.message)
    }
  }

  var btn = document.getElementById('click-btn')
  EventUtil.addHandler(btn, 'click', handler.handleClick)

```
正常来讲，当我们按下这个按钮的时候，就调用 `handler.handleClick()` 函数，打印 ' I am message '，但是实际上显示的是 " undefined "，为什么呢？

问题就在于没有保存 handler.handleClick() 的环境，所以 this 对象最后是指向了 DOM按钮 而不是 handler对象。所以通过一个闭包，来解决这个问题，[不知道闭包的点击这里！！！](https://github.com/PDKSophia/read-booklist/blob/master/JavaScript%E9%AB%98%E7%BA%A7%E7%BC%96%E7%A8%8B%E8%AE%BE%E8%AE%A1/play-card-4.md#%E9%97%AD%E5%8C%85)

```javascript
  var handler = {
    message: 'I am message',

    handleClick: function () {
      console.log(this.message)
    }
  }
  
  var btn = document.getElementById('click-btn')
  EventUtil.addHandler(btn, 'click', function (event) {
    handler.handleClick(event)
  })
```
这个解决方案就是在 onclick 事件处理程序中，使用了一个闭包直接调用 handler.handleClick()，在 JavaScript 库中实现了一个可以将函数绑定到执行环境的函数中，这个函数叫做 `bind()`

bind()函数是在 ES5 才被加入；它可能无法在所有浏览器上运行。这就需要我们自己实现bind()函数了。自己实现一个 bind() ？ 先不急，我们再来看一个概念，叫做: 函数柯里化 ！！！

### 函数柯里化
它用于创建已经设置好了一个或多 个参数的函数。函数柯里化的基本方法和函数绑定是一样的: 使用一个闭包返回一个函数。两者的区别在于 : <strong>当函数被调用时，返回的函数还需要设置一些传入的参数</strong>

```javascript
  function add (num1, num2) {
    return num1 + num2
  }

  function curriedAdd(num2) {
    return add(5, num2)
  }

  console.log(add(2, 3))        // 5
  console.log(curriedAdd(3))    // 8
```
这段代码定义了两个函数: add() 和 curriedAdd()。后者本质上是在任何情况下第一个参数为 5 的 add()版本。尽管从技术上来说 curriedAdd()并非柯里化的函数，但它很好地展示了其概念。

柯里化函数通常由以下步骤动态创建 : 调用另一个函数并为它传入要柯里化的函数和必要参数。下面是创建柯里化函数的通用方式。

```javascript
  function curry (fn) {
    var args = Array.prototype.slice.call(arguments, 1)
    return function () {
      var innerArgs = Array.prototype.slice.call(arguments)
      var finalArgs = args.concat(innerArgs)
      return fn.apply(null, finalArgs)
    }
  }
```
curry() 函数的主要工作就是将被返回函数的参数进行排序。curry() 的第一个参数是要进行柯里化的函数，其他参数是要传入的值。为了获取第一个参数之后的所有参数，在 arguments 对象上调用了 slice()方法，并传入参数 1 表示被返回的数组包含从第二个参数开始的所有参数。

然后 args 数组包含了来自外部函数的参数。在内部函数中，创建了 innerArgs 数组用来存放所有传入的参数(又一次用到了 slice())。有了存放来自外部函数和内部函数的参数数组后，就可以使用 concat() 方法将它们组合为 finalArgs，然后使用 apply() 将结果传递给该函数。注意这个函数并没有考虑到执行环境，所以调用 apply()时第一个参数是 null。curry()函数可以按以下方式应用

```javascript
  function add (num1, num2) {
    return num1 + num2
  }

  var curriedAdd = curry(add, 5)
  console.log(curriedAdd(3)) // 8
```
在这个例子中，创建了第一个参数绑定为 5 的 add()的柯里化版本。当调用 curriedAdd()并传入 3 时，3 会成为 add() 的第二个参数，同时第一个参数依然是 5，最后结果便是和 8。你也可以像下面例子这样给出所有的函数参数

```javascript
  function add (num1, num2) {
    return num1 + num2
  }

  var curriedAdd = curry(add, 5, 12)
  console.log(curriedAdd())  // 17
```
在这里，柯里化的 add()函数两个参数都提供了，所以以后就无需再传递它们了。

#### 结合函数柯里化的情况，实现一个_bind()函数

```javascript
  // 写法一
  Function.prototype._bind = function (context) {
    var args = Array.prototype.slice.call(arguments, 1) // 表示被返回的数组包含从第二个参数开始的所有参数。
    var self = this // 保存this，即调用_bind方法的目标函数
    return function () {
      var innerArgs = Array.prototype.slice.call(arguments)
      var finalArgs = args.concat(innerArgs)
      return self.apply(context, finalArgs)
    }
  }

  // 写法二
  function _bind (fn, context) {
    var args = Array.prototype.slice.call(arguments, 2) // 表示被返回的数组包含从第三个参数开始的所有参数。
    return function () {
      var innerArgs = Array.prototype.slice.call(arguments)
      var finalArgs = args.concat(innerArgs)
      return fn.apply(context, finalArgs)
    }
  }
```
所以这时候我们通过绑定函数给之前的例子重写一下，就能正常了～
```javascript
  var handler = {
    message: 'I am message',

    handleClick: function (name, event) {
      console.log(this.message + ':' + name + ':' + event.type)
    }
  }
  
  var btn = document.getElementById('click-btn')
  EventUtil.addHandler(btn, 'click', _bind(handler.handleClick, handler, 'btn'))
```
在这个更新过的例子中，handler.handleClick() 方法接受了两个参数: 要处理的元素的名字和 event 对象。作为第三个参数传递给 bind()函数的名字，又被传递给了 handler.handleClick()， 而 handler.handleClick() 也会同时接收到 event 对象。
