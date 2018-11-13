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

#### 屏蔽字符
有时候，我们需要用户输入的文本中包含或不包含某些字符。例如，电话号码中不能包含非数值字符。响应向文本框中插入字符操作的是 keypress 事件。因此，可以通过阻止这个事件的默认行为来屏蔽此类字符
```javascript
  EventUtil.addHandler(textbox, "keypress", function(event){
    event = EventUtil.getEvent(event)
    EventUtil.preventDefault(event)
  })
```
运行以上代码后，由于所有按键操作都将被屏蔽，结果会导致文本框变成只读的。如果只想屏蔽特定的字符，则需要检测 keypress 事件对应的字符编码，然后再决定如何响应。例如，下列代码只允许用户输入数值。
```javascript
  EventUtil.addHandler(textbox, 'keypress', function (event) {
    event = EventUtil.getEvent(event)
    var target = EventUtil.getTarget(event)
    var charCode = EventUtil.getCharCode(event)

    if (!/\d/.test(String.formCharCode(charCode))) {  // 正则匹配只能输入数字
      EventUtil.preventDefault(event)
    }
  })
```
使用 EventUtil.getCharCode()实现了跨浏览器取得字符编码。然后，使用 `String.fromCharCode()` 将字符编码转换成字符串，再使用正则表达式 /\d/ 来测试该字符串，从 而确定用户输入的是不是数值。如果测试失败，那么就使用 EventUtil.preventDefault() 屏蔽按键事件

但是，仅考虑到屏蔽不是数值的字符还 不够，还要避免屏蔽这些极为常用和必要的键，比如向上键、向下键、退格键和删除键等。在 Firefox 中，所有由非字符键触发的 keypress 事件对应的字符编码为 0，而在 Safari 3 以前的版本中，对应的字符编码全部为 8。为了让代码更通用，只要不屏蔽那些字符编码小于 10 的键即可

```javascript
  EventUtil.addHandler(textbox, 'keypress', function (event) {
    event = EventUtil.getEvent(event)
    var target = EventUtil.getTarget(event)
    var charCode = EventUtil.getCharCode(event)

    if (!/\d/.test(String.formCharCode(charCode)) && charCode > 9) { 
      EventUtil.preventDefault(event)
    }
  })
```
这样，就可以屏蔽所有非数值字符，但不屏蔽那些也会乘除法keypress事件的基本按键

除此之外，还有一个问题需要处理:复制、粘贴及其他操作还要用到 Ctrl 键。在除 IE 之外的所有浏览器中，前面的代码也会屏蔽 `Ctrl+C`、`Ctrl+V`，以及其他使用 `Ctrl` 的组合键。因此，最后还要添加一个检测条件，以确保用户没有按下 Ctrl 键

```javascript
  EventUtil.addHandler(textbox, 'keypress', function (event) {
    event = EventUtil.getEvent(event)
    var target = EventUtil.getTarget(event)
    var charCode = EventUtil.getCharCode(event)

    if (!/\d/.test(String.formCharCode(charCode)) && charCode > 9 && !event.ctrlKey) { 
      EventUtil.preventDefault(event)
    }
  })
```

#### 操作剪贴板
- beforecopy: 在发生复制操作前触发。

- copy: 在发生复制操作时触发。

- beforecut: 在发生剪切操作前触发。 

- cut: 在发生剪切操作时触发。

- beforepaste: 在发生粘贴操作前触发。 

- paste: 在发生粘贴操作时触发。

要访问剪贴板中的数据，可以使用 <strong>clipboardData</strong> 对象: 在 IE 中，这个对象是 window 对象的属性; 而在 Firefox 4+、Safari 和 Chrome 中，这个对象是相应 event 对象的属性。但是，在 Firefox、 6 Safari 和 Chorme 中，*只有在处理剪贴板事件期间 clipboardData 对象才有效，这是为了防止对剪贴板的未授权访问*; 在 IE 中，则*可以随时访问 clipboardData 对象*。

lipboardData 对象有三个方法: 
- getData(): 用于从剪贴板中取得数据，它接受一个参数，即要取得的数据的格式。在 IE 中，有两种数据格式: `text` 和`URL`。

- setData(): 第一个参数也是数据类型，第二个参数是要放在剪贴板中的文本。对于 第一个参数，IE 照样支持`text`和`URL`

- clearData(): 清除剪贴板中的数据

