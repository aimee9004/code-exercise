/**
 * 函子（Functor）
 * 链式调用
 * Functor 是一个容器，它包含了值，这个值映射到另一个容器
 * 函数式编程里面的运算，都是通过函子完成，即运算不直接针对值，而是针对这个值的容器--函子
 * 函子本身具有对外接口，各种函数就是运算符，通过接口接入容器，引发容器里面的值的变形
 * 函数式编程一般约定，函子有一个 of 方法，用来生成新的容器
 */
function double(x) {
  return x * 2
}
function add5(x) {
  return x + 5
}

class Functor{
  constructor (value) {
    this.value = value
  }
  map (fn) {
    return Functor.of(fn(this.value))
  }
}
Functor.of = function(val) {
  return new Functor(val)
}
Functor.of(5).map(add5).map(double)

/**
 * Maybe 函子
 * 如果一个字符串是null，那么对它进行toUpperCase()就会报错
 * Functor.of(null).map(s => { return s.toUpperCase() })
 */

class Maybe {
  constructor(value) {
    this.value = value
  }
  map(fn) {
    return this.value ? Maybe.of(fn(this.value)) : Maybe.of(null)
  }
}
Maybe.of = function(val) {
  return new Maybe(val)
}
var a = Maybe.of(null).map(s => {
  return s.toUpperCase()
})