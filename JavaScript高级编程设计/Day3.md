# JavaScript 高级程序设计 - 第三版

## Chapter Six

对象 : 通俗理解，就是一组没有特定顺序的值，对象的每个属性或者方法都有一个名字，而每个名字都映射一个值。可以将对象想像成是散列表: 无非就是一组 key-value，其中 value 可以是数据或函数

### 属性类型

只有内部才用的特性(attribute)时，描述了属性（property)的各种特，为了表示特性是内部值，用[[]]括起来

#### 数据属性

- [[ Configurable ]] : 能否通过 delete 删除属性从而重新定义属性，能否修改属性的特性，默认 false

- [[ Enumerable ]] : 是否能通过 for-in 循环返回属性，也就是能否枚举，默认 false

- [[ Writable ]] : 能否修改属性的值。默认 false

- [[ Value ]] : 包含这个属性的数据值，读取属性值的时候从这个位置读，写入属性值的时候，把新值保存在这个位置, 默认 undefined

要修改默认属性的特殊性，需要使用 `Object.defineProperty()` 方法，该方法接受三个参数： 属性所在的对象、属性的名字、描述符对象，其中，描述符对象的属性必须是: configurable、enumerable、writable、value。设置其中的一个或多个值，可以修改对应的特性值

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

大部分情况下，<strong>通过对象字面量创建的实例， configurable、enumerable、writable 都是 true 的。</strong>

#### 访问器属性

访问器属性不包含数据值；它们有一对: getter 和 setter(不是必需的), 在读取访问器属性时，会调用 getter 函数，负责返回有效的值； 在写入访问器属性时，会调用 setter 函数并传入新值。

- [[ Configurable ]] : 能否通过 delete 删除属性从而重新定义属性，能否修改属性的特性，默认 false

- [[ Enumerable ]] : 是否能通过 for-in 循环返回属性，也就是能否枚举，默认 false

- [[ Get ]] : 在读取属性时调用的函数，默认值为 undefined

- [[ Set ]] : 在写入属性时调用的函数，默认值为 undefined

```javascript
// 来个代码例子
var tick = {
  _address: 305,
  developer: 'PDK'
}

Object.defineProperty(tick, 'address', {
  get: function() {
    return this._address
  },
  set: function(newAddress) {
    if (newAddress > this._address) {
      this._address = newAddress
      this.developer = '彭道宽'
    }
  }
})

tick.address = 308
console.log(tick) // { _address: 308, developer: '彭道宽' }
```

以上代码创建了一个 tick 对象，并给它定义了两个默认的属性 : `_address` 和 `developer`，`_address` 前面的下划线是一种常见的记号，**用于表示只能通过对象方法访问的属性**，而访问器的属性 address 则包含 getter 函数和 setter 函数。getter 函数返回`_address` 的值，setter 函数通过判断来确定正确的版本。

在官网 API 中，对访问器的 get、set 属性是这样介绍的

- get : 一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。**当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入 this 对象**。默认为 undefined。

- set : 一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。**当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值**。默认为 undefined。

所以在上面例子，传入的属性是 `address`，然后在下面我们对属性 `address` 进行了修改，这时候就触发了上边的 set 方法，然后 newAddress 等于我们修改的新值，然后比较，修改了 `tick._address` 的值

在 Vue 的双向绑定原理就是通过 `Object.defineProperty()` 来实现的, 不过在 vue3 中会通过 `proxy`

```javascript
// 这是将要被劫持的对象
const data = {
  name: ''
}

function say(name) {
  if (name === '古天乐') {
    console.log('给大家推荐一款超好玩的游戏')
  } else if (name === '渣渣辉') {
    console.log('戏我演过很多,可游戏我只玩贪玩懒月')
  } else {
    console.log('来做我的兄弟')
  }
}

// 遍历对象,对其属性值进行劫持
Object.keys(data).forEach(function(key) {
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      console.log('get')
    },
    set: function(newVal) {
      // 当属性值发生变化时我们可以进行额外操作
      console.log(`大家好,我系${newVal}`)
      say(newVal)
    }
  })
})

data.name = '渣渣辉'
//大家好,我系渣渣辉
//戏我演过很多,可游戏我只玩贪玩懒月
```

#### 定义多个属性

通过 `Object.defineProperties()` 方法可以通过描述符一次定义多个属性。第一个参数是要添加和修改的对象，第二个是对象的属性与第一个对象中要添加或者修改的属性一一对应, 具体代码看下边的例子。

#### 读取属性的特性

使用 `Object.getOwnPropertyDescriptor()` 方法可以取得给定属性的描述符，接收两个参数： 属性所在的对象和描述符的属性名称，返回的是一个对象

