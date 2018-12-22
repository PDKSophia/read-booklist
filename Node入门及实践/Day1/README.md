- [Day1](#Day1)
  - [能力越大责任越大](#能力越大责任越大)
  - [阻塞与非阻塞 IO](#阻塞与非阻塞io)
    - [什么是阻塞](#什么是阻塞)
    - [事件轮训](#事件轮训)
- [相关链接](#相关链接)

# Day1

## 能力越大责任越大

我们先来看段代码

```javascript
// Node.js

var books = ['Node.js', 'PHP']
function serveBooks() {
  // 给客户端返回 HTML 代码
  var html = '<b>' + books.join('</b><br></b>') + '</b>'

  // 把状态修改了
  books = []

  return html
}
```

```php
// PHP

$books = array('Node.js', 'PHP');

function serveBooks() {
  $html = '<b>' . join($boos, '</b><br></b>') . '</b>';

  $books = array();

  return $html;
}
```

这两段代码中，都通过 `serveBooks()` 函数，将 books 数组重置了； 现在假设一个用户分别向 Node 服务器 和 PHP 服务器各同时发起两次对 /books 的请求。结果会是如何 ?

- Node 会将完整的数据 books 列表返回给第一次请求，而第二次请求则会返回一个空的数组列表

- PHP 都能将完整的数据 books 列表返回给两个请求

区别就是在于基础架构上，Node 是一个长期运行的进程，而相反，Apache 会产出多个线程(每个请求一个线程)，每次都会刷新状态。在 PHP 中，当解析器再次执行时，变量\$books 会被重新赋值，而 Node 则不然，它的作用域中的变量不受影响(此时仍为空)

```
                +-----------------+
                |      APACHE     |
                +-+------+------+-+
                  |      |      |
               +--+      |      +--+
      +--------+     +--------+    +--------+
      |   PHP  |     |  PHP   |    |  PHP   |
      | THREAD |     | THREAD |    | THREAD |
      +--------+     +--------+    +--------+
          |              |              |
     +---------+    +---------+    +---------+
     | REQUEST |    | REQUEST |    | REQUEST |
     +---------+    +---------+    +---------+



        +-----------------------------------+
        |                                   |
        |              NODE.JS              |
        |                                   |
        |              PROCESS              |
        |                                   |
        +-----------------------------------+
          |               |              |
     +---------+     +---------+     +---------+
     | REQUEST |     | REQUEST |     | REQUEST |
     +---------+     +---------+     +---------+

```

## 阻塞与非阻塞IO

### 什么是阻塞

线程在执行中如果遇到磁盘读写或网络通信(统称为 I/O 操作)， 通常要耗费较长的时间，这时操作系统会剥夺这个线程的 CPU 控制权，使其暂停执行，同时将资源让给其他的工作线程，这种线程调度方式称为阻塞。当 I/O 操作完毕时，操作系统将这个线程的阻塞状态解除，恢复其对 CPU 的控制权，令其继续执行。这种 I/O 模式就是通常的同步式 I/O(Synchronous I/O)或阻塞式 I/O (Blocking I/O)。

异步式 I/O (Asynchronous I/O) 或 非阻塞式 I/O (Non-blocking I/O)则针对所有 I/O 操作不采用阻塞的策略。当线程遇到 I/O 操作时，不会以阻塞的方式等待 I/O 操作的完成或数据的返回，而只是将 I/O 请求发送给操作系统，继续执行下一条语句。当操作系统完成 I/O 操作时，以事件的形式通知执行 I/O 操作的线程，线程会在特定时候处理这个事件。为了处理异步 I/O，线程必须有事件循环，不断地检查有没有未处理的事件，依次予以处理。

```php
// PHP

print('hello');

sleep(5);

print('world');
```

```javascript
// Node.js
console.log('hello')

setTimeout(() => {
  console.log('world')
}, 5000)
```

两者区别在于 `阻塞与非阻塞` 的区别上。在第一段代码，PHP sleep() 阻塞了线程的执行，程序进入了睡眠，未达到设定时间前，不会有任何操作。而 Node.js 使用了`事件轮训`，因此这里的 setTimeout 是非阻塞的。setTimeout 仅仅只是注册了一个事件，而程序继续执行，所以这是`“异步”`的。([为什么要双引号括起来呢？](https://github.com/PDKSophia/blog.io/blob/master/%E5%89%8D%E7%AB%AF%E9%9D%A2%E8%AF%95-%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AF%87.md#event-loop))

### 事件轮训

我们先明确一点 : Node 是单线程的, 在没有第三方模块的帮助下是无法改变这一事实的

既然是单线程的，那么执行时只有一个线程，也就是说，当一个函数执行的时候，同一时间下不可能有第二个函数也在执行，那 Node.js 是如何做到高并发的呢？我们来明白一个 `堆栈` 的概念

当 v8 首次调用一个函数的时候，会创建一个`调用堆栈`，或者称为`执行堆栈`，如果该函数又去调用一个函数的话，v8 就会把它加到调用堆栈上，或者在同步代码中，执行了 setTimeout()，在里边执行另一函数，那么 v8 会在 setTimeout 注册一个事件，并添加到调用堆栈上

```javascript
// 例子1
function taskOne() {
  taskTwo()
}

function taskTwo() {}

// 例子2
var EventEmitter = require('events').EventEmitter
var event = new EventEmitter()

event.on('task_event', function() {
  console.log('I am task_event')
})

setTimeout(() => {
  event.emit('task_event')
}, 1000)
```

第二个代码中，1 秒后控制台输出了 `I am task_event`。其原理是 event 对象注册了事件 task_event 的一个监听器，然后我们通过 setTimeout 在 1 秒以后向 event 对象发送事件 task_event ，此时会调用 task_event 的监听器。

由于 Node 是运行在单线程环境中，所以，当调用堆栈展开时，Node 就无法处理客户端或者 http 请求了。你可能会想，那这样子看来，Node 的最大并发量不就是 1 了？ 没错！Node 并不提供真正的并行操作。因为那样需要引入更多的并行执行线程

<strong>关键在于，在调用堆栈执行非常快的情况下，同一时刻，你无需处理多个请求。这也就是为什么 V8 搭配非阻塞 IO 是最佳组合。v8 执行 JS 速度非常快，非阻塞 IO 确保了单线程执行时，不会因为有数据库访问或者硬盘访问等操作而导致被挂起</strong>
