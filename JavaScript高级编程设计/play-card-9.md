---
title: JavaScript高级程序设计 - 打卡第九天
date: 2018-11-11 14:31:52
tags: card-9、事件类型、内存与性能、事件委托

---

# JavaScript高级程序设计 - 第三版

## Chapter Thirteen

### 事件类型

#### load事件
当页面完全加载后(包括所有图像、JavaScript 文件、 CSS 文件等外部资源)，就会触发 window 上面的 load 事件。

方式一
```javascript
  EventUtil.addHandler(window, 'load', function(event) {
    console.log('load')
  })
```
方式二
```html
  <!DOCTYPE html>
  <html>
    <head>
      <title>example</title>
    </head>
    <body onload='console.log("onload")'>
    
    </body>
  </html>
```
常见比如你要添加一个图片，当图片加载完毕之后，会显示一个警告框。最重要的是要在指定 src 属性之前先指定事件，新图像元素不一定要从添加到文档后才开始 下载，只要设置了 src 属性就会开始下载。
```javascript
  EventUtil.addHandler(window, "load", function () {
    var image = document.createElement("img")
    EventUtil.addHandler(image, "load", function(event){
      event = EventUtil.getEvent(event)
      alert(EventUtil.getTarget(event).src)
    })
    document.body.appendChild(image)
    image.src = "smile.gif"
  })
```

#### unload事件
与 load 事件对应的是 unload 事件，这个事件在文档被完全卸载后触发。只要用户从一个页面切换到另一个页面，就会发生 unload 事件。而利用这个事件最多的情况是清除引用，以避免内存泄漏。

```javascript
  EventUtil.addHandler(window, "unload", function(event) {
    alert("Unloaded");
  })
```
既然unload事件是在一切 都被卸载之后才触发，那么在页面加载后存在的那些对象，此时就不一定存在了。此时，操作 DOM 节点或者元素的样式就会导致错误。


#### resize 事件
当浏览器窗口被调整到一个新的高度或宽度时，就会触发 resize 事件。这个事件在 window(窗 口)上面触发，因此可以通过 JavaScript 或者`<body>`元素中的 onresize 特性来指定事件处理程序

```javascript
  EventUtil.addHandler(window, 'resize', function (event) {
    console.log('resize')
  })
```
关于何时会触发 resize 事件，不同浏览器有不同的机制。IE、Safari、Chrome 和 Opera 会在浏览 器窗口变化了 1 像素时就触发 resize 事件，然后随着变化不断重复触发。Firefox 则只会在用户停止调 整窗口大小时才会触发 resize 事件。由于存在这个差别，应该注意不要在这个事件的处理程序中加入 大计算量的代码，因为这些代码有可能被频繁执行，从而导致浏览器反应明显变慢。

