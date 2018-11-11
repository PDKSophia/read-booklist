---
title: JavaScript高级程序设计 - 打卡第七天
date: 2018-11-11 14:31:52
tags: card-7、Document类型、Element类型

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