如果是数据属性，这个对象的属性有: configurable、enumerable、writable、value；

如果是访问器属性，这个对象的属性有: configurable、enumerable、get、set

```javascript
var tick = {}

// 定义tick的多个属性
Object.defineProperties(tick, {
  _address: {
    value: 308
  },

  developer: {
    value: 'PDK'
  },

  address: {
    get: function() {
      return this._address
    },
    set: function(newAddress) {
      if (newAddress > this._address) {
        this._address = newAddress
        this.developer = '彭道宽'
      }
    }
  }
})

var desc = Object.getOwnPropertyDescriptor(tick, '_address') // 传入的是数据属性
console.log(desc.value) // 308
console.log(desc.configurable) // false
console.log(desc.writable) // false
console.log(desc.get) // undefined

var desc1 = Object.getOwnPropertyDescriptor(tick, 'address') // 传入的是访问器属性
console.log(desc1.value) // undefined
console.log(desc1.configurable) // false
console.log(desc1.writable) // undefined
console.log(desc1.get) // function
```

### 创建对象

这里的工厂模式、构造函数模式、原型模式等设计模式，后期看了《JavaScript 设计模式与开发实践》之后会补上

### 继承

#### 原型链

利用原型，让一个引用类型继承另一个引用类型的属性和方法； 实现原型链有一种基本模式。如下例代码

```javascript
function SuperType() {
  this.property = true
}

SuperType.prototype.getSuperValue = function() {
  return this.property
}

function SubType() {
  this.subproperty = false
}

SubType.prototype = new SuperType()

SubType.prototype.getSubValue = function() {
  return this.subproperty
}

var instance = new SubType()
console.log(instance.getSubValue()) // false
console.log(instance.getSuperValue()) // true
```

上述代码，定义了两个类型: SuperType 和 SubType，每个类型分别有一个属性和方法，它们的区别是: SubType 继承了 SuperType，而继承是通过创建 SuperType 的实例，并将该实例赋给 SubType.prototype 实现的。实现的本质是重写原型对象，代之以一个新类型的实例。换句换说，<strong>原来存在于 SuperType 的实例中的所有属性和方法，现在也存在于 SubType.prototype 中了 </strong>

在上述代码中，没有使用 SubType 默认提供的原型，而是给它换了一个新的原型: 这个原型就是 SuperType 的实例。于是，新原型不仅作为一个 SuperType 的实例所拥有的全部属性和方法，而且其内部还有一个指针，指向了 SuperType 的原型，最终结果是这样的 : `intance 指向 SubType的原型，SubType的原型指向SuperType的原型。getSuperValue() 方法仍然在SuperType.prototype上，但是property位于SubType.prototype中。`这是因为 property 是一个实例属性，而 getSuperValue()是一个原型方法。

SubType.prototype 是 SuperType 的实例，那么 property 就存在于该实例中了。注意: <strong>instance.constructor 现在不是指向 SubType，而是指向 SuperType</strong>，这是因为 SubType.prototype 被重写的缘故。实际上，不是 SubType 的原型的 constructor 属性被重写，而是 SubType 的原型指向了另一个对象——SuperType 的原型，而这个原型对象的 constructor 属性指向的是 SuperType

#### 借用构造函数

由于原型链存在着一些问题： 什么问题呢？就是`包含引用类型值的原型`。之前说过，**包含引用类型值的原型属性会被所有实例共享**，比如下边代码

```javascript
function SuperType() {
  this.colors = ['red', 'yellow']
}

function SubType() {}

// 继承了SuperType
SubType.prototype = new SuperType()

var instance1 = new SubType() // intance.constructor = SuperType
instance1.colors.push('black')
console.log(instance1.colors) // ['red', 'yellow', 'black']

var instance2 = new SubType()
console.log(instance2.colors) // ['red', 'yellow', 'black']

// 这里多出几道题，理解一下原型和原型链
console.log(instance1.constructor) // SuperType
console.log(SubType.prototype.constructor) // SuperType
console.log(SubType.prototype.__proto__ == SuperType.prototype) // true
console.log(instance1.__proto__ == SubType.prototype) // true
console.log(SubType.__proto__ == SuperType.prototype) // false
console.log(SubType.__proto__ == Function.prototype) // true
console.log(SuperType.prototype.constructor == SuperType) // true
console.log(SuperType.__proto__ == Function.prototype) // true
console.log(SuperType.prototype.__proto__ == Object.prototype) // true

// 为什么instance1.constructor = SuperType ？ 为什么 SubType.prototype.constructor = SuperType ？
```

