---
title: JavaScript高级程序设计 - 打卡第四天
date: 2018-11-08 09:52:32
tags: card-4、递归、闭包、闭包与this对象、匿名函数与闭包、私有变量

---

# JavaScript高级程序设计 - 第三版

## Chapter Seven
### 递归
首先看个经典递归代码: 
```javascript
  function factorial(num) {
    if (num <= 1) {
      return 1
    } else {
      return num * factorial(num-1)
    }
  }
```
虽然看不出什么问题，但是下面的代码会导致它出错
```javascript
  function factorial(num) {
    if (num <= 1) {
      return 1
    } else {
      return num * factorial(num-1)
    }
  }
  
  var func = factorial
  factorial = null
  console.log(func(4)) // 报错
```
以上代码，将factorial()函数保存在变量func中，然后将factorial变量置为空，那么指向原始函数的引用只剩下一个了，但在接下来调用func(4)的时候，由于必须执行factorial()，而factorial已经不再是函数，所以会报错误。

使用`arguments.callee()` 可以解决这种问题，我们知道，`arguments.callee()`是一个指向正在执行的函数的指针
```javascript
  function factorial (num) {
    if (num <= 1) {
      return 1
  } else {
      return num * arguments.callee(num-1)
  }
```
但是在严格模式下，不能通过脚本访问 `arguments.callee`，访问这个属性会导致错误，因此使用命名函数表达式来达成相同的结果。例如:
```javascript
  var factorial = (function f(num){
    if (num <= 1) {
      return 1
    } else {
        return num * f(num-1)
    }
  })
```

### 闭包
<strong>闭包: 有权访问另一个函数作用域中的变量的函数。</strong>

创建闭包的常见方式，就是在一个函数内部创建另一个函数； 当某个函数被调用时，会创建一个执行环境以及相应的作用域链，然后，使用 arguments 和其他命名参数的值来初始化函数的活动对象，但在作用域链中，外部函数的活动对象是种处于第二位，外部函数的外部函数的活动对象处于第三位...一直到作为作用域链终点的全局执行环境。

来看个例子:
```javascript
  function compare (value1, value2) {
    if (value1 < value2) {
      return -1
    } else if (value1 > value2) {
      return 1
    } else {
      return 0
    }
  }

  var result = compare(5, 10)
```
下面的图，表示了 compare() 函数执行时的作用域链。首先定义了compare()函数，然后在全局作用域中调用了它。调用 compare() 函数的时候，会创建一个包含 `argumetns`、`value1`、`value2`的活动对象。全局执行环境的变量对象(包含result和compare)在compare()执行环境的作用域链中则处于第二位

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/js-red-seven-1.png' />

全局环境得变量对象始终存在，而像 compare() 函数这样的局部环境的变量对象，则只在函数执行的过程中存在。在创建 compare() 函数时，会先创建一个预先包括全局变量对象的作用域链，这个作用域链被保存在内部的 [[ Scope ]] 属性中。

当调用 compare() 函数的时候，会为函数创建一个执行环境，然后通过复制函数中的 [[ Scope ]]属性中的对象构建起执行环境的作用域链。此后，又有一个活动对象(在此作为变量对象使用)被创建并推入执行环境作用域链的前端。 (也就是作用域链的前端是compare的活动对象)

对于例子中的compare()函数的执行环境来说，其作用域链中包含两个变量对象: 本地活动对象和全局变量对象。显然，<strong>作用域链的本质是一个指向变量对象的指针列表</strong>

> 一般来讲，当函数执行完毕之后，局部活动对象就会被销毁，内存中仅保存着全局作用域，但是闭包不同，它会将活动对象添加到作用域链的前端，也就是说，局部活动对象被销毁，但是它的活动对象仍然留在内存中，这也就是为什么使用闭包可能会导致内存问题。因为闭包会携带包含它的函数的作用域，因此会比其他函数占用更多的内存

<strong>在一个函数内部定义的函数会将包含函数(即外部函数)的活动对象添加到它的作用域链中</strong>，例如下边代码
```javascript
  function createComparosonFunction(propertyName) {
    return function(object1, object2) {
      var value1 = object1[propertyName]
      var value2 = object2[propertyName]
      if (value1 < value2) {
        return -1
      } else if (value1 > value2) {
        return 1
      } else {
        return 0
      }
    }
  }

  var compare = createComparosonFunction('name')

  var result = compare({ name: 'PDK' }, { name: '彭道宽' })
```
在匿名函数从 createComparosonFunction() 被返回时，它的作用域被初始化为包含 createComparosonFunction() 函数的活动对象和全局变量对象，这样，匿名函数就可以访问在 createComparosonFunction() 中定义的所有变量。

