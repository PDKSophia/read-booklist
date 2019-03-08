---
title: JavaScript高级程序设计 - 打卡第六天
date: 2018-11-10 10:35:32
tags: card-6、Document类型、Element类型

---

# JavaScript高级程序设计 - 第三版

## Chapter Ten
### Document类型
JavaScript 通过 Document 类型表示文档。在浏览器中，document 对象是 HTMLDocument(继承自 Document 类型)的一个实例，表示整个 HTML 页面。而且，document 对象是 window 对象的一个 属性，因此可以将其作为全局对象来访问

Document的特征:

- nodeType 的值为 9

- nodeName 的值为"#document"

- nodeValue 的值为 null

- parentNode 的值为 null

- ownerDocument 的值为 null

- 其子节点可能是一个 DocumentType(最多一个)、Element(最多一个)、ProcessingInstruction
或 Comment。

访问文档的子节点，有两个内置的快捷方法: `documentElement` 和 ` childNodes `

```html
  <html>
    <body>
      ...
    </body>
  </html>
```
这个页面在经过浏览器解析后，其文档中只包含一个子节点，即<html>元素。可以通过 documentElement 或 childNodes 列表来访问这个元素
```javascript
  var html = document.documentElement //取得对<html>的引用
  console.log(html === document.childNodes[0]) // true
  console.log(html === document.firstChild) // true
```
这个例子说明，documentElement、firstChild 和 childNodes[0]的值相同，都指向<html> 元素。

作为 HTMLDocument 的实例，document 对象还有一个 body 属性，直接指向<body>元素。因为开 发人员经常要使用这个元素，所以 document.body 在 JavaScript 代码中出现的频率非常高
```javascript
  var body = document.body  //取得对<body>的引用
```
Document 另一个可能的子节点是 DocumentType。通常将<!DOCTYPE>标签看成一个与文档其他 部分不同的实体，可以通过 doctype 属性(在浏览器中是 document.doctype)来访问它的信息。
```javascript
  var doctype = document.doctype  //取得对<!DOCTYPE>的引用
```

作为 HTMLDocument 的一个实例，document 对象还有一些标准的Document对象所没有的属性。

- title: 包含着 `<title>`元素中的文本——显示在浏览器窗口的标题栏或标签页上。`document.title = 'new title'`

- URL: 包含页面完整的 URL(即地址栏中显示的 URL)。`var url = document.URL`

- domain: 包含页面的域名。`var domian = document.domain`

- referrer: 保存着链接到当前页面的那个页面的 URL。在没有来源页面的情况下，referrer 属性中可能 会包含空字符串。`var referrer = document.referrer`

在这4个属性中，只有`domain` 和 `title` 是可以设置的，但由于安全方面的限制，也并非可以给 domain 设 置任何值。如果 URL 中包含一个子域名，例如 p2p.wrox.com，那么就只能将 domain 设置为"wrox.com"。不能将这个属性设置为 URL 中不包含的域，

页面中包含来自其他子域的框架或内嵌框架时，能够设置document.domain就非常方便了。由于 <strong>[跨域安全限制](https://github.com/PDKSophia/blog.io/blob/master/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AF%87-%E6%9D%A5%E8%81%8A%E8%81%8A%E4%BA%94%E6%AF%9B%E9%92%B1%E7%9A%84%E8%B7%A8%E5%9F%9F%E9%97%AE%E9%A2%98.md)</strong>，来自不同子域的页面无法通过 JavaScript 通信。而通过将每个页面的 document.domain 设置为相同的值，这些页面就可以互相访问对方包含的 JavaScript 对象了

为了取得特定的某个或某组元素的引用, Document 类型为此提供了两个方法: `getElementById()`和 `getElementsByTagName()`

- getElementById() : 接收一个参数, 要取得的元素的id。如果找到相应的元素则返回该元素，如果不存在带有相应id的元素，则返回 null。

- getElementsByTagName() : 接受一个参数，即要取得元素的标签名，而返回的是包含零或多个元素的 NodeList。在HTML文档中，这个方法会返回一 个 `HTMLCollection` 对象

### Element 类型
Element结点具有以下特征: 
- nodeType 的值为 1

- nodeName 的值为元素的标签名

- nodeValue 的值为 null

- parentNode 可能是 Document 或 Element

- 其子节点可能是 Element、Text、Comment、ProcessingInstruction、CDATASection 或
EntityReference。

#### HTML元素
- id: 元素在文档中的唯一标识符。

- title: 有关元素的附加说明信息，一般通过工具提示条显示出来。

- className: 与元素的 class 特性对应，即为元素指定的 CSS 类。

- ...

```html
  <div id="myDiv" class="bd" title="Body text" lang="en" dir="ltr"></div>
```
元素中指定的所有信息，都可以通过下列 JavaScript 代码取得: 
```javascript
  var div = document.getElementById("myDiv")
  console.log(div.id)  // myDiv
  console.log(div.className) // bd
  console.log(div.title) // Body text
  console.log(div.lang) // en
  console.log(div.dir) // ltr
```

#### 取得特性
- getAttribute() : 获得特性名称, 传入的特性名需要与实际的特性名相同，如果给定名称的特性名不存在，返回null
```html
  <div id="myDiv" class="bd" title="Body text" lang="en" dir="ltr"></div>
```
```javascript
  var div = document.getElementById("myDiv")
  console.log(div.getAttribute("id")) // myDiv
  console.log(div.getAttribute("class")) // bd
```

#### 设置特性
- setAttribute() : 接受两个参数:要设置的特性名和 值。如果特性已经存在，setAttribute()会以指定的值替换现有的值;如果特性不存在，setAttribute() 则创建该属性并设置相应的值
```javascript
  // 比如:
  var div = document.createElement('div')
  div.setAttribute('id', 'myDiv')
  div.setAttribute('class', 'data-main') 
```
