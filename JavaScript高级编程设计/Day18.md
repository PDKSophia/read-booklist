# JavaScript 高级程序设计 - 第三版

## Chapter Twenty-Two

### 防篡改对象

#### 不可扩展对象

默认情况下，所有对象都是可以扩展的。也就是说，任何时候都可以向对象中添加属性和方法。例如，可以像下面这样先定义一个对象，后来再给它添加一个属性

```javascript
var person = { name: 'PDK' }
person.age = 21
```

即使第一行代码已经完整定义 person 对象，但第二行代码仍然能给它添加属性。现在，使用 `Object.preventExtensions()`方法可以改变这个行为，让你不能再给对象添加属性和方法。

```javascript
var person = { name: 'PDK' }
Object.preventExtensions(person)

person.age = 21
console.log(person.age) // undefined
```

在调用了 `Object.preventExtensions()` 方法后，就不能给 person 对象添加新属性和方法了。 在非严格模式下，给对象添加新成员会导致静默失败，因此 person.age 将是 undefined。而在严格模式下，尝试给不可扩展的对象添加新成员会导致抛出错误。

虽然不能给对象添加新成员，但已有的成员则丝毫不受影响。你仍然还可以修改和删除已有的成员。 另外，使用 `Object.istExtensible()` 方法还可以确定对象是否可以扩展

```javascript
var person = { name: 'PDK' }
console.log(Object.isExtensible(person)) //true

Object.preventExtensions(person)
console.log(Object.isExtensible(person)) //false
```

#### 密封的对象

密封对象不可扩展，而 且已有成员的[[Configurable]]特性将被设置为 false。这就意味着不能删除属性和方法，因为不能 使用 Object.defineProperty() 把数据属性修改为访问器属性，或者相反。属性值是可以修改的, 要密封对象，可以使用 `Object.seal()` 方法

```javascript
var person = { name: 'PDK' }
Object.seal(person)

person.age = 21
console.log(person.age) // undefined

delete person.name
console.log(person.name) // PDK
```

在这个例子中，添加 age 属性的行为被忽略了。而尝试删除 name 属性的操作也被忽略了，因此这个属性没有受任何影响。这是在非严格模式下的行为。在严格模式下，尝试添加或删除对象成员都会导 致抛出错误。

> 使用 `Object.isSealed()` 方法可以确定对象是否被密封了。因为被密封的对象不可扩展，所以用 `Object.isExtensible()` 检测密封的对象也会返回 `false`。

```javascript
var person = { name: 'PDK' }
console.log(Object.isExtensible(person)) //true
console.log(Object.isSealed(person)) //false

Object.seal(person)

console.log(Object.isExtensible(person)) //false
console.log(Object.isSealed(person)) //true
```

#### 冻结的对象

最严格的防篡改级别是冻结对象，**冻结的对象既不可扩展，又是密封的**，而且对象数据属性的[[Writable]]特性会被设置为 false。如果定义[[Set]]函数，访问器属性仍然是可写的。 ES5 定义的 `Object.freeze()`方法可以用来冻结对象。

```javascript
var person = { name: 'PDK' }
Object.freeze(person)

person.age = 29
alert(person.age) // undefined

delete person.name
alert(person.name) // PDK

person.name = 'Greg'
alert(person.name) // PDK
```

与密封和不允许扩展一样，对冻结的对象执行非法操作在非严格模式下会被忽略，而在严格模式下会抛出错误。

> 使用 `Object.isFrozen()` 方法用于检测冻结对象。因为冻结对象既是密封的又是不可扩展的，所以用 Object.isExtensible() 和 Object.isSealed() 检测冻结对象将分别返回 false 和 true。

```javascript
var person = { name: 'PDK' }
alert(Object.isExtensible(person)) // true
alert(Object.isSealed(person)) // false
alert(Object.isFrozen(person)) // false

Object.freeze(person)
alert(Object.isExtensible(person)) // false
alert(Object.isSealed(person)) // true
alert(Object.isFrozen(person)) // true
```

### 函数节  流