最重要的是，createComparosonFunction() 执行完之后，它的活动对象不会被销毁，为什么呢？因为匿名函数的作用域链仍然在引用它的活动对象。换句换说，当createComparosonFunction()函数执行完毕之后，局部活动对象就会被销毁，但是因为闭包的原因，它的作用域链被添加到了作用域链的前端，导致createComparosonFunction()的活动对象会留在内存中，知道匿名函数被释放，createComparosonFunction()的活动对象才会被销毁。比如:

```javascript
  // 创建函数
  var compareName = createComparosonFunction('name')

  //调用函数
  var result = compareName({ name: 'PDK' }, { name: '彭道宽' })

  // 解除对匿名函数的引用   (以便释放内存) 
  compareName = null
```
设置compareName为null，是为了解除对函数的引用，等于通知垃圾回收机制将其回收，随着匿名函数的作用域链被销毁，其他作用域 (除了全局作用域)也都可以安全地销毁了

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/js-red-seven-2.png' />

注意: <strong>`作用域链的这种配置机制，引出了一个副作用，即闭包只能取得包含函数中任何变量的最后一个值`</strong>

强调: 任何变量的最后一个值

```javascript
  function createFunctions() {
    var result = new Array()
      
    for (var i = 0; i < 10; i++) {
      result[i] = function() {
        return i 
      }
    }

    return result
  }
```
从表面上看，似乎每个函数都应该有自己的索引值, 即位置0的函数返回0，1的函数返回1, 但实际上，每个函数都返回10，因为每个函数的作用域链中都保存着 createFunctions() 函数的活动对象，所以它们引用的都是同一个变量i，当createFunctions()函数被返回，变量i的值是10，由于作用域链的副作用，`每个函数都引用着保存变量i的同一个对象`。
```javascript
  解决方式，创建另一个匿名函数

  function createFunctions() {
    var result = new Array()

    for (var i = 0; i < 10; i++) {
      result[i] = function (num) {
        return function () {
          return num
        }
      }(i)
    }
    return result
  }

```
在上述代码中，没有立即将闭包赋给数组，而是定义了一个匿名函数，并将立即执行该匿名函数的结果赋给数组。这里的匿名函数有一个参数 num，也就是最终的函数要返回的值。在调用每个匿名函数时，我 们传入了变量 i。由于函数参数是按值传递的，所以就会将变量 i 的当前值`复制`给参数 num。而在这个 匿名函数内部，又创建并返回了一个访问 num 的闭包。这样一来，result 数组中的每个函数都有自己 num 变量的一个副本，因此就可以返回各自不同的数值了

#### 闭包与this对象
this 对象是在运行时基于函数的执 行环境绑定的: `在全局函数中，this 等于 window，而当函数被作为某个对象的方法调用时，this 等于那个对象`。不过，<strong>匿名函数的执行环境具有全局性</strong>，因此其 this 对象通常指向 window，(在使用call和apply改变函数执行环境下，this会指向其他对象)。但有时候，由于编写闭包的方式不同，这一点可能不会那么明显

```javascript
  var name = "The Window"
  var object = {
    name : "My Object",
    getNameFunc : function () {
      console.log('@@@@', this)  // 执行 object
      return function () {
        console.log(this)       // 指向 window 
        return this.name
      }
    }
  }
  console.log(object.getNameFunc()()) "The Window"(在非严格模式下)
  
  // 把外部作用域中的this对象保存在一个闭包能访问得到的变量里，这样就能让闭包访问该对象了

  var name = "The Window"
  var object = {
    name : "My Object",
    getNameFunc : function () {
      console.log('@@@@', this)  // 执行 object
      let _this = this
      return function () {
        console.log(this)       // 指向 window 
        console.log(_this)      // 指向 object
        return _this.name
      }
    }
  }
  console.log(object.getNameFunc()()) "My Object"
```
为什么匿名函数没 有取得其包含作用域(或外部作用域)的 this 对象呢 ? 

> 每个函数在被调用时都会自动取得两个特殊变量:`this` 和 `arguments`。内部函数在搜索这两个变量时，只会搜索到其活动对象为止，因此永远不可能直接访问外部函数中的这两个变量。

