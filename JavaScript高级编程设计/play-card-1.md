# JavaScript高级程序设计 - 第三版

## Chapter Two

#### `script` 元素属性
- `async`: 可选，表示应该 <em>立即下载脚本</em>，不妨碍页面中的其他操作，只对外部脚本文件有效
- `defer`: 可选，表示脚本可以 <em>延迟</em> 到文档完全被解析和显示之后再执行，只对外部脚本文件有效
- `language`: 已废弃
- `src`: 可选，表示包含要执行代码的外部文件
- `type`: 可选，不指定这个属性，则默认 text/javascript
- `charset`: 可选，表示通过src属性指定的代码的字符集

#### 标签位置
在传统做法中，所有的script元素都放在页面的<head>元素中，例如: 
```html
  <!DOCTYPE html>
  <html>
    <head>
      <title>JavaScript高级程序设计</title>
      <script type='text/javascript' src='main.js'></script>
      <script type='text/javascript' src='base.js'></script>
    </head>
    <body>
      ...
    </body>
  </html>
```
这种做法目的是把所有外部文件的引用都放在相同的地方，但是！！！在文档的<head>中包含所有的JavaScript文件，意味着 <strong>必须要等到全部JavaScript代码都被下载、解析和执行完之后，才能开始呈现页面的内容</strong>，这样会出现什么问题？会导致浏览器在呈现页面时出现明显的延迟，而延迟期间，浏览器窗口一片空白！！！

现代web应用程序一般都会把所有的JavaScript引用放在`<body>`元素中，如下例:

```html
  <!DOCTYPE html>
  <html>
    <head>
      <title>JavaScript高级程序设计</title>
    </head>
    <body>
      ...

      <script type='text/javascript' src='main.js'></script>
      <script type='text/javascript' src='base.js'></script>
    </body>
  </html>
```

#### 延迟 defer 和 异步 async
`defer`， 表明脚本在执行时不会影响页面的构造，脚本被延迟到整个页面都解析完后才执行，并且会按照`script`的属性执行，也就是main.js 会有限 base.js 执行。

```html
  <!DOCTYPE html>
  <html>
    <head>
      <title>JavaScript高级程序设计</title>
      <script type='text/javascript' src='main.js' defer></script>
      <script type='text/javascript' src='base.js' defer></script>
    </head>
    <body>
      ...
    </body>
  </html>
```

`async`，表示立即下载脚本，但是它并不保证按照指定的先后顺序执行
```html
  <!DOCTYPE html>
  <html>
    <head>
      <title>JavaScript高级程序设计</title>
      <script type='text/javascript' src='main.js' async></script>
      <script type='text/javascript' src='base.js' async></script>
    </head>
    <body>
      ...
    </body>
  </html>
```
以上的代码，base.js 可能会在main.js 之前执行，因此，确保两者之间`互不影响`非常重要。指定 async 属性是为了不让页面等待两个脚本的下载和执行，从而异步加载页面其他内容.

面试过程中，常问: [页面加载太久，如何进行性能优化?](https://github.com/PDKSophia/blog.io/blob/master/%E5%89%8D%E7%AB%AF%E9%9D%A2%E8%AF%95-HTML%E7%AF%87.md#%E5%A6%82%E4%BD%95%E8%BF%9B%E8%A1%8C%E7%BD%91%E7%AB%99%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96) [JS异步加载，defer和async的区别?](https://github.com/PDKSophia/blog.io/blob/master/JavaScript%E7%AF%87-%E5%BC%82%E6%AD%A5%E5%8A%A0%E8%BD%BDjs%2C%20async%E5%92%8Cdefer.md)

#### 文档模式
[DOCTYPE作用 ？ 标准模式（严格模式）和 兼容模式（混杂模式）有什么区别？](https://github.com/PDKSophia/blog.io/blob/master/%E5%89%8D%E7%AB%AF%E9%9D%A2%E8%AF%95-HTML%E7%AF%87.md#doctype%E4%BD%9C%E7%94%A8--%E6%A0%87%E5%87%86%E6%A8%A1%E5%BC%8F%E4%B8%A5%E6%A0%BC%E6%A8%A1%E5%BC%8F%E5%92%8C-%E5%85%BC%E5%AE%B9%E6%A8%A1%E5%BC%8F%E6%B7%B7%E6%9D%82%E6%A8%A1%E5%BC%8F%E6%9C%89%E4%BB%80%E4%B9%88%E5%8C%BA%E5%88%AB)

#### noscript 元素
早期浏览器不支持JavaScript时，如何让浏览器平稳的退化，解决办法就是 `<noscript>` 元素，用以在不支持 JavaScript 的浏览器中显示替代的内容。

------------

