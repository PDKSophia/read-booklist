---
title: JavaScript高级程序设计 - 打卡第四天
date: 2018-11-07 10:43:52
tags: card-3、数据属性、访问器属性、原型链继承、构造函数继承、组合继承、寄生式继承、原型式继承

---

# JavaScript高级程序设计 - 第三版

## Chapter Seven
### 递归
首先看个经典递归代码: 
```javascript
  function factorial(num) {
    if (num <= 1) {
      return 1
    } else {
      return num * factorial(num-1)
    }
  }
```
虽然看不出什么问题，但是下面的代码会导致它出错
```javascript
  function factorial(num) {
    if (num <= 1) {
      return 1
    } else {
      return num * factorial(num-1)
    }
  }
  
  var func = factorial
  factorial = null
  console.log(func(4)) // 报错
```
以上代码，将factorial()函数保存在变量func中，然后将factorial变量置为空，那么指向原始函数的引用只剩下一个了，但在接下来调用func(4)的时候，由于必须执行factorial()，而factorial已经不再是函数，所以会报错误。

使用`arguments.callee()` 可以解决这种问题，我们知道，`arguments.callee()`是一个指向正在执行的函数的指针
```javascript
  function factorial (num) {
    if (num <= 1) {
      return 1
  } else {
      return num * arguments.callee(num-1)
  }
```
但是在严格模式下，不能通过脚本访问 `arguments.callee`，访问这个属性会导致错误，因此使用命名函数表达式来达成相同的结果。例如:
```javascript
  var factorial = (function f(num){
    if (num <= 1) {
      return 1
    } else {
        return num * f(num-1)
    }
  })
```

### 闭包
<strong>闭包: 有权访问另一个函数作用域中的变量的函数。</strong>

创建闭包的常见方式，就是在一个函数内部创建另一个函数； 当某个函数被调用时，会创建一个执行环境以及相应的作用域链，然后，使用 arguments 和其他命名参数的值来初始化函数的活动对象，但在作用域链中，外部函数的活动对象是种处于第二位，外部函数的外部函数的活动对象处于第三位...一直到作为作用域链终点的全局执行环境。

来看个例子:
```javascript
  function compare (value1, value2) {
    if (value1 < value2) {
      return -1
    } else if (value1 > value2) {
      return 1
    } else {
      return 0
    }
  }

  var result = compare(5, 10)
```
下面的图，表示了 compare() 函数执行时的作用域链。首先定义了compare()函数，然后在全局作用域中调用了它。调用 compare() 函数的时候，会创建一个包含 `argumetns`、`value1`、`value2`的活动对象。全局执行环境的变量对象(包含result和compare)在compare()执行环境的作用域链中则处于第二位

<img src='../book-image/js-red-1.png' />