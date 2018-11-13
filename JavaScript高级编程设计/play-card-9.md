---
title: JavaScript高级程序设计 - 打卡第八天
date: 2018-11-11 14:31:52
tags: card-8、 事件机制

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