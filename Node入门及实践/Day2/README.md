- [Day2](#Day2)
  - [全局对象与全局变量](#全局对象与全局变量)
    - [process](#process)
    - [console](#console)
    - [buffer](#buffer)
    - [事件驱动](#事件驱动)
      - [事件发射器](#事件发射器)
      - [error事件](#error事件)
      - [继承EventEmitter](#继承EventEmitter)

# Day2

## 全局对象与全局变量

在浏览器中，全局对象指的是 `window` 对象。在 window 对象上定义的任何内容都可以被全局访问到。比如 setTimeout 就是 `window.setTimeout`， document 其实就是 `window.document`

- global : 和 window 一样，任何 global 对象上的属性都可以被全局访问到

- process : 所有全局执行上下文中的内容都在 process 对象中。在浏览器中，只有一个 window，在 node 中，也只有一个 process。比如，在浏览器中窗口名是 window.name，在 node 中进程名是 process.title

### process

process——用于描述当前 Node.js 进程状态 的对象，提供了一个与操作系统的简单接口。下面将会介绍 process 对象的一些最常用的成员方法。

- process.argv ：命令行参数数组。第一个元素是 node，第二个元素是脚本文件名，从第三个元素开始每个元素是一个运行参数

```javascript
console.log(process.argv)
```

- process.stdin ：标准输出流，初始时它是被暂停的，想要从标准输入读取数据，必须恢复流，并手动编写流的事件响应函数

```javascript
process.stdin.resume()

process.stdin.on('data', function(data) {
  process.stdout.write('read from console : ' + data.toString())
})
```

- process.nextTick(callback) ：为事件循环设置一项任务，Node.js 会在 下次事件循环调响应时调用 callback。

Node.js 适合 I/O 密集型的应用，而不是计算密集型的应用， 因为一个 Node.js 进程只有一个线程，因此在任何时刻都只有一个事件在执行。如果这个事 件占用大量的 CPU 时间，执行事件循环中的下一个事件就需要等待很久，因此 Node.js 的一 个编程原则就是尽量缩短每个事件的执行时间。`process.nextTick()` 提供了一个这样的工具，可以把复杂的工作拆散，变成一个个较小的事件。

```javascript
console.log(1)
process.nextTick(function() {
  console.log(3)
})
console.log(2)

// 1
// 2
// 3
```

> 可以把它想像成 setTimeout(fn , 0)，但是不要使用 setTimeout(fn,0) 代替 process.nextTick(callback)， 前者比后者效率要低得多。其实 process.nextTick 相当 setImmediate

### console
console 用于提供控制台标准输出，它是由 Internet Explorer 的 JScript 引擎提供的调试 工具，后来逐渐成为浏览器的事实标准

- console.log() : 向标准输出流打印字符并以换行符结束。console.log 接受若干 个参数，如果只有一个参数，则输出这个参数的字符串形式。

- console.error() : 与 console.log()用法相同，只是向标准错误流输出。 

- console.trace() : 向标准错误流输出当前的调用栈。
 
### buffer
buffer 是一个表示固定内存分配的全局对象(缓冲区中的字节数需要提前定下)，它就好比是一个由八位字节元素组成的数组，可以有效地在JavaScript中表示二进制数据。该功能一部分作用是可以对数据进行编码转换。
```javascript
var myBuffer = new Buffer('PDK_IMAGE', 'base64')

console.log(myBuffer)
require('fs').writeFile('logo.png', myBuffer)
```
在Node中，绝大部分进行数据IO操作的API都用buffer来接收和返回数据。

### 事件驱动

Node.js 中的基础 API 之一就是 `EventEmitter` ，无论是在 Node 中还是在浏览器中，大量代码都依赖于所监听或者分发的事件

```javascript
window.addEventListener('load', function() {
  console.log('load')
})
```

浏览器中负责处理事件相关的 DOM API 主要是包括 addEventListener、removeEventListener、以及 dispatchEvent。他们还用在一系列从 window 到 XMLHttpRequest 等其他对象上

在 Node 中，可能我们也希望随时进行事件的监听和分发，为此，node 暴露了 Event EmitterAPI，该 API 上定义了 on、emit、removeListener 方法，它以 process.EventEmitter 形式暴露才出来

```javascript
var EventEmitter = require('events').EventEmitter

var event = new EventEmitter()
event.on('event', function() {
  console.log('event called')
})

event.emit('event')
```
__事件是Node非阻塞设计的重要体现__。Node通常不会直接返回数据(因为这样可能会在等待某个资源的时候发生线程阻塞)，而是采用分发事件来传递数据的方式

例如这个例子，我们要通过POST请求提交一个表单
```javascript
var http = require('http')

http.Server(function (req, res) {
  var buffer = ''

  req.on('data', function (data) {
    buffer += data
  })

  req.on('end', function () {
    console.log('数据接收完毕')
  })
})

// 将请求数据内容进行缓存(data事件)，等到所有数据都接收完毕之后(end事件)再对数据进行处理
```
#### 事件发射器
再回到 events 模块上，events 模块只提供了一个对象: `events.EventEmitter`。EventEmitter 的核心就是 *事件发射与事件监听器功能的封装* 。EventEmitter 的每个事件由一个事件名和若干个参 数组成，事件名是一个字符串，通常表达一定的语义。对于每个事件，EventEmitter 支持若干个事件监听器。当事件发射时，注册到这个事件的事件监听器被依次调用，事件参数作为回调函数参数传递。

```javascript
var events = require('events')

var emitter = new events.EventEmitter()

emitter.on('someEvent', function(arg1, arg2) { 
  console.log('listener1', arg1, arg2);
})

emitter.on('someEvent', function(arg1, arg2) { 
  console.log('listener2', arg1, arg2);
});

emitter.emit('someEvent', 'pdk', 1991);
```
以上例子中，emitter 为事件 someEvent 注册了两个事件监听器，然后发射了 someEvent 事件。运行结果中可以看到两个事件监听器回调函数被先后调用。

- EventEmitter.on(event, listener) 为指定事件注册一个监听器，接受一个字符串event 和一个回调函数listener。

- EventEmitter.emit(event, [arg1], [arg2], [...]) 发射 event 事件，传递若干可选参数到事件监听器的参数表。

- EventEmitter.once(event, listener) 为指定事件注册一个单次监听器，即监听器最多只会触发一次，触发后立刻解除该监听器。

- EventEmitter.removeListener(event, listener) 移除指定事件的某个监听器，listener 必须是该事件已经注册过的监听器。

- EventEmitter.removeAllListeners([event]) 移除所有事件的所有监听器， 如果指定 event，则移除指定事件的所有监听器。

#### error事件
EventEmitter 定义了一个特殊的事件 error，它包含了“错误”的语义，我们在遇到异常的时候通常会发射 error 事件。当 error 被发射时，EventEmitter 规定`如果没有响应的监听器，Node.js 会把它当作异常，退出程序并打印调用栈`。我们一般要为会发射 error 事件的对象设置监听器，避免遇到错误后整个程序崩溃。
```javascript
var events = require('events')
var emitter = new events.EventEmitter()

emitter.emit('error')
```
运行时，就会报错，可能显示如下错误
```javascript
node.js:201
    throw e; // process.nextTick error, or 'error' event on first tick
                  ^
    Error: Uncaught, unspecified 'error' event.
        at EventEmitter.emit (events.js:50:15)
        at Object.<anonymous> (/home/pdk/error.js:5:9)
        at Module._compile (module.js:441:26)
        at Object..js (module.js:459:10)
        at Module.load (module.js:348:31)
        at Function._load (module.js:308:12)
        at Array.0 (module.js:479:10)
        at EventEmitter._tickCallback (node.js:192:40)
```
#### 继承EventEmitter
大多数时候我们不会直接使用 EventEmitter，而是在对象中继承它。包括 fs、net、 http 在内的，只要是支持事件响应的核心模块都是 EventEmitter 的子类。

为什么要这样做呢?原因有两点。首先，具有某个实体功能的对象实现事件符合语义， 事件的监听和发射应该是一个对象的方法。其次 JavaScript 的对象机制是基于原型的，支持部分多重继承，继承 EventEmitter 不会打乱对象原有的继承关系。

比如这样？
```javascript
var EventEmitter = process.EventEmitter

MyClass = function () {
  this.sayHello = function () {
    console.log('hello')
  }  
}

MyClass.prototype.__proto__ = EventEmitter.prototype

// 所有 MyClass 的实例都具备了事件功能

var mine = new MyClass

mine.on('eat', function () {
  console.log('eat')
})
```