(怎么理解这句话？)，个人的理解： 在执行过程中，每个函数都会有一个执行环境，在getNameFunc()函数里的执行环境this指向的是 object，而在闭包中，`闭包又有自己的执行环境，而这里的this与它外部函数getNameFunc()的this是不相等的`，可能在某种情况下，它们都指向window，但是并不能说它们相等，而上述代码里，在定义匿名函数前，把this对象赋值给了 _this 变量，而在定义了闭包之后，闭包可以访问到外部函数的变量，即使在函数返回之后，闭包将活动对象添加到作用域链的前端，_this仍然引用着 object，所以会打印出 "My Object"


#### 匿名函数与闭包
什么是匿名函数 ？一般用到匿名函数都是立即执行的，通常叫做自执行匿名函数或者自调用匿名函数。常用来构建沙箱模式，作用是: `开辟封闭的变量作用域环境`。我们来看几个例子

```javascript
  (function(){ 
    console.log("我是匿名方式1")
  })()  //我是匿名方式1

  (function(){ 
    console.log("我是匿名方式2")
  }())  //我是匿名方式2

  (function(i, j, k){ 
    console.log(i+j+k)
  })(1, 3, 5) // 9
```

实际上，<strong>立即执行的匿名函数并不是函数</strong>，因为已经执行过了，所以它是一个结果，这个结果是对当前这个匿名函数执行结果的一个引用（`函数执行默认return undefined`）。这个结果可以是一个字符串、数字或者null/false/true，也可以是对象、数组或者一个函数（对象和数组都可以包含函数），<strong>当返回的结果包含函数时，这个立即执行的匿名函数所返回的结果就是典型的闭包了</strong>。

用匿名函数实现闭包
```javascript
  var func = (function() {
    var a = 10
    return function () {
      console.log(a)
    }
  })()

  func() // 10
  // func 作为立即执行匿名函数执行结果的一个接收，这个执行结果是闭包，func等于这个闭包。
  // 执行func就相当于执行了匿名函数内部return的闭包函数
  // 这个闭包函数可以访问到匿名函数内部的私有变量a，所以打印出10

```
所以，我们可以说: <strong>闭包跟函数是否匿名没有直接关系，匿名函数和具名函数都可以创建闭包 ！！！</strong>