在需要确保粘贴到文本框中的文本中包含某些字符，或者符合某种格式要求时，能够访问剪贴板是非常有用的。例如，如果一个文本框只接受数值，那么就必须检测粘贴过来的值，以确保有效。在 paste 事件中，可以确定剪贴板中的值是否有效，如果无效，取消默认的行为。

```javascript
  EventUtil.addHandler(textbox, "paste", function (event) {
    event = EventUtil.getEvent(event)
    var text = EventUtil.getClipboardText(event)
    if (!/^\d*$/.test(text)){
        EventUtil.preventDefault(event)
    }
  })
```

#### 自动切换焦点
最常见的一种方式就是在用户填写 完当前字段时，自动将焦点切换到下一个字段。通常，在自动切换焦点之前，必须知道用户已经输入了 既定长度的数据(例如电话号码)。例如下边例子:
```html
  <input type="text" name="tel1" id="txtTel1" maxlength="3">
  <input type="text" name="tel2" id="txtTel2" maxlength="3">
  <input type="text" name="tel3" id="txtTel3" maxlength="4">
```
为增强易用性，同时加快数据输入，可以在前一个文本框中的字符达到最大数量后，自动将焦点切换到下一个文本框。换句话说，用户在第一个文本框中输入了 3 个数字之后，焦点就会切换到第二个文本框，再输入 3 个数字，焦点又会切换到第三个文本框
```javascript
  // 定义一个匿名函数，然后立即执行
  (function () {
    function tabForward (event) {
      event = EventUtil.getEvent(event)
      var target = EventUtil.getTarget(event)

      if (target.value.length == target.maxLength) {
        var form = target.form
        for (let i = 0; i < form.elements.length; i++) {
          if (form.elements[i] == target) {
            if (form.elements[i+1]) {
              form.elements[i+1].focus()
            }
            return
          }
        }
      }
    }

    var textbox1 = document.getElementById("txtTel1")
    var textbox2 = document.getElementById("txtTel2")
    var textbox3 = document.getElementById("txtTel3")
    EventUtil.addHandler(textbox1, "keyup", tabForward)
    EventUtil.addHandler(textbox2, "keyup", tabForward)
    EventUtil.addHandler(textbox3, "keyup", tabForward)

  })()
```

#### HTML约束验证API
##### 必填字段
`required` 属性。任何标注有 required 的字段，在提交表单时都不能空着。
```html
  <input type='text' name='username' required />
```

##### 数值范围
`min属性；max属性；step属性；`例如，想让用户只能输入 0 到 100 的值，而且这个值必须是 5 的倍数
```html
  <input type='number' min='0' max='100' step='5' name='count' />
```
##### 输入模式
HTML5为文本字段新增了`pattern`属性。这个属性的值是一个正则表达式，用于匹配文本框中的值。例如，如果只想允许在文本字段中输入数值
```html
  <input type='text' pattern='\d+' name='count'>
```
##### 检测有效性
使用 checkValidity()方法可以检测表单中的某个字段是否有效。所有表单字段都有个方法，如果字段的值有效，这个方法返回 true，否则返回 false
```javascript
  if (document.forms[0].elements[0].checkValidity()) {
    // 第一个表单forms[0]的第一个字段elements[0]有效
  } else {
    // 字段无效
  }
```
与 checkValidity()方法简单地告诉你字段是否有效相比，`validity` 属性则会告诉你为什么字段有效或无效。这个对象中包含一系列
- customError :如果设置了 setCustomValidity()，则为 true，否则返回 false。

- patternMismatch:如果值与指定的 pattern 属性不匹配，返回 true。

- rangeOverflow: 如果值比 max 值大，返回 true。

- rangeUnderflow: 如果值比 min 值小，返回 true。

- stepMisMatch: 如果 min 和 max 之间的步长值不合理，返回 true。

- tooLong: 如果值的长度超过了 maxlength 属性指定的长度，返回 true。有的浏览器会自动约束字符数量，因此这个值可能永远都返回 false。

- typeMismatch: 如果值不是"mail"或"url"要求的格式，返回 true。

- valid: 如果这里的其他属性都是 false，返回 true。checkValidity()也要求相同的值。

- valueMissing: 如果标注为 required 的字段中没有值，返回 true。

```javascript
  if (input.validity && !input.validity.valid){
    if (input.validity.valueMissing){
      console.log('Please specify a value.')
    } else if (input.validity.typeMismatch){
      console.log('Please enter an email address.');
    } else {
      console.log('Value is invalid.');
    }
  }
```