#### scroll 事件
虽然 scroll 事件是在 window 对象上发生的，但它实际表示的则是页面中相应元素的变化, scroll 事件也会在文档被滚动期间重复被触发，所以有必要尽量保持事件处理程序的代码简单。关于scroll事件，你可能想了解 : [防抖和节流](https://github.com/PDKSophia/blog.io/blob/master/JavaScript%E7%AF%87-%E9%98%B2%E6%8A%96%E5%92%8C%E8%8A%82%E6%B5%81.md)


#### 其他事件
- blur: 在元素失去焦点时触发。这个事件不会冒泡;所有浏览器都支持它。

- focus: 在元素获得焦点时触发。这个事件不会冒泡;所有浏览器都支持它。

- click: 在用户单击主鼠标按钮(一般是左边的按钮)或者按下回车键时触发。

- dbclick: 在用户双击主鼠标按钮(一般是左边的按钮)时触发。

- mousedown: 在用户按下了任意鼠标按钮时触发。

- mouseleave: 在位于元素上方的鼠标光标移动到元素范围之外时触发。

- mouseenter: 在鼠标光标从元素外部首次移动到元素范围之内时触发。

- mousemove: 当鼠标指针在元素内部移动时重复地触发。

- mouseout: 在鼠标指针位于一个元素上方，然后用户将其移入另一个元素时触发。

- mouseover: 在鼠标指针位于一个元素外部，然后用户将其首次移入另一个元素边界之内时触发

### 内存与性能之事件委托
每个函数都是对象，都会占用内存; 内存中的对象越多，性能就越差。其次，必须事先指定`所有事件处理程序`而导致的 DOM 访问次数，会延迟整个页面的交互就绪时间。所以，对 “ 事件处理程序过多 ” 问题的解决方案就是事件委托。事件委托利用了事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件

举个例子 : 我有100个 li 节点，每个li都有相同的click事件，那么我们会怎么做呢 ？
```javascript
  <ul id="demo_ul">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
  </ul>

  window.onload = function(){
    let uls = document.getElementById('demo_ul')
    let lis = uls.getElementsByTagName('li')
    for(let i =0; i < lis.length; i++) {
      lis[i].onclick = function () {
        console.log('我是第' + i + '个li节点')
      }
    }
  }
```
是不是很熟悉？但是如果每个可点击的元素都采用这种方式，那么就会有数不清的代码用于添加事件处理程序，此时，用事件委托，贼舒服

这里用父级ul做事件处理，当li被点击时，由于冒泡原理，事件就会冒泡到ul上，因为ul上有点击事件，所以事件就会触发，当然，这里当点击ul的时候，也是会触发的

Event对象提供了一个属性叫target，可以返回事件的目标节点，我们成为事件源，也就是说，target就可以表示为当前的事件操作的dom，但是不是真正操作dom，当然，这个是有兼容性的，标准浏览器用event.target，IE浏览器用event.srcElement，此时只是获取了当前节点的位置

```javascript
  var uls = document.getElementById('demo_ul')
  window.onload = function () {
    EventUtil.addHandler(uls, 'click', function (event) {
      event = EventUtil.getEvent(event)
      var target = event.getTarget(event)

      if (target.nodeName.toLowerCase() == 'li') {
        alert(target.innerHTML)
      }
    })
  }
```
上面的例子是说li操作的是同样的效果，要是每个li被点击的效果都不一样，那么用事件委托还有用吗？
```html
  <ul id="box">
    <li id="add"></li>
    <li id="remove"></li>
    <li id="move"></li>
    <li id="select"></li>
  </ul>
```
```javascript
  // 正常流程
  window.onload = function () {
    var Add = document.getElementById("add")
    var Remove = document.getElementById("remove")
    var Move = document.getElementById("move")
    var Select = document.getElementById("select")
            
    Add.onclick = function(){
      alert('添加')
    }
    Remove.onclick = function(){
      alert('删除')
    }
    Move.onclick = function(){
      alert('移动')
    }
    Select.onclick = function() {
      alert('选择')
    }
  }

  // 事件代理
  window.onload = function(){
    var oBox = document.getElementById("box")
    oBox.onclick = function (ev) {
      var ev = ev || window.event
      var target = ev.target || ev.srcElement
      if(target.nodeName.toLocaleLowerCase() == 'input'){
        switch (target.id) {
          case 'add' :
            alert('添加')
            break
          case 'remove' :
            alert('删除')
            break
          case 'move' :
            alert('移动')
            break
          case 'select' :
            alert('选择')
            break
        }
      }
    }
  }
```
最适合采用事件委托技术的事件包括 click、mousedown、mouseup、keydown、keyup 和 keypress。 虽然 mouseover 和 mouseout 事件也冒泡，但要适当处理它们并不容易，而且经常需要计算元素的位置。

### 内存和性能之移除事件处理程序
每当将事件处理程序指定给元素时，运行中的浏览器代码与支持页面交互的 JavaScript 代码之间就 会建立一个连接。这种连接越多，页面执行起来就越慢。所以我们前面采用了时间委托技术，限制建立的连接数量。另外，在不需要的时候移除事件处理程序，也是解决这个问题的一种方案。内存中留有那些过时不用的“空事件处理程序”也是造成 Web 应用程序内存与性能问题的主要原因。

手工移除事件处理程序
```javascript
  <div id="myDiv">
    <input type="button" value="Click Me" id="myBtn">
  </div>
  
  var btn = document.getElementById("myBtn")
  btn.onclick = function () {
    // 执行某些操作

    btn.onclick = null // 移除事件处理程序
    document.getElementById('myDiv').innerHTML = 'processing...'
  }
```
<storng>在事件处理程序中删除按钮也能阻止事件冒泡。目标元素在文档中是事件冒泡的前提</strong>

一般来说，最好的做法是在页面卸载之前，先通过 onunload 事件处理程序移除所有事件处理程序，在此，事件委托技术再次表现出它的优势——需要跟踪的事件处理程序越少，移除它们就越容易。对这种类似撤销的操作，我们可以把它想象成: *只要是通过 onload 事件处理程序添加的东西，最后都要通过 onunload 事件处理程序将它们移除*。


-----------

## Chapter Fourteen
### 表单脚本
在 HTML 中，表单是由`<form>`元素来表示的，而在 JavaScript 中，表单对应的则是HTMLFormElement 类型。HTMLFormElement 继承了 HTMLElement，因而与其他 HTML 元素具有相同的默认属 性。不过，HTMLFormElement 也有它自己下列独有的属性和方法

- action: 接受请求的 URL; 等价于HTML中的 action 特性。

- enctype: 请求的编码类型; 等价于HTML中的 enctype 特性。

- length: 表单中控件的数量。

- target: 用于发送请求和接收响应的窗口名称;等价于 HTML 的 target 特性。

- method: 要发送的 HTTP 请求类型，通常是"get"或"post"; 等价于 HTML 的 method 特性。

- name: 表单的名称; 等价HTML的name特性

- reset(): 表达域设置成默认值

- submit(): 提交表单

### 表单字段
可以像访问页面中的其他元素一样，使用原生 DOM 方法访问表单元素，每个表单都有elements 属性，该属性是表单中所有表单元素(字段)的集合。这个 elements 集合是一个有序列表，其中包含着表单中的所有字段
```javascript
  var form = document.getElementById("form1")

  //取得表单中的第一个字段
  var field1 = form.elements[0]

  //取得名为"textbox1"的字段
  var field2 = form.elements["textbox1"]

  //取得表单中包含的字段的数量
  var fieldCount = form.elements.length
```
#### 共有的表单字段属性
- disabled: 布尔值，表示当前字段是否被禁用。

- form: 指向当前字段所属表单的指针;只读。

- name: 当前字段的名称。

- readOnly: 布尔值，表示当前字段是否只读。

- tabIndex: 表示当前字段的切换(tab)序号。

- type: 当前字段的类型，如"checkbox"、"radio"，等等。

- value: 当前字段将被提交给服务器的值。对文件字段来说，这个属性是只读的，包含着文件
在计算机中的路径。

#### 共有的表单字段方法
- blur() : 作用是从元素中移走焦点。在调用 blur()方法时， 并不会把焦点转移到某个特定的元素上; 仅仅是将焦点从调用这个方法的元素上面移走而已

- focus() : 用于将浏览器的焦点设置 到表单字段，即激活表单字段，使其可以响应键盘事件

使用 `focus()` 需要注意的是: 如果第一个表单字段是一个`<input>`元素，且其 type 特性的值为"hidden"，那么 以上代码会导致错误。另外，如果使用 CSS 的 display 和 visibility 属性隐藏了该字段，同样也会 导致错误。

#### 共有的表单字段事件
- blur : 当前字段失去焦点时触发

- focus : 当前字段获得焦点时触发

- change : 对于`<input>`和`<textarea>`元素，在它们失去焦点且 value 值改变时触发;对于`<select>元素`，在其选项改变时触发。

当用户改变了当前字段的焦点，或者我们调用了 blur()或 focus()方法时，都可以触发 blur 和 focus 事件。这两个事件在所有表单字段中都是相同的。但是，change 事件在不同表单控件中触发的 次数会有所不同。

对于`<input>`和`<textarea>`元素，当它们从获得焦点到失去焦点且 value 值改变时，才会触发 change 事件。对于`<select>`元素，只要用户选择了不同的选项，就会触发 change 事件; 换句话说，不失去焦点也会触发 change 事件

### 表单过滤输入
