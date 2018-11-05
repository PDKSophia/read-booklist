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