### 内存泄漏
如果闭包的作用域链中保存着一个HTML 元素，那么就意味着该元素将无法被销毁
```javascript
  function assignHandler(){
    var element = document.getElementById("someElement")
    element.onclick = function () {
      console.log(element.id)
    }
  }
```
上代码创建了一个作为 element 元素事件处理程序的闭包，而这个闭包则又创建了一个循环引用, 由于匿名函数保存了一个对 assignHandler()的活动对象的引用，因此 就会导致无法减少 element 的引用数。只要匿名函数存在，element 的引用数至少也是 1，因此它所占用的内存就永远不会被回收，[垃圾回收机制看这里](https://github.com/PDKSophia/read-booklist/blob/master/JavaScript%E9%AB%98%E7%BA%A7%E7%BC%96%E7%A8%8B%E8%AE%BE%E8%AE%A1/play-card-1.md#%E5%9E%83%E5%9C%BE%E6%94%B6%E9%9B%86)

优化: 
```javascript
  function assignHandler () {
    var element = document.getElementById("someElement")
    var id = element.id
    element.onclick = function () {
      console.log(id)
    }
    element = null
  }
```
记住: `闭包会引用包含函数的整个活动对象`，而其中包含着 element。即使闭包不直接引用 element，包含函数的活动对象中也 仍然会保存一个引用。因此，有必要把 element 变量设置为 null。这样就能够解除对 DOM 对象的引用，顺利地减少其引用数，确保正常回收其占用的内存

### 私有变量

严格来讲，`JavaScript 中没有私有成员的概念;所有对象属性都是公有的`。不过，倒是有一个私有变量的概念。任何在函数中定义的变量，都可以认为是私有变量，因为不能在函数的外部访问这些变量

私有变量包括: `函数的参数`、`局部变量`和在`函数内部定义的其他函数`，比如:

```javascript
  function add(num1, num2){
    var sum = num1 + num2;
    return sum;
  }
```
在这个函数内部，有 3 个私有变量:num1、num2 和 sum。在函数内部可以访问这几个变量，但在函数外部则不能访问它们。<strong>如果在这个函数内部创建一个闭包，那么闭包通过自己的作用域链也可以访问这些变量。</strong>而利用这一点，就可以创建用于访问私有变量的公有方法。

我们把有权访问私有变量和私有函数的公有方法称为`特权方法`。有两种在对象上创建特权方法的方式。第一种是在构造函数中定义特权方法，基本模式如下
```javascript
  function MyObject(){
    var privateVariable = 10

    function privateFunction () {
      return false
    }

    this.publicMethod = function (){
      privateVariable++
      return privateFunction()
    }
  }
```
这个模式在构造函数内部定义了所有私有变量和函数。然后，又继续创建了能够访问这些私有成员的特权方法。能够在构造函数中定义特权方法，是因为<strong>特权方法作为`闭包`有权访问在构造函数中定义的所有变量和函数</strong>。(说白了，`特权方法就是闭包`，而利用闭包的作用域链，可以访问到外部函数的变量和方法)。对这个例子而言，变量 privateVariable 和函数 privateFunction()只能通过特 权方法 publicMethod()来访问。在创建 MyObject 的实例后，除了使用 publicMethod()这一个途 径外，没有任何办法可以直接访问 privateVariable 和 privateFunction()。

#### 静态私有变量
```javascript
  (function(){
    //私有变量和私有函数
    var privateVariable = 10

    function privateFunction() {
      return false;
    }

    //构造函数
    MyObject = function(){ }

    //公有/特权方法
    MyObject.prototype.publicMethod = function(){
      privateVariable++
      return privateFunction()
    }
  })()
```
> 记住 : 初始化未经声明的变量，总是会创建一个全局变量

- 这个模式创建了一个私有作用域，并在其中封装了一个构造函数及相应的方法

- 在私有作用域中， 首先定义了私有变量和私有函数，然后又定义了构造函数及其公有方法

- 这个模式在定义构造函数时并没有使用函数声明，而是`使用了函数表达式`。函数声明只能创建局部函数，但那并不是我们想要的。出于同样的原因，我们也没有在声明 MyObject 时使用 var 关键字

- 因此，MyObject 就成了一个全局变量，能够在私有作用域之外被访问到。但也要知道，在严格模式下 给未经声明的变量赋值会导致错误

这个模式与在构造函数中定义特权方法的主要区别: 就在于<strong><em>私有变量和函数是由实例共享的</em></strong>。由于特权方法是在原型上定义的，因此所有实例都使用同一个函数。而这个特权方法，作为一个闭包，总是保存着对包含作用域的引用

#### 模块模式
前面的模式是用于为自定义类型创建私有变量和特权方法的, 而道格拉斯所说的模块模式(module pattern)则是为单例创建私有变量和特权方法。所谓单例(singleton)，指的就是只有一个实例的对象。 按照惯例，<em>JavaScript 是以对象字面量的方式来创建单例对象的。</em>

> 模块模式通过为单例添加私有变量和特权方法能够使其得到增强
```javascript
  var singleton = function () {

    //私有变量和私有函数
    var privateVariable = 10
    function privateFunction () {
      return false
    }

    // 特权/公有方法和属性
    return {
      publicProperty: true,
      publicMethod: function () {
        privateVariable++
        return privateFunction()
      }
    }
  }()
```
这个模块模式使用了一个返回对象的匿名函数。在这个匿名函数内部，首先定义了私有变量和函数。 然后，<em>将一个对象字面量作为函数的值返回</em>。返回的对象字面量中只包含可以公开的属性和方法。由于这个对象是在匿名函数内部定义的，因此它的公有方法有权访问私有变量和函数。从本质上来讲，这个对象字面量定义的是单例的公共接口

有人进一步改进了模块模式，即在返回对象之前加入对其增强的代码。这种增强的模块模式适合那 些单例必须是某种类型的实例，同时还必须添加某些属性和(或)方法对其加以增强的情况。来看下面的例子

```javascript
  var singleton = function () {

    //私有变量和私有函数
    var privateVariable = 10
    function privateFunction () {
      return false
    }

    // 创建对象
    var obj = new Object()

    // 特权/公有方法和属性
    obj.publicProperty = true
    obj.publicMethod - function () {
      privateVariable++
      return privateFunction()
    }
    
    // 返回这个对象
    return obj
  }()
```
