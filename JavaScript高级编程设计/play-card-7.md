---
title: JavaScript高级程序设计 - 打卡第七天
date: 2018-11-11 14:31:52
tags: card-7、Document类型、Element类型、滚动

---

# JavaScript高级程序设计 - 第三版

## Chapter Eleven
### 选择符API
- `querySelector()` : 返回与该模式匹配的第一个元素，如果没有找到匹配的元素，返回 null

- `querySelectorAll()` : 这个方法返回的是一个 NodeList 的实例, 如果没有找到匹配的元素，NodeList 就是空的

- `getElementsByClassName()` : 接收一个参数，即一个包含一或多个类名的字符串，返回带有 指定类的所有元素的 NodeList。传入多个类名时，类名的先后顺序不重要。

### 自定义类型属性
HTML5 规定可以为元素添加非标准的属性，但要添加前缀: *data-*，目的是为元素提供与渲染无关的信息，或者提供语义信息

添加了自定义属性之后，可以通过元素的 dataset 属性来访问自定义属性的值。dataset 属性的值是 DOMStringMap 的一个实例，也就是一个名值对儿的映射。在这个映射中，每个 data-name 形式 的属性都会有一个对应的属性，只不过属性名没有 data-前缀(比如，自定义属性是 data-myname， 那映射中对应的属性就是 myname)

```html
  <div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
```

```javascript
  var div = document.getElementById("myDiv")

  //取得自定义属性的值
  var appId = div.dataset.appId
  var myName = div.dataset.myname

  //设置值
  div.dataset.appId = 23456
  div.dataset.myname = "Michael"

  if (div.dataset.myname) {
    console.log(div.dataset.myname)
  }
```

### 内存与性能问题
*在删除带有事件处理程序或引用了其他 JavaScript 对象子树时，就有可能导致内存占用问题*。假设某个元素有一个事件处理程序(或者引用了一个 JavaScript 对象作为属性)，在使用前述某个属性将该元 素从文档树中删除后，元素与事件处理程序(或 JavaScript 对象)之间的绑定关系在内存中并没有一并删除。

如果这种情况频繁出现，页面占用的内存数量就会明显增加。因此，在使用 innerHTML、 outerHTML 属性和 insertAdjacentHTML()方法时，最好先手工删除要被替换的元素的所有事件处理 程序和 JavaScript 对象属性

### 滚动

- scrollIntoView() : 可以在所有 HTML 元素上调用，通过滚动浏览器窗口或某个容器元素，调用 元素就可以出现在视口中。如果给这个方法传入 true 作为参数，或者不传入任何参数，那么窗口滚动 之后会让调用元素的顶部与视口顶部尽可能平齐。如果传入 false 作为参数，调用元素会尽可能全部出现在视口中

- scrollIntoViewIfNeeded(alignCenter) : 只在当前元素在视口中不可见的情况下，才滚 动浏览器窗口或容器元素，最终让它可见。如果当前元素在视口中可见，这个方法什么也不做,  alignCenter设置为true，则表示尽量将元素显示在视口中部

- scrollByLines(lineCount) : 将元素的内容滚动指定的行高，lineCount 值可以是正值， 也可以是负值。Safari 和 Chrome 实现了这个方法。

- scrollByPages(pageCount) : 将元素的内容滚动指定的页面高度，具体高度由元素的高度决定。

<strong>scrollIntoView()和scrollIntoViewIfNeeded()的作用对象是元素的 容器，而 scrollByLines()和 scrollByPages()影响的则是元素自身</strong>

----------

##  Chapter Twelve
### 样式

在 HTML 中定义样式的方式有 3 种
- 通过`<link />`元素包含外部样式表文件

- 使用`<style />`元素 定义嵌入式样式

- 使用 `style` 特性定义针对特定元素的样式

### 访问元素的样式
任何支持 style 特性的 HTML 元素在 JavaScript 中都有一个对应的 style 属性。这个 style 对象 是 CSSStyleDeclaration 的实例，包含着通过 HTML 的 style 特性指定的所有样式信息，但不包含与外部样式表或嵌入样式表经层叠而来的样式。在 style 特性中指定的任何 CSS 属性都将表现为这个 style 对象的相应属性。对于使用短划线(分隔不同的词汇，例如 background-image)的 CSS 属性名，必须将其转换成驼峰大小写形式，才能通过 JavaScript 来访问

