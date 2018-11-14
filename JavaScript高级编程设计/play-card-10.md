---
title: JavaScript高级程序设计 - 打卡第十天
date: 2018-11-14 09:33:42n b
tags: card-10、富文本编辑、canvas基本用法

---

# JavaScript高级程序设计 - 第三版

## Chapter Fourteen
### 富文本编辑
使用 `contenteditable` 属性，把 contenteditable 属性应用给页面中的任何元素，然后用户立即就可以编辑该元素。

contenteditable 属性有三个可能的值: `true`表示打开、`false`表示关闭，`inherit`表示 从父元素那里继承， 下边是个简单例子
```html
<!DOCTYPE html>
<html>
  <head>
    <title>test</title>
    <style>
      .editable {
        width: 500px;
        height: 500px;
        border:1px solid red;
      }    
    </style>
  </head>
  <body>
    <div class="editable" id='richedit' contenteditable></div>
  </body>
  <script>
    var div = document.getElementById('richedit')
    div.contentEditable = false // 关闭编辑模式
  </script>
</html>
```

与富文本编辑器交互的主要方式，就是使用 `document.execCommand()`。这个方法可以对文档执 行预定义的命令，而且可以应用大多数格式。

document.execCommand()方法传递3个参数: 

- 要执行的命令名称

- 表示浏览器是否应该为当前命令提供用户界面的一个布尔值

- 执行命令必须的一个值(如果不需要值，则传递 null)。

> 为了确保跨浏览器的兼容性，第二个参数应该始终设置为 false， 因为 Firefox 会在该参数为 true 时抛出错误。

下边是支持最多的命令，想查看更多，就戳这里: [document.execCommand](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand)


| 命令 | 值(第三个参数) | 说明 | 
| :------: | :------: | :------: | 
| backcolor | 颜色字符串 | 设置文档的背景颜色 | 
| bold | null | 将选择的文本转换为粗体 | 
| copy | null | 将选择的文本复制到剪贴板 | 
| createlink | URL字符串 | 将选择的文本转换成一个链接，指向指定的URL | 
| fontsize | 1~7 | 将选择的文本修改为指定字体大小 | 
| insertimage | 图像的URL | 在插入字符处插入一个图像 | 
| italic | null | 将选择的文本转换成斜体 | 
| forecolor | 颜色字符串 | 将选择的文本修改为指定的颜色 |
| selectall | null | 选择文档中的所有文本 | 
| paste | null | 将剪贴板中的文本粘贴到选择的文本 |

```javascript
  // 转换粗体文本
  frames['richedit'].document.execCommand('bold', false, null)
  
  //转换斜体文本
  frames['richedit'].document.execCommand('italic', false, null)

  //创建指向 www.wrox.com 的链接 
  frames['richedit'].document.execCommand('createlink', false, 'http://www.wrox.com') 
 
  // 格式化为一级标题
  frames['richedit'].document.execCommand('formatblock', false, '<h1>')
```

一些与命令相关的方法， 比如 `queryCommandEnabled()`，可以用它来检测是否可以针对当前选择的文本，或者当前插入字符所在位置执行某个命令。这个方法接收一个参数，即*要检测的命令*
```javascript
  var result = frames['richedit'].document.queryCommandEnabled('blod')
```
如果能够对当前选择的文本执行 ' bold ' 命令，以上代码会返回 true。需要注意的是，queryCommandEnabled()方法返回 true，<strong>并不意味着实际上就可以执行相应命令，而只能说明对当前选择的文本执行相应命令是否合适</strong>

另一方法 `queryCommandState()` 方法用于确定是否已将指定命令应用到了选择的文本。例如，要确定当前选择的文本是否已经转换成了粗体
```javascript
  var isBold = frames['richedit'].document.queryCommandState('bold')
```
如果此前已经对选择的文本执行了 ' bold ' 命令，那么上面的代码会返回 true。一些功能全面的富 文本编辑器，正是利用这个方法来更新粗体、斜体等按钮的状态的

最后一个方法是 `queryCommandValue()` ，用于取得执行命令时传入的值。例如，在对一段文本应用 ' fontsize ' 命令时如果传入了 7，那么下面的代码就会返回 ' 7 ' 
```javascript
  var fontSize = frames['richedit'].document.queryCommandValue('fontsize')
```

--------- 

## Chapter Fifteen
### Canvas绘图
什么是canvas ？ HTML5 `<canvas>` 元素用于图形的绘制，通过脚本 (通常是JavaScript)来完成 , `<canvas>` 标签只是图形容器，必须使用脚本来绘制图形。`canvas` 元素本身是没有绘图能力的。所有的绘制工作必须在 JavaScript 内部完成

#### 基本用法
要使用`<canvas>`元素，必须先设置其 width 和 height 属性，指定可以绘图的区域大小。出现在开始和结束标签中的内容是后备信息

要在这块画布(canvas)上绘图，需要取得绘图上下文。而取得绘图上下文对象的引用，需要调用 getContext()方法并传入上下文的名字。传入 "2d" ，就可以取得 2D 上下文对象。

```javascript
  <canvas id="drawing" width=" 200" height="200"></canvas>

  var drawing = document.getElementById('drawing')
  if (drawing.getContext) {
    var context = drawing.getContext('2d')
  }
```