DOM 操作比起非 DOM 交互需要更多的内存和 CPU 时间。连续尝试进行过多的 DOM 相关操作可能会导致浏览器挂起，有时候甚至会崩溃。尤其在 IE 中使用 onresize 事件处理程序的时候容易发生，当调整浏览器大小的时候，该事件会连续触发。 在 onresize 事件处理程序内部如果尝试进行 DOM 操作，其高频率的更改可能会让浏览器崩溃

函数节流背后的基本思想是指 ：<strong>某些代码不可以在没有间断的情况连续重复执行</strong>。第一次调用函数，创建一个定时器，在指定的时间间隔之后运行代码。当第二次调用该函数时，它会清除前一次的定时器并设置另一个。如果前一个定时器已经执行过了，这个操作就没有任何意义。然而，如果前一个定时器尚未执行，其实就是将其替换为一个新的定时器。**目的是只有在执行函数的请求停止了一段时间之后才执行**。

```javascript
var processor = {
  timeoutId: null,

  // 实际进行处理的方法
  performProcessing: function() {
    // 实际执行带代码
  },

  // 初始化处理调用的方法
  process: function() {
    clearTimeout(this.timeoutId)

    var _this = this
    this.timeoutId = setTimeout(function() {
      _this.performProcessing
    }, 100)
  }
}

// 尝试开始执行
processor.proccess()
```

当调 用了 process()，第一步是清除存好的 timeoutId，来阻止之前的调用被执行。然后，创建一个新的定时器调用 performProcessing()。由于 setTimeout()中用到的函数的环境总是 window，所以有必要保存 this 的引用以方便以后使用。

时间间隔设为了 100ms，这表示最后一次调用 process()之后至少 100ms 后才会调用 performProcessing()。所以如果 100ms 之内调用了 process()共 20 次，performanceProcessing()仍只 会被调用一次。

这个模式可以使用 `throttle()` 函数来简化，这个函数可以自动进行定时器的设置和清除，如下例所示:

```javascript
function throttle(method, context) {
  clearTimeout(method.tId)

  method.tId = setTimeout(function() {
    method.call(context)
  }, 100)
}
```

throttle()函数接受两个参数: **要执行的函数以及在哪个作用域中执行**。

上面这个函数首先清除之前设置的任何定时器。定时器 ID 是存储在函数的 tId 属性中的，第一次把方法传递给 throttle() 的时候，这个属性可能并不存在。接下来，创建一个新的定时器，并将其 ID 储存在方法的 tId 属性中。 如果这是第一次对这个方法调用 throttle() 的话，那么这段代码会创建该属性。定时器代码使用 call()来确保方法在适当的环境中执行。如果没有给出第二个参数，那么就在全局作用域内执行该方法。

_节流在 resize 事件中是最常用的_, 例如，假设有一个`<div/>`元素需要保持它的高度始终等同于宽度。那么实现这一功能的 JavaScript 可以如下编写

```javascript
window.onresize = function() {
  var div = document.getElementById('myDiv')
  div.style.height = div.offsetWidth + 'px'
}
```

这段非常简单的例子有两个问题可能会造成浏览器运行缓慢。首先，要计算 offsetWidth 属性， 如果该元素或者页面上其他元素有非常复杂的 CSS 样式，那么这个过程将会很复杂。其次，设置某个元素的高度需要对页面进行回流来令改动生效。如果页面有很多元素同时应用了相当数量的 CSS 的话，这又需要很多计算。这就可以用到 throttle()函数

```javascript
function throttle(method, context) {
  clearTimeout(method.tId)

  method.tId = setTimeout(function() {
    method.call(context)
  }, 100)
}

function resizeDiv() {
  var div = document.getElementById('myDiv')
  div.style.height = div.offsetWidth + 'px'
}

window.onresize = function() {
  throttle(resizeDiv)
}
```

关于[防抖和节流](https://github.com/PDKSophia/blog.io/blob/master/JavaScript%E7%AF%87-%E9%98%B2%E6%8A%96%E5%92%8C%E8%8A%82%E6%B5%81.md)可以看看这里
