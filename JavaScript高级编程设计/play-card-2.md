---
title: JavaScript高级程序设计 - 打卡第二天
date: 2018-11-06 09:34:52
tags: card-2、基本概念、操作符、变量、作用域、内存问题...

---

# JavaScript高级程序设计 - 第三版

## Chapter Five

### 引用类型
引用类型的值是引用类型的一个实例，`引用类型`上一种数据结构，用于将数据和功能组织在一起。
```javascript
  var person = new Object()
```
这行代码创建Object引用类型的一个新实例，然后把该实例保存在了变量person中。使用的构造函数是 Object，它只为新对象定义了默认的属性和方法

#### Object 类型
创建Object实例的方式: `new操作符后跟Object构造函数` 和 `对象字面量`
```javascript
  // new操作符后跟Object构造函数
  var person = new Object()
  person.name = '彭道宽'
  person.school = 'HNUST'

  // 对象字面量
  var person = {
    name: '彭道宽',
    school: 'HNUST'
  }
```

#### Array类型
数组的每一项可以保存任何类型的数据，比如第一项来保存字符串，第二项来保存数值，第三项来保存对象...

创建Array的基本方式有两种, `使用Array构造函数` 和 `数组字面量表达式`
```javascript
  // 使用Array构造函数
  var colors = new Array()
  // 创建length=20 的数组
  var colors = new Array(20)
  // 创建包含3个字符串值的数组
  var colors = new Array('red', 'green', 'blue')
  
  // 使用数组字面量表达式
  var colors = ['red', 'green', 'blue'] 
  // 创建空数组
  var colors = []
```

<strong>思考: 下面代码会输出什么? </strong>
```javascript
  var arr1 = new Array(6)  
  var arr2 = new Array(6, 6)

  console.log(arr1) // [undefined, undefined, undefined, undefined, undefined, undefined]
  console.log(arr2) // [6, 6]
```

数组的`length`属性很有特点——他不是只读的，通过设置这个属性，可以往数组的末尾移除项或向数组种添加新项

```javascript
  // 例子1
  var colors = ['red', 'green', 'blue'] 
  colors.length = 2
  console.log(colors[2])  // undefined

  // 例子二
  var colors = ['red', 'green', 'blue'] 
  colors.length = 4
  console.log(colors[3])  // undefined

  // 例子三
  var colors = ['red', 'green', 'blue'] 
  colors[length] = 'black'
  console.log(colors.length) // 4
  console.log(colors.length-1) // black

  // 例子四
  var colors = ['red', 'green', 'blue'] 
  colors[99] = 'black'
  console.log(colors.length) // 100
```

##### 检测数组
第一种: 使用`instanceof`操作符 (ES3)
```javascript
  if (arr instanceof Array) {
    ...
  }
```
第二张: 使用`Array.isArray`方法 (ES5)
```javascript
  if (Array.isArray(arr)) {
    ...
  }
```
##### 转换方法
所有对象都具有`toLocaleString()`、`toString()`、`valueOf()`方法。其中，调用 valueOf() 返回的还是数组本身，而调用数组的 toString() 方法会返回由数组中每个值的字符串形式拼接而成的一个以逗号分割的字符串，实际上。为了创建这个字符串会调用数组每一项的 toString() 方法

```javascript
  var person1 = {
    toLocaleString: function () {
      return 'pdk'
    },
    toString: function () {
      return '彭道宽'
    }
  }

  var person2 = {
    toLocaleString : function () {
      return 'hnust'
    },
    toString : function () {
      return '湖南科技大学'
    }
  }

  var person = [person1, person2]
  alert(person) // 数组传递给alert()时，调用数组每一项的 toString() 方法
  alert(person.toString())
  alert(person.toLocaleString())

```
>如果数组种的某一项值是 null 或者 undefined，那么该值在 join()、toLocaleString()、toString()、valueOf() 方法下返回的结果都以空字符串表示

