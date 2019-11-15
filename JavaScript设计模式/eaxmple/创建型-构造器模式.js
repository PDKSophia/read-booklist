/** -------------------------------简单构造器------------------------------- */
function GirlFriend(name, age, cup, hobby) {
  this.name = name;
  this.age = age;
  this.cup = cup;
  this.hobby = hobby;

  this.toCopyright = function() {
    console.log(`我是被小何创造出来的对象，我叫${this.name}`);
  };
}
const daiGirl = new GirlFriend("小戴女朋友", 20, "36F", "机车");
const xieGirl = new GirlFriend("小谢女朋友", 19, "36C", "看书");

console.log(daiGirl.toCopyright()); // 我是被小何创造出来的对象，我叫小戴女朋友
console.log(xieGirl.toCopyright()); // 我是被小何创造出来的对象，我叫小谢女朋友



/** -------------------------------带原型的构造器------------------------------- */
function GirlFriend(name, age, cup, hobby) {
  this.name = name;
  this.age = age;
  this.cup = cup;
  this.hobby = hobby;
}

GirlFriend.prototype.toCopyright = function() {
  console.log(`我是被小何创造出来的对象，我叫${this.name}`);
};

const daiGirl = new GirlFriend("小戴女朋友", 20, "36F", "机车");
const xieGirl = new GirlFriend("小谢女朋友", 19, "36C", "看书");

console.log(daiGirl.toCopyright()); // 我是被小何创造出来的对象，我叫小戴女朋友
console.log(xieGirl.toCopyright()); // 我是被小何创造出来的对象，我叫小谢女朋友