只要取得一个有效的 DOM 元素的引用，就可以随时使用 JavaScript 为其设置样式 
```javascript
  var myDiv = document.getElementById("myDiv")
  //设置背景颜色 
  myDiv.style.backgroundColor = "red"

  //改变大小
  myDiv.style.width = "100px"
  myDiv.style.height = "200px"

  //指定边框
  myDiv.style.border = "1px solid black"
```
>  在标准模式下，所有度量值都必须指定一个度量单位。在混杂模式下，可以将 style.width 设置为"20"，浏览器会假设它是"20px";但在标准模式下，将 style.width 设置为"20"会导致被忽略——因为没有度量单位

#### 元素大小

偏移量 : 包括元素在屏幕上占用的所有可见的空间。元素 的可见大小由其高度、宽度决定，包括所有内边距、滚动条和边框大小(注意，不包括外边距)。下列 4 个属性可以取得元素的偏移量

- `offsetHeight` : 元素在垂直方向上占用的空间大小，以像素计。包括元素的高度、(可见的) 水平滚动条的高度、上边框高度和下边框高度。

- `offsetWidth` : 元素在水平方向上占用的空间大小，以像素计。包括元素的宽度、(可见的)垂 直滚动条的宽度、左边框宽度和右边框宽度。

- `offsetLeft` : 元素的左外边框至包含元素的左内边框之间的像素距离。

- `offsetTop` : 元素的上外边框至包含元素的上内边框之间的像素距离。

其中，offsetLeft 和 offsetTop 属性与包含元素有关，包含元素的引用保存在 offsetParent 属性中。offsetParent 属性不一定与 parentNode 的值相等。

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/js-red-twelve-1.png'>

要想知道某个元素在页面上的偏移量，将这个元素的 offsetLeft 和 offsetTop 与其 offsetParent 的相同属性相加，如此循环直至根元素，就可以得到一个基本准确的值。以下两个函数就可以用于分别 取得元素的左和上偏移量

```javascript
  function getElementLeft (element) {
    var actualLeft = element.offsetLeft
    var current = element.offsetParent

    while (current !== null) {
      actualLeft += current.offsetLeft // 当前元素的offsetLeft 加上 父元素的offsetLeft
      current = current.offsetParent
    }

    return actualLeft
  }

  function getElementTop (element) {
    var actualTop = element.offsetTop
    var current = element.offsetParent

    while (current !== null) {
      actualTop += current.offsetTop // 当前元素的offsetTop 加上 父元素的offsetTop
      current = current.offsetParent
    }

    return actualTop
  }
```

### 客户区大小

元素的客户区大小(client dimension)，`指的是元素内容及其内边距所占据的空间大小`。有关客户区大小的属性有两个: *clientWidth* 和 *clientHeight*。其中，clientWidth 属性是元素内容区宽度加上左右内边距宽度; clientHeight 属性是元素内容区高度加上上下内边距高度

<img src='https://github.com/PDKSophia/read-booklist/raw/master/book-image/js-red-twelve-2.png'>

从字面上看，客户区大小就是元素内部的空间大小，因此滚动条占用的空间不计算在内。最常用到 这些属性的情况。

要确定浏览器 视口大小，可以使用 document.documentElement 或 document.body(在 IE7 之前的版本中)的 clientWidth 和 clientHeight。

```javascript
  function getViewPort() {
    if (document.compatMode == 'BackCompat') {
      return (
        width: document.body.clientWidth,
        height: document.body.clientHeight
      )
    } else {
      return (
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      )
    }
  }
```

### 滚动大小
指的是包含滚动内容的元素的大小。有些元素(例如 `<html>`元素)，即使没有执行任何代码也能自动地添加滚动条;但另外一些元素，则需要通过 CSS 的overflow 属性进行设置才能滚动

- scrollHeight: 在没有滚动条的情况下，元素内容的总高度

- scrollWidth: 在没有滚动条的情况下，元素内容的总宽度

- scrollLeft: 被隐藏在内容区域左侧的像素数。通过设置这个属性可以改变元素的滚动位置

- scrollRight: 被隐藏在内容区域上方的像素数。通过设置这个属性可以改变元素的滚动位置

