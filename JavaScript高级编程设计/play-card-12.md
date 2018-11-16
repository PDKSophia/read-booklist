---
title: JavaScript高级程序设计 - 打卡第十二天
date: 2018-11-15 14:04:42
tags: card-12、postMessage、HTML5 原生拖放、实现一个小拖动例子

---
# JavaScript高级程序设计 - 第三版

## Chapter Sixteen
### 跨文档消息传递
跨文档消息传送，有时候简称为 XDM，指的是在来自不同域的页面间传递消息，XDM 的核心是 `postMessage()` 方法，<strong>postMessage()方法接收两个参数: 一条消息和一个表示消息接收方来自哪个域的字符串。</strong>，第二个参数对保障安全通信非常重要，可以防止浏览器把消息发送到不安全的地方。

接收到 XDM 消息时，会触发 window 对象的 message 事件。这个事件是以异步形式触发的，因此从发送消息到接收消息(触发接收窗口的 message 事件)可能要经过一段时间的延迟。触发 message 事件后，传递给 onmessage 处理程序的事件对象包含以下三方面的重要信息

- data: 作为 postMessage()第一个参数传入的字符串数据

- origin: 发送消息的文档所在的域， 例如： `http://www.pengdaokuan.cn`

- source: 发送消息的文档的 window 对象的代理。 这个代理对象主要用于在发送上一条消息的窗口中调用 postMessage()方法。如果发送消息的窗口来自同一个域，那这个对象就是 window。

接收到消息后验证发送窗口的来源是至关重要的。就像给 postMessage()方法指定第二个参数， 以确保浏览器不会把消息发送给未知页面一样，基本的检测模式如下 :

```javascript
  EventUtil.addHandler(window, 'message', function () {
    // 确保发送消息的域是已知的域
    if (event.origin == 'http://www.pengdaokuan.cn') {
      // 处理接收到的数据
      processMessage(event.data)

      // 可选, 向来源窗口发送回执
      event.source.postMessage('Received', 'http://www.received.com')
    }
  })
```

【注意】: postMessage()的第一个参数最早是作为 <strong> “ 永远都是字符串 ” </strong>来实现的。但后来这个参数的定义改了，改成允许传入任何数据结构。可是，并非所有浏览器都实现了这一变化。为保险起见，使用 postMessage() 时，最好还是只传字符串。如果你想传入结构化的数据，*最佳选择是先在要传入的数据上调用 JSON.stringify()，通过 postMessage()传入得到的字符串，然后再在 onmessage 事件处理程序中调用 JSON.parse()*。

### 原生拖放
#### 拖放事件
通过拖放事件，可以控制拖放相关的各个方面。其中最关键的地方在于确定哪里发生了拖放事件，有些事件是在被拖放的元素上触发的，而有些事件是在放置目标上触发的。拖动某元素时，将依次触发下列事件:

- `dragstart`

- `drag`

- `dragend`

触发 dragstart 事件后，随即会触发 drag 事件，而且在元素被拖动期间会持续触发该事件。这个事件与 mousemove 事件相似，在鼠标移动过程中，mousemove 事件也会持续发生。当拖动停止时(无 论是把元素放到了有效的放置目标，还是放到了无效的放置目标上)，会触发 dragend 事件。

当某个元素被拖动到一个有效的放置目标上时，下列事件会依次发生:

- `dragenter`

- `dragover`

- `dragleave` 或 `drop`

#### 自定义放置位置
在拖动元素经过某些无效放置目标时，可以看到一种特殊的光标，表示不能放置。虽然所有元素都支持放置目标事件，但这些元素默认是不允许放置的。如果拖动元素经过不允许放置的元素，无论用户如何操作，都不会发生 drop 事件。不过，你<strong>可以</strong>把任何元素变成有效的放置目标，__方法是重写 `dragenter` 和 `dragover` 事件的默认行为__

```javascript
  var droptarget = document.getElementById('droptarget')
  EventUtil.addHandler (droptarget, 'dragover', function (event { 
    EventUtil.preventDefault(event)
  })

  EventUtil.addHandler (droptarget, 'dragenter', function (event) { 
    EventUtil.preventDefault(event)
  });
```

#### dataTransfer对象
为了在拖放操作时实现数据交换, 引入了 dataTransfer 对象，它是事件对象的一个属性，<strong>用于从被拖动元素向放置目标传递字符串格式的数据</strong>。 因为它是事件对象的属性，所以只能在拖放事件的事件处理程序中访问 dataTransfer 对象

dataTransfer对象有两个方法: getData() 和 setData() 