你看，这就出问题了吧，因为在 SuperType 构造函数中定义了一个 colors 属性，当通过原型链继承了之后，SubType.prototype 就变成了 SuperType 的一个实例，因此它也拥有了一个它自己的 colors 属性——就跟专门创建了一个 SubType.prototype.colors 一样，那么所有 SubType 的实例都会共享这个 colors 属性，而 instance1 和 instance2 都是 SubType 的实例，对 instance1.colors 的修改，在 instance2.colors 中也会反映出来

**所以我们为了解决原型中包含引用类型值带来的问题过程中，使用了`借用构造函数`的技术，通过 apply()和 call()方法在(将来)新创建的对象上执行构造函数**

```javascript
function SuperType() {
  this.colors = ['red', 'yellow']
}

function SubType() {
  // 继承了SuperType
  SuperType.call(this)
}

var instance1 = new SubType()
instance1.colors.push('black')
console.log(instance1.colors) // ['red', 'yellow', 'black']

var instance2 = new SubType()
console.log(instance2.colors) // ['red', 'yellow']

// 思考一哈？
console.log(instance1.constructor) // SubType
console.log(SubType.prototype.constructor) // SubType
console.log(SubType.prototype.__proto__) // {}
console.log(SubType.prototype.__proto__ == SuperType.prototype) // false
console.log(SubType.prototype.__proto__ == Object.prototype) // true
console.log(instance1.__proto__ == SubType.prototype) // true
console.log(SubType.__proto__ == SuperType.prototype) // false
console.log(SubType.__proto__ == Function.prototype) // true
console.log(SuperType.prototype.constructor == SuperType) // true
console.log(SuperType.__proto__ == Function.prototype) // true
console.log(SuperType.prototype.__proto__ == Object.prototype) // true
```

#### 组合继承

将原型链和借用构造函数的技术组合在一起。背后的思路是: **使用原型链实现对原型属性和方法的继承（prototype 上定义的方法和属性），而通过借用构造函数来实现对实例属性的继承（自身的方法和属性）**。这样，既通过在原型上定义方法实现了函数的服用，又能够保证每个实例都有它的属性。

```javascript
function SuperType() {
  this.name = '彭道宽' // 这叫实例属性
}

SuperType.prototype.getName = function() {} // 这叫做原型属性
```

```javascript
function SuperType(name) {
  this.name = name
  this.colors = ['red', 'yellow']
}

SuperType.prototype.sayName = function() {
  return this.name
}

function SubType(name, age) {
  SuperType.call(this, name)
  this.age = age
}

// 继承方法
SubType.prototype = new SuperType()
SubType.prototype.constructor = SubType // 注意, 如果没有说明，那么SubType.prototype.constructor 就会是指向 SuperType
SubType.prototype.sayAge = function() {
  console.log(this.age)
}

var instance1 = new SubType('彭道宽', 21)
instance1.colors.push('black')
console.log(instance1.colors) // ['red', 'yellow', 'black']
instance1.sayName() // 彭道宽
instance1.sayAge() // 21

var instance2 = new SubType('PDK', 28)
console.log(instance2.colors) // ['red', 'yellow']
instance2.sayName() // PDK
instance2.sayAge() // 18
```

#### 原型式继承

ECMAScript5 新增 Object.create()方法规范了原型式继承，这个方法接收两个参数: 一个用作新对象原型的对象和一个为新对象定义额外属性的对象。

```javascript
var person = {
  name: 'PDK',
  friends: ['a', 'b', 'c']
}

var obj1 = Object.create(person)
obj1.name = 'OB-1'
obj1.friends.push('d')

var obj2 = Object.create(person)
obj2.name = 'OB-2'
obj2.friends.push('e')

console.log(person.friends) // ['a', 'b', 'c', 'd', 'e']
console.log(person.name) // PDK
```

> Object.create()方法的第二个参数于 Object.defineProperties()方法的第二个参数格式相同，每个属性都是通过自己的描述符定义的。以这种方式指定的任何属性都会覆盖原型对象上的同名属性。

#### 寄生式继承

思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象。

```javascript
function createObject(origin) {
  var clone = Object.create(origin) // 通过调用函数来创建一个对象
  clone.sayHi = function() {
    console.log('hi')
  }
  return clone // 返回这个对象
}

var person = {
  name: 'pdk'
}
var resClone = createObject(person)
resClone.sayHi() // "hi"
```

#### 寄生组合式继承

所谓的寄生组合式继承，就是通过借用构造函数来继承属性，通过原型链的混用来继承方法。本质上，就是使用寄生式继承来继承超类型的原型，然后将结果指定给自类型的原型。

```javascript
function inheritPrototype(SubType, SuperType) {
  var prototype = Object.create(SuperType.prototype) // 创建对象
  prototype.constructor = SubType // 增强对象
  SubType.prototype = prototype // 指定对象
}
```
