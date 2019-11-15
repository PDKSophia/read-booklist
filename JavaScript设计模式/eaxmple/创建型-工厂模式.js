/** -------------------------------简单工厂------------------------------- */
function GirlFriend(name, age, cup, hobby, birthplace, eatType) {
  this.name = name
  this.age = age
  this.cup = cup
  this.hobby = hobby
  this.birthplace = birthplace
  this.eatType = eatType
}

function FactoryGirlFriend(name, age, cup, hobby, birthplace) {
  let eatType = ''
  switch (birthplace) {
    case 'chongqing':
      eatType = '吃辣，辣的一匹'
      break
    case 'guangzhou':
      eatType = '吃清淡，喝粥喝茶'
      break
    case 'fuzhou':
      eatType = '沙县，闽南菜'
      break
    default:
      break
  }
  return new GirlFriend(name, age, cup, hobby, birthplace, eatType)
}

const TanGirl = new FactoryGirlFriend('小谭女朋友', 20, '36F', '机车，学习', 'chongqing')
// 我是小谭女朋友, 我的饮食习惯是: 吃辣，辣的一匹
console.log(`我是${TanGirl.name}, 我的饮食习惯是: ${TanGirl.eatType}`)

const LiuGirl = new FactoryGirlFriend('小刘女朋友', 24, '36C', '旅游', 'guangzhou')
// 我是小刘女朋友, 我的饮食习惯是: 吃清淡，喝粥喝茶
console.log(`我是${LiuGirl.name}, 我的饮食习惯是: ${LiuGirl.eatType}`)


/** -------------------------------抽象工厂------------------------------- */
function AbstractFactoryGirlFriend(child, parent) {
  if (typeof AbstractFactoryGirlFriend[parent] === 'function') {
    function F() {}
    F.prototype = new AbstractFactoryGirlFriend[parent]()
    child.constructor = parent
    parent.prototype = new F()
  } else {
    throw new Error('不能创建该抽象类')
  }
}
// 北方姑娘抽象类
AbstractFactoryGirlFriend.NorthGirl = function() {
  this.position = 'north'
  this.author = '小何'
}
AbstractFactoryGirlFriend.NorthGirl.prototype = {
  northFeature() {
    return new Error('抽象方法不能调用')
  },
  myFeature() {
    return new Error('抽象方法不能调用')
  }
}

// 南方姑娘抽象类
AbstractFactoryGirlFriend.SouthGirl = function() {
  this.position = 'south'
}
AbstractFactoryGirlFriend.SouthGirl.prototype = {
  southFeature() {
    return new Error('抽象方法不能调用')
  },
  myFeature() {
    return new Error('抽象方法不能调用')
  }
}

// 定义具体的类如下
// 北方姑娘: 东北的小姐姐
function NorthEastGirl(name, cup, customize) {
  this.category = '东北'
  this.name = name
  this.cup = cup
  this.customize = customize
}
AbstractFactoryGirlFriend(NorthEastGirl, 'NorthGirl')
NorthEastGirl.prototype.northFeature = function() {
  return `我的名字是${this.name}, 我是个${this.category}姑娘，我的cup是${this.cup}`
}
NorthEastGirl.prototype.myFeature = function() {
  return JSON.stringify(this.customize)
}

// 北方姑娘: 西北的小姐姐
function NorthWestGirl(name, cup, customize) {
  this.category = '西北'
  this.name = name
  this.cup = cup
  this.customize = customize
}
AbstractFactoryGirlFriend(NorthWestGirl, 'SouthGirl')
NorthWestGirl.prototype.northFeature = function() {
  return `我的名字是${this.name}, 我是个${this.category}姑娘，我的cup是${this.cup}`
}
NorthWestGirl.prototype.myFeature = function() {
  return JSON.stringify(this.customize)
}

const TanNorthEastGirl = new NorthEastGirl('小谭女朋友', '36D', { beer: '随便灌', liquor: '五斤半' })
// 我的名字是小谭女朋友, 我是个东北姑娘，我的cup是36D
// {"beer":"随便灌","liquor":"五斤半"}
console.log(TanNorthEastGirl.northFeature())
console.log(TanNorthEastGirl.myFeature())

const LiuNorthWestGirl = new NorthWestGirl('小刘女朋友', '36C', { sexy: true, beautiful: true})
// 我的名字是小刘女朋友, 我是个西北姑娘，我的cup是36C
// {"sexy":true,"beautiful":true}
console.log(LiuNorthWestGirl.northFeature())
console.log(LiuNorthWestGirl.myFeature())