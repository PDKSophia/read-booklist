---
title: JavaScript高级程序设计 - 打卡第十三天
date: 2018-11-20 14:04:42
tags: card-13、try-catch、throw、常见的错误类型

---
# JavaScript高级程序设计 - 第三版

## Chapter Seventeen

### 错误处理之try-catch
```javascript
  try {
    // 可能会导致错误的代码
  } catch (error) {
    // 在错误发生时怎么处理
  }
```
我们应该把所有可能会抛出错误的代码都放在 try 语句块中，而把那些用于错误处理的代码放在 catch 块中，try 块中的任何代码发生了错误，就会立即退出代码执行过程，然后接着执行 catch 块。此时，catch 块会接收到一个包含错误信息的对象，即使你不想使用这个错误对象，也要给它起个名字。这个对象中包含的实际信息会因浏览器而异，但共同的是有一个保存着错误消息的 message 属性。

```javascript
  try {
    window.someNoneexistentFunction()
  } catch (error) {
    console.log(error.message)
  }
```

#### finally 子句
虽然在 try-catch 语句中是可选的，但 finally 子句一经使用，其代码无论如何都会执行。换句话说，<strong>try 语句块中的代码全部正常执行，finally 子句会执行; 如果因为出错而执行了 catch 语句块，finally 子句照样还会执行。</strong>只要代码中包含 finally 子句，则无论 try 或 catch 语句块中包含什么代码——甚至是 `return` 语句，都不会组织finally子句的执行

```javascript
  function test () [
    try {
      return 2
    } catch (error) {
      return 1
    } finally {
      return 0
    }
  ]
```
调用这个函数会返回 2，因为返回 2 的 return 语句位于 try 语句块中，而执行该语句又不会出错。可是，由于最后还有 一个 finally 子句，结果就会导致该 return 语句被忽略; 也就是说，调用这个函数只能返回 0。如果把 finally 子句拿掉，这个函数将返回 2。

#### 错误类型
- `Error` 是基类型，其他错误类型都继承自该类型。Error 类型的错误很少见，如果有也是浏览器抛出的; 这个基类型的主要目的是供开发人员抛出自定义错误

- `EvalError` 类型的错误会在使用 eval()函数而发生异常时被抛出，简单地说，如果没有把 eval()当成函数调用，就会抛出错误

- `RangeError` 类型的错误会在数值超出相应范围时触发。例如，在定义数组时，如果指定了数组不支持的项数，就会触发这种错误

- `ReferenceError` 在找不到对象的情况下，会发生 ReferenceError。通常，在访问不存在的变量时，就会发生这种错误

- `SyntaxError` 当我们把语法错误的 JavaScript 字符串传入 eval()函数时，就会导致此类错误, 比如 eval('a ++ b')

- `TypeError` 在变量中保存着意外的类型时，或者在访问不存在的方法时，都会导致这种错误。一般都是递给函数的参数事先未经检查，结果传入类型与预期类型不相符

- `URIError` URI 格式不正确时，就会导致 URIError 错误

### 抛出错误之throw
与 try-catch 语句相配的还有一个 throw 操作符，用于随时抛出自定义错误。在遇到 throw 操作符时，代码会立即停止执行。仅当有 try-catch 语句捕获到被抛出的值时，代码才会继续执行。在抛出了一个错误之后，浏览器会以常规方式报告这一错误，并且会显示这里的自定义错误消息

