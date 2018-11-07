---
title: JavaScript高级程序设计 - 打卡第三天
date: 2018-11-07 10:43:52
tags: card-3

---

# JavaScript高级程序设计 - 第三版

## Chapter Six
`对象`: 通俗理解，就是一组没有特定顺序的值，对象的每个属性或者方法都有一个名字，而每个名字都映射一个值。可以将对象想像成是散列表: 无非就是一组key-value，其中value可以是数据或函数

### 属性类型
只有内部才用的特性(attribute)时，描述了属性（property)的各种特，为了表示特性是内部值，用[[]]括起来

#### 数据属性
- [[ Configurable ]] : 能否通过delete删除属性从而重新定义属性，能否修改属性的特性，默认false

- [[ Enumerable ]] : 是否能通过 for-in 循环返回属性，也就是能否枚举，默认false

- [[ Writable ]] : 能否修改属性的值。默认false

- [[ Value ]] : 包含这个属性的数据值，读取属性值的时候从这个位置读，写入属性值的时候，把新值保存在这个位置, 默认 undefined

要修改默认属性的特殊性，需要使用 `Object.defineProperty()`方法，该方法接受三个参数： 属性所在的对象、属性的名字、描述符对象，其中，描述符对象的属性必须是: configurable、enumerable、writable、value。设置其中的一个或多个值，可以修改对应的特性值

```javascript
  // 这个例子: 如果尝试为它指定新值，在非严格模式下，赋值操作被忽略，在严格模式下，赋值操作将会导致抛出错误
  var person = {}

  Object.defineProperty(person, 'name', {
    writable: false, // 不能修改属性的值
    value: '彭道宽'  
  })

  console.log(person.name) // 彭道宽
  person.name = 'PDK'
  console.log(person.name) // 彭道宽，因为上边设置writable: false，不能修改属性的值


  // 这个例子: 调用delete，在非严格模式下，什么都不会发生，在严格模式下，删除操作将会导致抛出错误
  // 一旦属性设置成不可配置的（configurable: false），就不能把它变成可配置的了（configurable: true）会报错
  var person = {}

  Object.defineProperty(person, 'name', {
    configurable: false, // 不能删除该属性
    value: '彭道宽'  
  })

  console.log(person.name) // 彭道宽
  delete person.name
  console.log(person.name) // 彭道宽，因为上边设置configurable: false，不能删除该属性

  Object.defineProperty(person, 'name', {
    configurable: true, // 报错，因为已经被设置成不可配置
    value: '彭道宽'  
  })

```
大部分情况下，<strong>通过对象字面量创建的实例， configurable、enumerable、writable都是true的。</strong> ，戳这里: [Vue数据双向绑定原理](https://github.com/PDKSophia/blog.io/blob/master/Vue%E7%AF%87-%E6%95%B0%E6%8D%AE%E5%8F%8C%E5%90%91%E7%BB%91%E5%AE%9A%E5%8E%9F%E7%90%86.md)

#### 访问器属性
访问器属性不包含数据值；它们有一对: getter和setter(不是必需的), 在读取访问器属性时，会调用getter函数，负责返回有效的值； 在写入访问器属性时，会调用setter函数并传入新值。

- [[ Configurable ]] : 能否通过delete删除属性从而重新定义属性，能否修改属性的特性，默认false

- [[ Enumerable ]] : 是否能通过 for-in 循环返回属性，也就是能否枚举，默认false

- [[ Get ]] : 在读取属性时调用的函数，默认值为 undefined

- [[ Set ]] : 在写入属性时调用的函数，默认值为 undefined

```javascript
  // 来个代码例子
  var tick = {
    _address: 305,
    developer: 'PDK'
  }

  Object.defineProperty(tick, 'address', {
    get: function () {
      return this._address
    },
    set: function (newAddress) {
      if (newAddress > this._address) {
        this._address = newAddress
        this.developer = '彭道宽'
      }
    }
  })

  tick.address = 308
  console.log(tick) // { _address: 308, developer: '彭道宽' }

```
以上代码创建了一个tick对象，并给它定义了两个默认的属性 : _address和developer，_address前面的下划线是一种常见的记号，<strong>用于表示只能通过对象方法访问的属性</strong>，而访问器的属性address则包含getter函数和setter函数。getter函数返回_address的值，setter函数通过判断来确定正确的版本。