```javascript
  // 设置和接受文本数据
  event.dataTransfer.setData('text', 'some text')
  var text = event.dataTransfer.getData('text')

  // 设置和接受URL
  event.dataTransfer.setData('URL', 'http://www.pengdaokuan.cm')
  var url = event.dataTransfer.getData('URL')
```
保存在 dataTransfer 对象中的数据只能在 drop 事件处理程序中读取。如果在 `ondrop` 处理程序中没有读到数据，那就是 dataTransfer 对象已经被 销毁，数据也丢失了。

> 将数据保存为文本和保存为 URL 是有区别的。如果将数据保存为文本格式，那么数据不会得到任 何特殊处理。而如果将数据保存为 URL，浏览器会将其当成网页中的链接。换句话说，如果你把它放置 到另一个浏览器窗口中，浏览器就会打开该 URL。

如果想通过dataTransfer对象确定被拖动的元素以及作为放 置目标的元素能够接收什么操作。为此，需要访问 dataTransfer 对象的两个属性: `dropEffect` 和 `effectAllowed`。

通过 dropEffect 属性可以知道被拖动的元素能够执行哪种放置行为, 这个属性有四个可能值:

- `none` : 不能把拖动的元素放在这里。这是除文本框之外所有元素的默认值。

- `move` : 应该把拖动的元素移动到放置目标。

- `copy` : 应该把拖动的元素复制到放置目标。

- `link` : 表示放置目标会打开拖动的元素(但拖动的元素必须是一个链接，有 URL)。

dropEffect 属性只有搭配 effectAllowed 属性才有用。effectAllowed 属性表示允许拖动元素的哪种 dropEffect。 effectAllowed 属性可能的值如下

- `uninitialized` : 没有给被拖动的元素设置任何放置行为。 

- `none` : 被拖动的元素不能有任何行为。

- `copy` : 只允许值为`copy`的 dropEffect。

- `link` : 只允许值为`link`的 dropEffect。

- `move` : 只允许值为`move`的 dropEffect。

- `copyLink` : 允许值为`copy`和`link`的 dropEffect。 

- `copyMove` : 允许值为`copy`和`move`的 dropEffect。 

- `linkMove` : 允许值为`link`和`move`的 dropEffect。 

- `all` : 允许任意 dropEffect。

默认情况下，图像、链接和文本是可以拖动的，也就是说，不用额外编写代码，用户就可以拖动它们。文本只有在被选中的情况下才能拖动，而图像和链接在任何时候都可以拖动。

让其他元素可以拖动也是可能的。HTML5 为所有 HTML 元素规定了一个 `draggable` 属性，表示元素是否可以拖动。__图像和链接的 draggable 属性自动被设置成了 true，而其他元素这个属性 的默认值都是 false__。要想让其他元素可拖动，或者让图像或链接不能拖动，都可以设置这个属性。 

```html
  <!-- 让这个图像不可以拖动 -->
  <img src="smile.gif" draggable="false" alt="Smiley face">
  <!-- 让这个元素可以拖动 -->
  <div draggable="true">...</div>
```

### 简单实现一个小拖动
功能是: 将一个p标签内容从div1移到div2

```html
  <html>
    <head>
      <title>拖放</title>
      <style type="text/css">
        #div1, #div2 {
          float:left; 
          width:198px;
          height:66px; 
          margin:10px;
          padding:10px;
          border:1px solid #aaaaaa;
        }
      </style>
    </head>
    <body>
      <div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)">
        <p  draggable="true" ondragstart="drag(event)" id="pDom">彭道宽</p>
      </div>
      <div id="div2" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
    </body>
    <script>
      function addHandler(element, type, handler) {
        if (element.addEventListener) {
          element.addEventListener(type, handler, false)
        } else if (element.attachEvent) {
          element.attachEvent(`on${type}`, handler)
        } else {
          element[`on${type}`] = handler
        }
      }

      // 重置, 避免浏览器对数据的默认处理
      function rePreventDefault(evnet) {
        if (event.preventDefault) {
          event.preventDefault()
        } else {
          event.returnValue = false
        }
      }
    
      // 重置
      function getTarget(event) {
        return event.target || event.srcElement
      }
    
      var pDom = document.getElementById('pDom')

      addHandler (pDom, 'dragover', function(event) {
        rePreventDefault(event)
      })

      addHandler (pDom, 'dragenter', function(event) {
        rePreventDefault(event)
      })

      addHandler (pDom, 'drag', function(event) {
        rePreventDefault(event)
      })

      function allowDrop (event) {
        rePreventDefault(event)
      }

      function drop (event) {
        rePreventDefault(event)
        var data = event.dataTransfer.getData('text')
        var target = getTarget(event)
        target.appendChild(document.getElementById(data))
      }

      function drag (event) {
        event.dataTransfer.setData('text', event.target.id)
      } 
    </script>
  </html>
```