```javascript
  throw new SyntaxError("I don’t like your syntax.")
  throw new TypeError("What type of variable do you take me for?")
  throw new RangeError("Sorry, you just don’t have the range.")
  throw new EvalError("That doesn’t evaluate.")
  throw new URIError("Uri, is that you?")
  throw new ReferenceError("You didn’t cite your references properly.")
```
另外，利用 [原型链](https://github.com/PDKSophia/read-booklist/blob/master/JavaScript%E9%AB%98%E7%BA%A7%E7%BC%96%E7%A8%8B%E8%AE%BE%E8%AE%A1/play-card-3.md#%E5%8E%9F%E5%9E%8B%E9%93%BE) 还可以通过继承 Error 来创建自定义错误类型。此时，需要为新创建的错误类型指定 name 和 message 属性。

```javascript
  function CustomError (message) {
    this.name = 'CustomError'
    this.message = message
  }

  CustomError.prototype = new Error()
  throw new CustomError('my message')
```
#### 抛出错误的时机？
要针对函数为什么会执行失败给出更多信息，抛出自定义错误是一种很方便的方式。应该在出现某种特定的已知错误条件，导致函数无法正常执行时抛出错误。换句话说，浏览器会在某种特定的条件下执行函数时抛出错误。例如，下面的函数会在参数不是数组的情况下失败。

```javascript
  function process(values){
    values.sort();
    for (var i = 0, len=values.length; i < len; i++){
      if (values[i] > 100){
        return values[i];
      }
    }
    return -1
  }
```
如果执行这个函数时传给它一个字符串参数，那么对 sort()的调用就会失败, 但我们只要重写后的这个函数，如果 values 参数不是数组，就会抛出一个错误。错误消息中包含了函数 的名称，以及为什么会发生错误的明确描述。

```javascript
  function process (values) {
    if (!(values instanceof Array)) {
      throw new Error('arguments must be an array')
    }

    values.sort()
    for (var i = 0, len=values.length; i < len; i++){
      if (values[i] > 100){
        return values[i];
      }
    }
    return -1
  }
```

### 错误(error)事件
在任何 Web 浏览器中，onerror 事件处理程序都不会创建 event 对象， 但它可以接收三个参数: 错误消息、错误所在的 URL 和行号

```javascript
  window.onerror = function (message, url, line) {
    console.log(error)
  }
```
只要发生错误，无论是不是浏览器生成的，都会触发 error 事件，并执行这个事件处理程序。然后，浏览器默认的机制发挥作用，像往常一样显示出错误消息。像下面这样在事件处理程序中返回 false，可以阻止浏览器报告错误的默认行为。
```javascript
  window.onerror = function (message, url, line) {
    console.log(error)
    return false
  }
```
通过返回 false，这个函数实际上就充当了整个文档中的 try-catch 语句，可以捕获所有无代码处理的运行时错误。这个事件处理程序是避免浏览器报告错误的最后一道防线

### 常见的错误类型
错误处理的核心，是首先要知道代码里会发生什么错误。由于 JavaScript 是松散类型的，而且也不会验证函数的参数，因此错误只会在代码运行期间出现。一般来说，需要关注三种错误:
- `类型转换错误`

- `数据类型错误`

- `通信错误`

以上错误分别会在特定的模式下或者没有对值进行足够的检查的情况下发生。

#### 类型转换错误
类型转换错误发生在使用某个操作符，或者使用其他可能会自动转换值的数据类型的语言结构时。 *在使用相等(==)和不相等(!=)操作符，或者在 if、for 及 while 等流控制语句中使用非布尔值时*， 最常发生类型转换错误。
```javascript
  alert(5 == "5")     // true
  alert(5 === "5")    // false 
  alert(1 == true)    // true
  alert(1 === true)   // false
```

这里使用了相等和全等操作符比较了数值5和字符串"5"。相等操作符首先会将数值5转换成字符 串"5"，然后再将其与另一个字符串"5"进行比较，结果是 true。<strong>全等操作符知道要比较的是两种不同的数据类型</strong>，因而直接返回 false。

对于 1 和 true 也是如此: 相等操作符认为它们相等，而全等操作符认为它们不相等。使用全等和非全等操作符，可以避免发生因为使用相等和不相等操作符引发的类型转换错误，因此我们强烈推荐使用。

容易发生类型转换错误的另一个地方，就是`流控制语句`。像 if 之类的语句在确定下一步操作之前，会自动把任何值转换成布尔值。尤其是 if 语句，如果使用不当，最容易出错。来看下面的例子。
```javascript
  function concat(str1, str2, str3){
    var result = str1 + str2

    if (str3) {     //绝对不要这样!!!
      result += str3
    }
    return result
  }
```
这个函数的用意是拼接两或三个字符串，然后返回结果。其中，第三个字符串是可选的，因此必须要检查, <strong>未使用过的命名变量会自动被赋予 undefined 值。</strong>而 undefined 值可以 被转换成布尔值 false，因此这个函数中的 if 语句实际上只适用于提供了第三个参数的情况，但是问题在于，并不是只有 undefined 才会被转换成 false，也不是只有字符串值才可以转换为 true，比如如果第三个参数是数值0，那么 if 语句测试就会失败，而数值 1 就会通过测试

```javascript
  function concat(str1, str2, str3) { 
    var result = str1 + str2

    if (typeof str3 == "string") {
      result += str3
    }
    return result
  }
```

#### 数据类型错误
JavaScript 是松散类型的，也就是说，在使用变量和函数参数之前，不会对它们进行比较以确保它们的数据类型正确。为了保证不会发生数据类型错误，只能依靠开发人员编写适当的数据类型检测代码。 在将预料之外的值传递给函数的情况下，最容易发生数据类型错误。

在前面的例子中，通过检测第三个参数可以确保它是一个字符串，但是并没有检测另外两个参数。 如果该函数必须要返回一个字符串，那么只要给它传入两个数值，忽略第三个参数，就可以轻易地导致它的执行结果错误。类似的情况也存在于下面这个函数中。
```javascript
  //不安全的函数，任何非字符串值都会导致错误
  function getQueryString (url) {
    var pos = url.indexOf("?")
    if (pos > -1){
      return url.substring(pos +1);
    }
    return "" 
  }
```
这个函数的用意是返回给定 URL 中的查询字符串。为此，它首先使用 indexOf()寻找字符串中的问号。如果找到了，利用 substring()方法返回问号后面的所有字符串。这个例子中的两个函数只能操作字符串，因此只要传入其他数据类型的值就会导致错误。而添加一条简单的类型检测语句，就可以确保函数不那么容易出错。
```javascript
  function getQueryString (url) {
    if (typeof url == "string") {   //通过检查类型确保安全 var pos = url.indexOf("?");
      if (pos > -1){
        return url.substring(pos +1);
      }
    }
    return ""
  }
```
重写后的这个函数首先检查了传入的值是不是字符串。这样，就确保了函数不会因为接收到非字符串值而导致错误。

### 通信错误
JavaScript 与服务器之间的任何一次通信，都有可能会产生错误。

第一种通信错误与格式不正确的 URL 或发送的数据有关。最常见的问题是在将数据发送给服务器 之前，没有使用  ` encodeURIComponent() `对数据进行编码。例如，下面这个 URL 的格式就是不正确的:
```javascript
  http://www.yourdomain.com/?redir=http://www.someotherdomain.com?a=b&c=d 
```
针对 "redir=" 后面的所有字符串调用 encodeURIComponent()就可以解决这个问题，结果将产生如下字符串:
```javascript
  http://www.yourdomain.com/?redir=http%3A%2F%2Fwww.someotherdomain.com%3Fa%3Db%26c%3Dd 
```
对于查询字符串，应该记住必须要使用 encodeURIComponent()方法。为了确保这一点，有时候可以定义一个处理查询字符串的函数，例如:
```javascript
  function addQueryStringArg (url, name, value) {
    if (url.indexOf("?") == -1){
      url += "?"
    } else {
      url += "&" 
    }
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value)
    return url
  }
```
这个函数接收三个参数: 要追加查询字符串的 URL、参数名和参数值。如果传入的 URL 不包含问号，还要给它添加问号; 否则，就要添加一个和号，因为有问号就意味着有其他查询字符串。然后，再将经过编码的查询字符串的名和值添加到 URL 后面。可以像下面这样使用这个函数:
```javascript
  var url = "http://www.somedomain.com"
  var newUrl = addQueryStringArg(url, "redir", "http://www.someotherdomain.com?a=b&c=d")
  alert(newUrl)
```
使用这个函数而不是手工构建 URL，可以确保编码正确并避免相关错误。