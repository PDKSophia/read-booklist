---
title: JavaScript高级程序设计 - 打卡第十四天
date: 2018-11-21 10:20:42
tags: card-14、JSON、XML与JSON的比较

---
# JavaScript高级程序设计 - 第三版

## Chapter Twenty

### JSON对象
早期的 JSON 解析器基本上就是使用 JavaScript 的 eval()函数。由于 JSON 是 JavaScript 语法的子集，因此 eval()函数可以解析、解释并返回 JavaScript 对象和数组

JSON 对象有两个方法: `stringify()` 和 `parse()`。在最简单的情况下，这两个方法分别用于把JavaScript 对象序列化为 JSON 字符串和把 JSON 字符串解析为原生 JavaScript 值

```javascript
  var pdk = {
    name: '彭道宽',
    age: 19
  }

  var jsonPDK = JSON.stringify(pdk) // { "name": "彭道宽", "age": "19" }

  var parsePDK = JSON.parse(jsonPDK) // 创建与 pdk 类似的对象

```

### JSON序列化选项
` JSON.stringify() `除了要序列化的 JavaScript 对象外，还可以接收另外两个参数，这两个参数用于指定以不同的方式序列化 JavaScript 对象。*第一个参数是个过滤器，可以是一个数组，也可以是一个函数;第二个参数是一个选项，表示是否在 JSON 字符串中保留缩进*。

#### 过滤结果
如果过滤器参数是数组，那么 JSON.stringify()的结果中将只包含数组中列出的属性
```javascript
  var book = {
    "title": "Professional JavaScript",
    "authors": [
      "Nicholas C. Zakas"
    ],
    edition: 3,
    year: 2011
  }
    
  var jsonText = JSON.stringify(book, ["title", "edition"])

  console.log(jsonText) // { "title": "Professional JavaScript", "edition":3 }
```
如果第二个参数是函数，行为会稍有不同。传入的函数接收两个参数，属性(键)名和属性值。根据属性(键)名可以知道应该如何处理要序列化的对象中的属性。属性名只能是字符串，而在值并非键值对儿结构的值时，键名可以是空字符串。

<strong>为了改变序列化对象的结果，函数返回的值就是相应键的值。如果函数返回了 undefined ， 那么相应的属性就会被忽略</strong>

#### 字符串缩进
JSON.stringify()方法的第三个参数用于控制结果中的缩进和空白符。如果这个参数是一个数值，那它表示的是每个级别缩进的空格数，最大缩进空格数为 10，所有大于 10 的值都会自动转换为 10。
```javascript
  var pdk = {
    name: '彭道宽',
    age: 19
  }
  var jsonText = JSON.stringify(pdk, null, 4)
  console.log(jsonText)   // {    "name": "彭道宽",    "age": 19}

```
如果缩进参数是一个字符串而非数值，则这个字符串将在 JSON 字符串中被用作缩进字符(不再使用空格)。在使用字符串的情况下，可以将缩进字符设置为制表符，或者两个短划线之类的任意字符。缩进字符串最长不能超过 10 个字符长。如果字符串长度超过了 10 个，结果中将只出现前 10 个字 符。
```javascript
  var pdk = {
    name: '彭道宽',
    age: 19
  }
  var jsonText = JSON.stringify(pdk, null, '- -')
  console.log(jsonText) // {- -"name": "彭道宽", - -"age": 19}
```

### 解析选项
JSON.parse()方法也可以接收另一个参数，该参数是一个函数，将在每个键值对儿上调用。为了区别 JSON.stringify()接收的替换(过滤)函数(replacer)，这个函数被称为还原函数(reviver)， 但实际上这两个函数的签名是相同的——它们都接收两个参数，一个键和一个值，而且都需要返回一个值。

如果还原函数返回 `undefined`，则表示要从结果中删除相应的键;如果返回其他值，则将该值插入到结果中。

```javascript
  var book = {
      "title": "Professional JavaScript",
      "authors": [
        "Nicholas C. Zakas"
      ],
      edition: 3,
      year: 2011,
      releaseDate: new Date(2011, 11, 1)
    };

  var jsonText = JSON.stringify(book)
  
  var bookCopy = JSON.parse(jsonText, function (key, value) {
    if (key == "releaseDate"){
      return new Date(value)
    } else {
      return value
    }
  })

  console.log(bookCopy.releaseDate.getFullYear())
```
以上代码先是为 book 对象新增了一个 releaseDate 属性，该属性保存着一个 Date 对象。这个对象在经过序列化之后变成了有效的 JSON 字符串，然后经过解析又在 bookCopy 中还原为一个 Date 对象。

还原函数在遇到 `releaseDate` 键时，会基于相应的值创建一个新的 Date 对象。结果就是 bookCopy.releaseDate 属性中会保存一个 Date 对象。正因为如此，才能基于这个对象调用 getFullYear()方法。

### XML与JSON的区别比较
JSON : 一种轻量级的数据交换格式，具有良好的可读和便于快速编写的特性。可在不同平台之间进行数据交换。JSON采用兼容性很高的文本格式，同时也具备类似于C语言体系的行为。

XML : XML是一种用来交换数据的标记语言，而同样是标记语言的HTML则是用来显示数据的标记语言。它允许用户自定义标签来标记数据和定义数据类型。

JSON优点 ：
- 数据格式简单，易于读写，格式都是压缩的，占用带宽小

- 易于解析，客户端JavaScript可以简单的通过eval()进行JSON数据的读取

- 多种服务器语言都有创建JSON格式的模块、方法，便于跨平台使用和后期维护

- 直接为服务器端代码使用，大大简化了服务器端和客户端的代码开发量，且完成任务不变，并且易于维护。

JSON缺点 ：
- 没有XML那么通用性, 并且描述性相对XML比较差

XML优点 ：
- 格式统一，符合标准

- 容易与其他系统进行远程交互，数据共享比较方便

XML缺点 ：
- XML文件庞大，文件格式复杂，传输占带宽

- 服务器端和客户端都需要花费大量代码来解析XML，导致服务器端和客户端代码变得异常复杂且不易维护

- 服务器端和客户端解析XML花费较多的资源和时间

```xml
  <!-- XML表示 -->
  <?xml version="1.0" encoding="utf-8" ?>
  <country>
    <name>中国</name>
    <province>
      <name>黑龙江</name>
      <citys>
        <city>哈尔滨</city>
        <city>大庆</city>
      </citys>  　　
    </province>
    <province>
      <name>广东</name>
      <citys>
        <city>广州</city>
        <city>深圳</city>
        <city>珠海</city>
      </citys> 　　
    </province>
    <province>
      <name>台湾</name>
      <citys>
      　<city>台北</city>
      　<city>高雄</city>
      </citys>　
    </province>
    <province>
      <name>新疆</name>
      <citys>
        <city>乌鲁木齐</city>
      </citys>
    </province>
  </country>
```
```javascript
  // JSON表示
  var country =
    {
      name: "中国",
      provinces: [
        { name: "黑龙江", citys: { city: ["哈尔滨", "大庆"]} },
        { name: "广东", citys: { city: ["广州", "深圳", "珠海"]} },
        { name: "台湾", citys: { city: ["台北", "高雄"]} },
        { name: "新疆", citys: { city: ["乌鲁木齐"]} }
      ]
    }
```
