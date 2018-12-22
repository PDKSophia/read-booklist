- [Node 入坑记录](#Node入坑记录)
  - [为什么要学习 Node](#为什么要学习Node)
  - [插播一条广告](#插播一条广告)
  - [了解 Node](#了解Node)
    - [Node 简介](#Node简介)
    - [Node 解决的问题](#Node解决的问题)
    - [异步式 I/O 与事件驱动](#异步式I/O与事件驱动)
  - [开始入坑](#开始入坑)
    - [Day-1](./Day1/README.md)
      - [阻塞与非阻塞IO](./Day1/README.md/#阻塞与非阻塞IO)
- [相关链接](#相关链接)

# Node入坑记录

## 为什么要学习Node

说出来不怕笑话，因为我都是 Mock 本地模拟的数据，然后`npm run build`之后，挂服务器上就 gg 了，我知道 gg 的原因，想自己用 ThinkPHP 写后端，但是想了想，伪全栈还是不行，先把前端这块再搞熟点，于是，入坑 `Node` 了，之前就知道 Node 是很牛逼的玩意，但是我也就只会用来写一个 `Hello World`，没得屌用，所以，还是入坑吧。因为自己想做一个 Vue + Node Express 前后端分离的完整项目。话不多说，记录一下。只适合跟我一样，入门 Node 的小白菜鸡。大佬就绕行，因为你锤我，我锤不过你，我会哭的啊 😫

## 插播一条广告
跟我一样是Node小白菜鸡的，先去看看这篇文章 : [Node入门](https://www.nodebeginner.org/index-zh-cn.html)，看完之后，再回来看我这个，同时有兴趣的小伙伴，去google或者百度搜索下《了不起的Node.js》、《Node.js开发指南》，所有的都是我从这两本书，包括一些博客文章，总结的～

## 了解Node

### Node简介

你要问我什么是 Node？我答不上来，我们可以在 [Node 官网](https://nodejs.org/en/about/) 看到，下面的这行简介:

```javascript
// As an asynchronous event driven JavaScript runtime, Node is designed to build scalable network applications
```

<strong> Node.js is a platform (server-side) which is built on google chrome's javascript v8 engine. It is open source , cross platform and is capable of generating real time web applications. It uses event-driven, non-blocking I/O operation model which makes it efficient and light-weight. It is written in C,C++ and javascript.</strong>

(QAQ.)看英文的介绍，比看中文翻译更加直观，别问了，英语不好，其中的一些单词还是 google 翻译的。是的，Node 是一个服务器上的 JavaScript，V8 Javascript 引擎是 Google 浏览器底层的 JavaScript 引擎. 创建了一个用 C/C++编写的超快解释器。

### Node解决的问题

我们知道，在 Web 应用程序架构中的瓶颈是 : **服务器能够处理的并发链接最大数量。**

Node 解决这个问题的方法是：更改连接到服务器的方式。每个连接发射一个在 Node 引擎的进程中运行的事件，而不是为每个连接生成一个新的 OS 线程（并为其分配一些配套内存）。我们可以在官网看到 :

> users of Node are free from worries of dead-locking the process, since there are no locks. Almost no function in Node directly performs I/O, so the process never blocks. Because nothing blocks, scalable systems are very reasonable to develop in Node

### 异步式I/O与事件驱动

Node.js 最大的特点 <strong>就是采用异步式 I/O 与事件驱动的架构设计</strong>。对于高并发的解决方案，传统的架构是`多线程模型`，也就是为每个业务逻辑提供一个系统线程，通过系统线程切换来弥补同步式 I/O 调用时的时间开销。

Node.js 使用的是`单线程模型`，对于所有 I/O 都采用<strong>异步式</strong>的请求方式，避免了频繁的上下文切换。Node.js 在执行的过程中会维护一个事件队列，程序在执行时进入事件循环等待下一个事件到来，每个异步式 I/O 请求完成后会被推送到事件队列，等待程序进程进行处理

采用 《Node.js开发指南》中的例子来说事 : 数据库查询操作
```javascript
  // 传统方法
  res = db.query('SELECT * from user')
  res.output()
```
以上代码在执行到第一行的时候，线程会阻塞，等待数据库返回查询结果，然后再继续处理。然而，由于数据库查询可能涉及磁盘读写和网络通信，其延时可能相当大(长达几个到几百毫秒，相比CPU的时钟差了好几个数量级)，线程会在这里阻塞等待结果返回。

对于高并发的访问，一方面线程长期阻塞等待，另一方面为了应付新请求而不断增加线程，因此会浪费大量系统资源，同时线程的增多也会占用大量的 CPU 时间来处理内存上下文切换， 而且还容易遭受低速连接攻击。

```javascript
  // Node.js 方法
  db.query('SELECT * from user', function (res) {
    res.output()
  })
```
这段代码中 db.query 的第二个参数是一个函数，我们称为`回调函数`。进程在执行到 db.query 的时候，不会等待结果返回，而是直接继续执行后面的语句，直到进入事件循环。 当数据库查询结果返回时，会将事件发送到事件队列，等到线程进入事件循环以后，才会调用之前的回调函数继续执行后面的逻辑。

> Node.js 进程在同一时刻只会处理一个事件，完成后立即进入事件循环检查并处理后面的事件。这样做的好处是， CPU 和内存在同一时间集中处理一件事，同时尽可能让耗时的 I/O 操作并行执行。对于低速 连接攻击，Node.js 只是在事件队列中增加请求，等待操作系统的回应，因而不会有任何多 线程开销，很大程度上可以提高 Web 应用的健壮性，防止恶意攻击。

## 开始入坑

结合下边相关链接的资源，结合《了不起的 Node.js》《Node.js 开发指南》书籍，开始入门 Node.js，默认你已经安装 Node、npm 包等知识

### Day-1

- [能力越大责任越大](./Day1/README.md/#能力越大责任越大)
- [阻塞与非阻塞IO](./Day1/README.md/#阻塞与非阻塞IO)
  - [什么是阻塞]('./Day1/README.md/#什么是阻塞)
  - [事件轮训]('./Day1/README.md/#事件轮训)

# 相关链接

搜了很多资料和资源，然后贴出我自认为有用的给你们吧～

- [《如何有效地学习 Node.js》](https://www.zhihu.com/question/19793473)

- [ Node 入门 ](https://www.nodebeginner.org/index-zh-cn.html#a-full-blown-web-application-with-nodejs)

- [ 30 Days of Node ](https://www.nodejsera.com/nodejs-tutorial-day1-thebeginning.html)

- [《Node.js 从入门到上线》](https://cnodejs.org/topic/5b1939ad29e6e510415b2916)

- [ 《Node.js 包教不包会》](https://github.com/alsotang/node-lessons)

- [ 《从零开始 Node.js 系列文章》](http://blog.fens.me/series-nodejs/)

- [ 《了不起的 Node.js》](./README.md)
