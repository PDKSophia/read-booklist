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

数组的`length`属性很有特点——他不是只读的，通过设置这个属性，可以往数组的末尾移除项或向数组种添加新项

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
第二种: 使用`Array.isArray`方法 (ES5)
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

##### 栈方法
数组两个方法，`push()` 和 `pop()`方法，模拟实现类似栈的行为

- push()方法: 可用接收任意数量的参数，把它们逐个添加到数组的末尾，并返回修改后数组的长度
- pop()方法: 从数组末尾移除最后一项，减少数组的lenght值，然后返回移除的项

##### 队列方法
数组两个方法，`push()` 和 `shift()`方法，模拟实现类似队列的行为

- push()方法: 可用接收任意数量的参数，把它们逐个添加到数组的末尾，并返回修改后数组的长度
- shift()方法: 移除数组中的第一项并返回该项，同时将数组长度减1

#### 重排序方法
数组中已经存在两个可以直接用来重排序的方法, `reverse()` 和 `sort()`

```javascript
  // reverse() 将数组进行反转
  var values = [1, 2, 3, 4, 5]
  values.reverse()
  console.log(values) // [5, 4, 3, 2, 1]
```
```javascript
  // sort() 数组排序
  var values = [0, 1, 5, 10, 15]
  values.sort()
  console.log(values) // [0, 1, 10, 15, 5]
```
你可能会有疑惑了，为什么上面values数组进行了sort()操作之后，数组顺序改变了呢。因为<strong>sort() 方法会调用每个数组项的 toString() 转型方法，比较然后得到的字符串，以确定如何排序</strong>，也就是说，虽然 `数值5` 小于 `数值10`，但是经过`toString()`之后，在进行字符串比较时，"10" 则位于 "5" 的前面，于是数组的顺序就被修改了，如何解决？<strong>sort()函数接收一个比较函数作为参数，以便我们指定哪个值在哪个值的前面</strong>

```javascript
  function compare(a, b) {
    if (a < b) {
      return -1             // 第一个参数应该在第二个之前，返回 -1
    } else if (a > b) {
      return 1              // 第一个参数应该在第二个之后，返回 1
    } else {
      return 0              // 两个参数相等，返回 0
    }
  }

  var values = [0, 1, 5, 10, 15]
  values.sort()
  console.log(values) // [0, 1, 5, 10, 15]

```

#### 操作方法
- `concat()`: 基于当前数组中的所有项创建一个新数组。也就是会<strong>创建一个当前数组的副本</strong>，将接受到的参数添加到这个副本的末尾。在没有给concat()方法传递参数的情况下，它只是复制当前数组并返回副本，如果传递的是一或多个数组，则该方法将这些数组中的每一项添加到结果数组中。如果传递的值不是数组，这些值会被简单地添加到结果数组的末尾

- `slice()`: 基于当前数组中的一或多个项创建一个新数组。接受一或两个参数，即要返回项的起始和结束位置。如果只有一个参数，则返回指定位置到数组末尾的所有项；如果两个参数，则返回起始和结束位置之间的项，但不包括结束位置的项。如果结束位置小于开始位置，则返回空数组。<strong>slice()方法不影响原始数组</strong>

- `splice()`: 方法始终会返回一个数组，该数组包含从原始数组中删除的项（如果没有删除项，就返回空数组）,<strong>splice会影响原始数组</strong>
  - 删除: 两个参数，要删除的第一项位置和要删除的项数，比如 splice(0, 2)会删除数组的前两项

  - 插入: 可以向指定位置插入任意数量的值，提供三个参数: 起始位置、0(要删除的项数为0)、插入的项。比如: splice(2, 0, 'red', 'blue')会从当前数组的位置2开始插入字符串 'red' 和 'blue'

  - 替换: 可以向指定位置插入任意数量的值，且同时删除任意数量的项，提供三个参数: 起始位置、0(要删除的项数为0)、插入的项。比如: splice(2, 1, 'red', 'blue')会删除当前数组位置2的项，然后再从位置2开始插入字符串 'red' 和 'blue'

#### 位置方法
- indexOf(): 两个参数: 要查找的项和表示查找起点位置的索引，`从数组的开头向后查找`，返回查找的项在数组中的位置，没有找到就返回-1

- lastIndexOf(): 两个参数: 要查找的项和表示查找起点位置的索引，`从数组的末尾开始向前查找`，返回查找的项在数组中的位置，没有找到就返回-1

#### 迭代方法
- `every()`: 对数组中的每一项都运行给定函数，如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测; 如果所有元素都满足条件，则返回 true。

