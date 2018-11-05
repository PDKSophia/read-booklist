# JavaScript高级程序设计 - 第三版

## Chapter Two

### `script` 元素属性
- `async`: 可选，表示应该 <em>立即下载脚本</em>，不妨碍页面中的其他操作，只对外部脚本文件有效
- `defer`: 可选，表示脚本可以 <em>延迟</em> 到文档完全被解析和显示之后再执行，只对外部脚本文件有效
- `language`: 已废弃
- `src`: 可选，表示包含要执行代码的外部文件
- `type`: 可选，不指定这个属性，则默认 text/javascript
- `charset`: 可选，表示通过src属性指定的代码的字符集

### 标签位置
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

### 延迟 defer 和 异步 async
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

### 文档模式
[DOCTYPE作用 ？ 标准模式（严格模式）和 兼容模式（混杂模式）有什么区别？](https://github.com/PDKSophia/blog.io/blob/master/%E5%89%8D%E7%AB%AF%E9%9D%A2%E8%AF%95-HTML%E7%AF%87.md#doctype%E4%BD%9C%E7%94%A8--%E6%A0%87%E5%87%86%E6%A8%A1%E5%BC%8F%E4%B8%A5%E6%A0%BC%E6%A8%A1%E5%BC%8F%E5%92%8C-%E5%85%BC%E5%AE%B9%E6%A8%A1%E5%BC%8F%E6%B7%B7%E6%9D%82%E6%A8%A1%E5%BC%8F%E6%9C%89%E4%BB%80%E4%B9%88%E5%8C%BA%E5%88%AB)

### noscript 元素
早期浏览器不支持JavaScript时，如何让浏览器平稳的退化，解决办法就是 `<noscript>` 元素，用以在不支持 JavaScript 的浏览器中显示替代的内容。

------------

## Chapter Three

### 数据类型
ECMAScript 中有5种简单的基本数据类型: `Undefined`、`Null`、`Boolean`、`String`、`Number`，还有一种复杂数据类型`Object`，在ES6中，还多出一种`Symbol`基本类型。

基本数据类型
- Undefined
- Null
- Boolean
- String
- Number
- Symbol （ES6中新增）

复杂数据类型
- Object （使用过程中会遇到浅拷贝和深拷贝的问题）

### typeof 操作符
先看一段代码，再继续进行说明～
```javascript
  typeof undefined;    // undefined
  typeof 1;            // number
  typeof '1';          // string
  typeof true;         // boolean
  typeof text;         // text没有被声明，但是还是会显示underfined
  typeof null;         // object
  typeof [];           // object
  typeof {};           // object
```

#### Undefined 类型
Undefined类型只有一个值，那就是 `undefined`，在使用 `var` 声明一个变量但未对其加以初始化时，这个值就是undefined


```javascript
  var message 
  alert(message) // 出现弹窗, undefined

  alert(text) // 报错： Uncaught ReferenceError: text is not defined

  alert(typeof message) // undefined
  alert(typeof text)  // 虽然没有声明变量text，但是会执行typeof操作，所以会显示undefined
```
这只是声明了message，但是没有进行初始化, 所以是undefined，而text这个变量并没有被声明

也就是说: <strong>包含undefined值的变量和尚未定义的变量还是不一样的</strong>，对于尚未声明过的变量，只能执行一项操作，即使用 typeof 操作符检测其数据类型

#### Null 类型
一个经典的操作， <strong>`typeof null = object`</strong>，null表示的是一个空对象指针，而这也就是使用typeof操作符检测null值时会返回object的原因

如果定义的变量，在将来用于保存对象，那么最好将变量初始化为null而不是其他值。这样我们只要直接检查null值，就可以知道相应的变量是否已经保存了一个对象的引用。例如下边例子: 
```javascript
  if (myObj != null) {
    // 对 myObj 对象进行某些操作
  }
```
实际上，undefined值是派生自 null 值的
```javascript
  console.log(undefined == null)  // true
  console.log(undefined === null) // false
```

#### Boolean 类型
该类型只有两个字面值: `true` 和 `false`, 这两个值与数字值不是一个回事，因此 true 不一定等于1，而 false 也不一定等于0

值得注意的是: <strong>字面值true和false是区分大小写的！！</strong>, 也就是说，True 和 False 都不是Boolean值，只是标识符

可以对任何数据类型的值调用Boolean()函数，而且总会返回一个Boolean值，至于返回的是true还是false，这要看转换规则

| 数据类型 | 转换为true的值 | 转换为false的值 | 
| :------: | :------: | :------: |
| Boolean | true |  false | 
| String | 任何非空的字符串 |  ""(空字符串) | 
| Number | 任何非零数字值 |  0和NaN | 
| Object | 任何对象 |  null | 
| Undefined | 不适用 |  undefined | 

#### Number 类型
使用 IEEE 754 格式来表示整数和浮点数值

浮点数值说明: 如果浮点数，小数点后面没有跟任何数字，那么会作为整数值来保存。浮点数的最高精度是17位小数，但在算数技术时，精确度远远不如整数，最常见的就是 `0.1 + 0.2 != 0.3`

```javascript
为什么 0.1 + 0.2 ！= 0.3 ？

JS是不区分整数和浮点数的，JS 中采用 IEEE 754 64位浮点格式来表示数字，并且只要采用 IEEE 754 的语言都有该问题。

0.1二进制表示为: 1.10011(0011) * 2^-4

0.2二进制表示为: 1.10011(0011) * 2^-3

IEEE 754 双精度。六十四位中符号位占一位，整数位占十一位，其余五十二位都为小数位。并且由于无法存储无限循环的二进制，因为 0.1 和 0.2 都是无限循环的二进制了，所以在小数位末尾处需要判断是否进位（就和十进制的四舍五入一样）。

最后进位后的0.1和0.2相加起来，得到这个值算成十进制就是 0.30000000000000004

也就是 0.1 + 0.2 = 0.30000000000000004

解决方法: parseInt((0.1 + 0.2).toFixed(10))

```

#### String 类型
将一个数值转换成一个字符串，可以使用几乎每个值都有的 `toString()` 方法，数值、布尔值、对象、字符串值都有一个 toString 方法，但是 undefined 和 null 无此方法

```javascript
  var num = 10
  console.log(num.toString()) // "10"
  console.log(num.toString(2)) // 二进制, "1010"
  console.log(num.toString(8)) // 八进制, "12"
  console.log(num.toString(10)) // 十进制, "10"
  console.log(num.toString(16)) // 十六进制, "a"

```

#### Object 类型
` var tick = new Object()`

`Object`每个实例都具有下列属性和方法
- constructor: 保存着用于创建当前对象的函数，对于上面例子来说, `tick.constructor = Object`

- hasOwnProperty(propertyName): 用于检查给定的属性，在当前对象实例中（不是在实例的原型中）是否存在，其中，作为参数的属性名(propertyName)必须是字符串，例如: tick.hasOwnProperty('address')

- isPrototypeOf(object): 用于检查传入的对象是否是当前对象的原型

- propertyIsEnumerable(propertyName): 用于检查给定的属性是否能用for-in语句来枚举。其中，作为参数的属性名(propertyName)必须是字符串，

- toString(): 返回对象的字符串表示

- toLocalString(): 返回对象的字符串表示，该字符串与执行环境的地区对应

- valueOf(): 返回对象的字符串、数值或布尔值表示，通常与 toString() 返回值相同

### 操作符
#### 位操作符
所有数值都以IEEE-754 64位格式存储，但位操作符并不直接操作64位的值。而是先将64位的值转换成32位的整数，然后执行操作，最后再将结果转换回64位。

对于有符号的整数，32位中的前31位用于表示整数的值，第32位用于表示数值的符号: `0`表示正数，`1`表示负数，这个表示符号的叫做`符号位`

```javascript
  正数18的二进制

  0000 0000 0000 0000 0000 0000 0001 0010

  负数18的二进制
  1111 1111 1111 1111 1111 1111 1110 1101

```
负数同样以二进制存储，但使用的格式是`二进制补码`, 如何计算一个负数第二进制码?
- 求这个数值绝对值第二进制码(例如，求-18的二进制补码，先求18的二进制码)
- 求二进制反码，将0替换1，1替换0
- 得到的二进制反码加1

#### 按位非 (NOT)
- 用(`~`)来表示
- 返回数值的反码
```javascript
  var num1 = 25     // 二进制 0000 0000 0000 0000 0000 0000 0001 1001
  var num2 = ~num1  // 二进制 1111 1111 1111 1111 1111 1111 1110 0110
  console.log(num2) // -26
```

#### 按位与 (AND)
- 用(`&`)来表示
- 两个都位1，才为1， 否则为0
```javascript
  var result = 25 & 3
  console.log(result) // 1

  // 计算如下
   25 = 0000 0000 0000 0000 0000 0000 0001 1001
    3 = 0000 0000 0000 0000 0000 0000 0000 0011
  AND = 0000 0000 0000 0000 0000 0000 0000 0001 // 所以为 1
```

#### 按位或 (OR)
- 用(`|`)来表示
- 只要有一个1，则返回1，只有两个都为0，才返回0
```javascript
  var result = 25 | 3
  console.log(result) // 27

  // 计算如下
   25 = 0000 0000 0000 0000 0000 0000 0001 1001
    3 = 0000 0000 0000 0000 0000 0000 0000 0011
  AND = 0000 0000 0000 0000 0000 0000 0001 1011 // 所以为 27
```

#### 按位异或 (XOR)
- 用(`^`)来表示
- 相同为0， 不同为1 (都是1或者都是0，都返回0)
```javascript
  var result = 25 ^ 3
  console.log(result) // 26

  // 计算如下
   25 = 0000 0000 0000 0000 0000 0000 0001 1001
    3 = 0000 0000 0000 0000 0000 0000 0000 0011
  AND = 0000 0000 0000 0000 0000 0000 0001 1010 // 所以为 26
```

#### 左移
- 用(`<<`)来表示
- 左移动指定的位数
```javascript
  var value = 2
  var newValue = value << 5
  console.log(newValue) // 64

  // 计算如下
     value = 0000 0000 0000 0000 0000 0000 0000 0010 // 2 的二进制
  // 左移5位
  newValue = 0000 0000 0000 0000 0000 0000 0100 0000 // 64 的二进制
```

#### 有符号右移
- 用(`>>`)来表示
- 右移动指定的位数
```javascript
  var value = 64
  var newValue = value >> 5
  console.log(newValue) // 2

  // 计算如下
     value = 0000 0000 0000 0000 0000 0000 0100 0000 // 64 的二进制
  // 右移5位
  newValue = 0000 0000 0000 0000 0000 0000 0000 0010 // 2 的二进制
```

#### 无符号右移
- 用(`>>>`)来表示
- 右移动指定的位数
- 数值的所有32位都向右移
```javascript
  // 正数
  var value = 64
  var newValue = value >>> 5
  console.log(newValue) // 2

  // 计算如下
     value = 0000 0000 0000 0000 0000 0000 0100 0000 // 64 的二进制
  // 右移5位
  newValue = 0000 0000 0000 0000 0000 0000 0000 0010 // 2 的二进制

  // 负数
  var value = -64
  var newValue = value >>> 5
  console.log(newValue) // 134217726
  // 计算如下
     value = 1111 1111 1111 1111 1111 1111 1100 0000 // -64 的二进制码
  // 右移5位
  newValue = 0000 0111 1111 1111 1111 1111 1111 11110 // 134217726 的二进制
```

#### 理解参数
ECMAScript 函数不介意传递进来多少个参数，也不在乎传进来的参数是什么数据类型。实际上，在函数体内可以通过 `arguments` 对象来访问这个参数数组，从而获取传递给函数的每一个参数

其实，`arguments` 对象只是与数组类似(它并不是Array的实例)，因为可以使用方括号语法访问到它第每一个元素，使用 `length` 属性来确定传递进来多少个参数

```javascript
  function howManyArgs () {
    console.log(arguments.length)
  }

  howManyArgs('彭道宽', 21, 'HNUST')  // length: 3
  howManyArgs()                      // lenght: 0
  howManyArgs(21)                    // length: 1
```
关于 `arguments` 的行为，需要记住: 它的值，永远与对应命名参数的值保持同步，比如下面代码
```javascript
  function add (num1, num2) {
    arguments[1] = 10
    console.log(arguments[0] + num2)
  }
```
每次执行这个add()函数，都会重写第二个参数，将第二个参数修改为10，因为 arguments 对象中的值会自动反映到对应的命名参数，所有修改 arguments[1] ，也就修改了num2，它结果他们的值都会变成10

不过，<strong>并不是说读取这两个值会访问相同的内存空间</strong>，它们的内存空间是独立的，但是它们的值会同步

还要，如果只传入一个参数，那么arguments[1] 不会反映到命名参数中，因为arguments的长度是由传入的参数个数决定的。不是由定义函数时的命名参数的个数决定的。


-----------

## Chapter Four

### 基本类型和引用类型的值
引用类型的值是保存在内存中的对象，JavaScript不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。在操作对象时，实际上操作的是对象的引用而不是实际的对象

定义基本类型值和引用类型值的方式是类似的: `创建一个变量并为该变量赋值`

#### 复制变量值
从一个变量向另一个变量复制基本类型的值，会在变量对象上创建一个新值，然后把该值复制到为新变量分配的位置上。比如: 

```javascript
  var num1 = 6
  var num2 = num1
```
在这里，num1保存的值是6，当使用num1的值来初始化num2时，num也保存了值6，但是，num2中的6和num1中的6是独立的，num2中的值是num1的一个副本

当从一个变量向另一个变量复制基本类型的值时，同样会将存储在变量对象中的值复制一份放到为新变量分配的空间中，不同的是，这个值的副本实际上是一个指针，指向内存在堆中的一个对象。复制操作完后，两个变量实际上将引用同一个对象。因此改变一个变量，会影响到另一个变量，比如下边的例子
```javascript
  var obj1 = new Object()
  var ojb2 = obj1
  obj1.name = '彭道宽'
  console.log(obj2.name) // 彭道宽
```
上述代码，首先变量obj1保存了一个对象的新实例，然后这个值被复制到obj2中，换句话说，<strong>obj1和obj2都指向同一个对象</strong>，当为obj1添加一个name属性的时候，可以通过obj2来访问到这个属性，为什么？`因为这两个变量引用的都是同一个对象`

面试过程中，可能会问: [浅拷贝和深拷贝](https://github.com/PDKSophia/blog.io/blob/master/JavaScript%E7%AF%87-%E6%B7%B1%E6%8B%B7%E8%B4%9D%E5%92%8C%E6%B5%85%E6%8B%B7%E8%B4%9D.md)

#### 传递参数
在向参数传递`基本类型`的值时，被传递的值会被复制给一个局部变量。在向参数传递`引用类型`的值时，会把这个值在内存中的地址复制给一个局部变量，因此这个局部变量的变化会反映在函数的外部

举个例子： 
```javascript
  function sayName (obj) {
    obj.name = '彭道宽'
  }

  var person = new Object()
  sayName(person)
  console.log(person.name) // 彭道宽
```
上述代码，首先创建一个对象，并将其保存在person变量中，然后这个变量被传递到sayName函数之后，就被复制给了obj，在这个函数内部，obj和person引用的是同一个对象，换句话讲，即使这个变量是按值传递的，obj也会按引用来访问同一个对象。

于是在给obj添加name属性的时候，函数外部的person也会有所反映。<strong>因为person指向的对象在堆内存中只有一个,而且是全局对象</strong>

<strong>错误观点</strong>: 在局部作用域中修改的对象在全局作用域中反映处理，就说明参数是按引用传递的

为了证明`对象是按值传递`的，看下面例子: 
```javascript
  function sayName (obj) {
    obj.name = '彭道宽'
    obj = new Object() 
    obj.name = 'PDK'
  }

  var person = new Object()
  sayName(person)
  console.log(person.name) // 彭道宽
```
如果person是按引用传递的，那么person就会自动被修改指向其name为'PDK'的新对象，但是，在访问person.name的时候，显示的值仍是"彭道宽", 说明<strong>即使在函数内部修改了参数的值，但原始的引用仍然保持不变</strong>, 实际上，在函数内部重写obj，这个变量引用的就是一个局部对象了，而这个局部对象在函数执行完了之后，就会立即被销毁。


#### 检测类型
虽然说在检测基本数据类型时，`typeof`可以说是得力助手了，但是我们在检测引用类型的值时，我们并不是想知道某个值是对象，而是想知道，它是什么类型的对象的对象。

如果变量是给定引用类型的实例，那么`instanceof`操作符返回true～

根据规定，<strong>所有引用类型的值都是Object的实例</strong>，因此，在检测一个引用类型和Object构造函数时，instanceof操作符始终会返回true，如果使用instanceof操作符检测基本类型的值，则始终会返回false，因为基本类型不是对象

```javascript
  var arr = [1, 2, 3]
  var obj = { name: '彭道宽' }

  console.log(arr instanceof Array)  // true
  console.log(obj instanceof Object) // true

```

### 执行环境及作用域
> 执行环境定义了变量或函数有权访问的其他数据，决定了它们各自的行为

在Web浏览器中，全局执行环境被认为是`window`对象，因此所有全局变量和函数都是作为window对象的属性和方法创建的。某个执行环境中的所有代码执行完毕后，该环境被销毁，保存在其中的所有变量和函数定义也都会被销毁，全局执行环境在应用程序退出之后才会被销毁

每个函数都有自己的执行环境，当执行流进入一个函数时，函数的环境就会被推入到一个`环境栈`中，而在函数执行之后，栈将其环境弹出，将控制权返回给之前的执行环境。

当代码在一个环境中执行时，会创建变量对象的一个`作用域链`。作用域链的用途是: <strong>保证对执行环境有权访问的所有变量和函数的有序访问</strong>。作用域链的前端，始终都是当前执行的代码所在环境的变量对象。如果这个环境是函数，则将其`活动对象`作为变量对象，活动对象在一开始时只包含一个对象，即`arguments`对象(这个对象在全局作用域下是不存在的)。作用域连中的下一个变量对象来自外部环境，而再下一个变量对象则来自下一个包含对象。这样一直延续到全局执行环境；<strong>全局执行环境的变量对象始终都是作用域链中的最后一个对象</strong>

> 局部作用域中定义的变量可以在局部环境中与全局环境互换使用

```javascript
  var color = 'blue'

  function changeColor () {
    var colorOne = 'red'

    function swapColor () {
      var colorTwo = colorOne
      colorOne = color
      color = colorTwo

      // swapColor中，可以访问到 color、 colorOne、 colorTwo
    }

    swapColor()
    // changeColor中，可以访问到 color、 colorOne
  }

  // 这里只能访问到 color
  changeColor()
```
上诉代码中共涉及三个执行环境： window全局环境、 changeColor()的局部环境 和 swapColor()的局部环境

- 全局环境中有一个变量color和一个函数changeColor()
- changeColor()局部环境中有一个变量colorOne和一个函数swapColor()
- swapColor()局部环境中有一个变量colorTwo
```
window
  │ 
  ├── color
  │ 
  ├── changeColor()             
  │   │         
  │   ├── colorOne
  │   │         
  │   ├── swapColor()
  │   │    │ 
  │   │    ├─colorTwo        
  │   │                        
  │                   
  └─
```
<strong>内部环境可以通过作用域链访问到所有到外部环境，但外部环境不能访问到内部环境的任何变量和函数</strong>

#### 延长作用域链
虽然执行环境只有`全局环境`和`局部环境`，但是还是有其他办法来延长作用域链，比如: 有些语句可以在`作用域链的前端`添加临时一个变量对象，该变量对象会在代码执行完后被移除

两种情况会发生这种现象:
- try-catch语句中的catch块，会创建一个新的变量对象，其中包含的是被抛出的错误对象的声明
- with语句，会将指定的对象添加到作用域链中

#### 查询标识符
每个环境都可以向上搜索作用域链，以查询变量和函数名，搜索过程从作用域链的前端开始，向上逐级查询与给定名字匹配的标识符，如果在局部变量中找到了该标识符，搜索过程停止，变量就绪，如果局部变量中没有找到该变量名，则继续沿着作用域链向上搜索，一直追溯到全局环境的变量对象。如果全局环境中也没有找到这个标识符，则意味着该变量尚未声明。

```javascript
  var color = 'blue'

  function getColor () {
    return color
  }

  console.log(getColor()) // blue
```
上述代码，先搜索getColor局部环境中，是否有一个名为`color`的标识符，没有找到的情况下，继续搜索下一个变量对象(下一个是全局环境的变量对象)，然后在window全局环境的变量对象中找到了color标识符，搜索过程结束


#### 查询标识符
每个环境都可以向上搜索作用域链，以查询变量和函数名，搜索过程从作用域链的前端开始，向上逐级查询与给定名字匹配的标识符，如果在局部变量中找到了该标识符，搜索过程停止，变量就绪，如果局部变量中没有找到该变量名，则继续沿着作用域链向上搜索，一直追溯到全局环境的变量对象。如果全局环境中也没有找到这个标识符，则意味着该变量尚未声明。

```javascript
  var color = 'blue'

  function getColor () {
    return color
  }

  console.log(getColor()) // blue
```
上述代码，先搜索getColor局部环境中，是否有一个名为`color`的标识符，没有找到的情况下，继续搜索下一个变量对象(下一个是全局环境的变量对象)，然后在window全局环境的变量对象中找到了color标识符，搜索过程结束

#### 垃圾收集
由于字符、数组没有固定的大小所以当他们的大小已知时，才能对他们进行动态的存储分配。js在每一次创建字符串、数组、对象等时，解释器必须分配内存来存储那个实体。只要分配了内容，最终都要释放，不然解释器将会消耗完系统中所有可用的内存。导致系统崩溃(好像很牛逼的样子)

> 各大浏览器通常用采用的垃圾回收有两种方法：标记清除、引用计数

#### 标记清除
- 这是js最常用的垃圾回收方法，当变量进入执行环境时，就标记着这个变量为 “ 进入环境 ” (come on ~)，从逻辑上来讲不能释放 “进入环境” 的变所占用的内存，因为只要变量进入环境，意味着可能会用到该变量。当变量离开环境则标记为 “ 离开环境 ”

- 垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记。然后，它会去掉环境中的变量以及被环境中的变量引用的标记。而在此之后在被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后。垃圾收集器完成内存清除工作，销毁那些带标记的值，并回收他们所占用的内存空间。

#### 引用计数
- 引用计数的含义是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型赋值给该变量时，则这个值的引用次数就是1。
相反，如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数就减1。当这个引用次数变成0时，则说明没有办法再访问这个值了，因而就可以将其所占的内存空间给收回来。这样，垃圾收集器下次再运行时，它就会释放那些引用次数为0的值所占的内存。


#### 你以为这就结束了吗 ? NO ！
博主之前面试，有个题目就是问如果两个对象通过各自的属性相互引用，会出什么情况呢 ？ 如何解决 ？

```javascript
    function problem() {
        var objA = new Object();
        var objB = new Object();

        objA.someOtherObject = objB;
        objB.anotherObject = objA;
    }
```
在这个例子中，objA和objB通过自身属相互引用，也就是说这两个对象的引用次数都是2。在采用引用计数的策略中，由于函数执行之后，这两个对象都离开了作用域，函数执行完成之后，objA和objB还将会继续存在，因为他们的引用次数永远不会是0。这样的相互引用如果说很大量的存在就会导致大量的内存泄露。

如何解决呢 ？ 手切断他们的循环引用 ！
```javascript
    objA.someOtherObject = null
    objB.anotherObject = null
```
在这个例子中，objA和objB通过自身属相互引用，也就是说这两个对象的引用次数都是2。在采用引用计数的策略中，由于函数执行之后，这两个对象都离开了作用域，函数执行完成之后，objA和objB还将会继续存在，因为他们的引用次数永远不会是0。这样的相互引用如果说很大量的存在就会导致大量的内存泄露。

#### 性能问题
垃圾收集器是周期性运行的，而且如果为变量分配的内存数量很可观，那么回收工作量也是非常大的。像IE的垃圾收集器是根据内存分配量运行的，具体一点说就是256个变量，4096个对象(或数组)字面量和数组元素(slot)或者64KB的字符串，上述任何一个临界值，垃圾收集器就会运行。在IE7发布之后，JavaScript引擎的垃圾收集改变了工作方式: 触发垃圾收集的变量分配、字面量和数组元素的临界值被调整为动态修改，如果垃圾收集例程回收的内存分配量低于15%，则变量、字面量和数组元素的临界值就会加倍。也就是说，<strong>垃圾收集例程回收了85%的内存分配量，则将各种临界值重置回默认值</strong>


#### 管理内存
分配给Web浏览器的可用内存数量通常要比分配给桌面应用程序的少，目的是: 出于安全方面的考虑，防止运行JavaScript的网页耗尽全部系统内存而导致系统奔溃。因此，确保占用最少的内存可以让页面获得更好的性能，<strong>而优化内存占用的最佳方式，就是为执行中的代码只保存必要的数据</strong>, 一旦数据不再有用，则将值设置为 `null`来释放这个引用，这种方式就是 `接触引用`

> 局部变量会在他们离开执行环境时自动被解除引用

```javascript
  function createPerson(name) {
    var localPerson = new Object()
    localPerson.name = name
    return localPerson
  }

  var globalPerson = createPerson('彭道宽')

  // 手动解除 globalPerson 的引用
  globalPerson = null

```
上诉例子中，变量 globalPerson 取得了 createPerson() 函数返回的值。在createPerson() 内部，我们创建了一个对象并将其赋给局部变量localPerson, 然后又为该对象添加了一个名为 name 的属性。

最后调用这个函数时，localPerson 以函数值的形式返回并赋给全局变量 globalPerson。由于 localPerson 在 createPerson() 函数执行完毕之后，就离开了其执行环境，因此，我们不需要去为它解除引用，但是对于全局变量 globalPerson 来说，则需要我们在不使用它的时候，手动解除它的引用。

解除一个值的引用并不意味着自动回收该值所占用的内存。解除引用的真正作用是让值脱离执行环境，以便垃圾收集器下次运行时将其回收。