- `filter()`: 对数组中的每一项都运行给定函数，返回该函数会返回true的项组成的数组,<strong>filter() 不会对空数组进行检测。不会改变原始数组</strong>

- `forEach()`: 对数组中的每一项都运行给定函数，无返回值,<strong>forEach()对于空数组是不会执行回调函数的</strong>

- `map()`: 对数组中的每一项都运行给定函数，返回每次函数调用的结果组成的数组,<strong>map() 不会对空数组进行检测。不会改变原始数组</strong>

- `some()`: 对数组中的每一项都运行给定函数，如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。如果没有满足条件的元素，则返回false。<strong>some() 不会对空数组进行检测。不会改变原始数组</strong>

#### 归并方法
- `reduce()`: 迭代数组的所有项，构建一个最终返回的值，从数组的第一项开始，遍历到最后

- `reduceRight()`: 迭代数组的所有项，构建一个最终返回的值，从数组的最后一项开始，遍历到第一项

### Date类型
常用的组件方法， 其余的请自己去 [API](http://www.w3school.com.cn/js/jsref_obj_date.asp) 查找下哈～

| 方法 | 说明 |
| :------: | :------: |
| getTime() | 返回日期的毫秒数 |
| getFullYear()| 取得四位数的年份 |
| getMonth() | 返回日期中的月份，0表示一月，11表示十二月|
| getDate() | 返回日期月份中的天数(1-31) |
| getDay() | 返回日期中星期的星期几(0代表星期日，6代表星期六) |
| getHours() | 返回日期中的小时数(0-23) |
| getMinutes() | 返回日期中的分钟数(0-59) |
| getSeconds() | 返回日期中的秒数(0-59) |

### RegExp 类型
[RegExp类型，请移步到我这里，有详细说明]()

### Function 类型
函数实际上是对象。每个对象都是 `Function` 类型的实例，而且都与其他引用类型一样具有属性和方法。<strong>函数是对象，函数名是一个指向函数对象的指针</strong>

由于函数名仅仅是指向函数的指针，因此函数名与包含对象指针的其他变量没有什么不同。换句话说，一个函数可能有多个名字

```javascript
  function sum (a, b) {
    return a + b
  }
  console.log(sum(10, 20)) // 30

  var anotherSum = sum  // 注意，这里是访问函数指针，而非调用函数, 如果写成 var anotherSum = sum() ，那么anotherSum就等于sum的返回结果了
  console.log(anotherSum(10, 10)) // 20

  sum = null
  console.log(anotherSum(10, 10)) // 20

```
上述代码中，anotherSum 和 sum 都指向同一个函数，因此anotherSum() 也可以被调用并返回结果，即使将sum置为null，让它与函数“断绝关系”，但仍然可以正常访问anotherSum()

#### 函数声明与函数表达式
解析器在向执行环境加载数据时，会率先读取函数声明，并使其在执行任何代码之前可用(变量提升、函数提升)；至于函数表达式，必须等到解析器执行到它所在的代码行，才能真正被解释执行

```javascript
  alert(sum(10, 10)) // 20， 可以正常访问
  function sum(a, b) {
    return a + b
  }

  alert(sum(10, 10)) // 不可访问
  var sum = function (a, b) {
    return a + b
  }
```
第一个之所以能正常访问是因为: 在代码开始执行之前，解析器就已经通过一个名为`函数声明提升`的过程，读取并将函数声明添加到<strong>`执行环境`</strong>中，即使声明函数的代码在调用它的后面，JavaScript引擎也能把函数声明提升到顶部

第二个不能访问是因为: 函数位于一个初始化语句中，而不是一个函数声明。换句换说，能执行到函数所在的语句之前，变量sum中不会保存有对函数的引用

> 除了什么时候可以通过变量访问函数这一点外，函数声明和函数表达式的语法其实是等价的

#### 函数内部属性
在函数内部，有两个特殊的对象: `arguments` 和 `this`，arguments的主要用途是保存函数参数，但这个对象它还有一个 `callee` 得属性，该属性是一个指针，指向拥有这个arguments对象的函数。

```javascript
  function factorial (num) {
    if (num <= 1) {
      return 1;
    } else {
      return num * factorial(num-1)
    }
  }
```
上述代码存在一个问题，就是: 函数到执行与函数名factorial紧紧耦合在了一起，可以使用 `arguments.callee()` 解除这个问题
```javascript
  function factorial (num) {
    if (num <= 1) {
      return 1;
    } else {
      return num * arguments.callee(num-1)
    }
  } 
```
