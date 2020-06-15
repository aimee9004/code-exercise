// 详解JS函数柯里化
// 支持多参数传递
function progressCurrying(fn, args) {
  var _this = this
  var len = fn.length
  var args = args || []
  return function() {
    var _args = Array.prototype.slice.call(arguments)
    Array.prototype.push.apply(args, _args)
    // 如果参数个数小于最初的fn.length,则递归调用，继续收集参数
    if(_args.length < len) {
      return progressCurrying.call(_this, fn, _args)
    }
    // 参数收集完毕，则执行fn
    return fn.apply(this, _args)
  }
}


// 实现一个add方法，使计算结果能够满足如下预期：
// add(1)(2)(3) = 6
// add(1, 2, 3)(4) = 10
// add(1)(2)(3)(4)(5) = 15

function add() {
  // 第一次执行时，定义一个数组专门用来存储所有的参数
  var _args = Array.prototype.splice.call(arguments)
  // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
  var _adder = function() {
    _args.push(...arguments)
    return _args
  }
  // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
  _adder.toString = function() {
    return _args.reduce(function(a, b) {
      return a + b
    })
  }
  return _adder
}


/** 
 * 组件销毁时如何取消请求
 * 1.设置超时时间，超时后请求会自动断开。
 * 2.调用XMLHttpRequest实例的abort方法取消请求。
*/
// 原生js实现
function request(method, url, data = null, timeout, callback) {
  const xhr = new XMLHttpRequest();
  let timedout = false
  const timer = setTimeout(() => {
    timedout = true
    xhr.abort() // 超时取消请求
  }, timeout)
  xhr.open(method, url, true)
  xhr.send(data)
  xhr.onreadystatechange = () => {
    if(xhr.readyState !== 4) { return }
    if(timedout) { return }
    clearTimeout(timer)
    if(xhr.status === 200) {
      callback(xhr.responseText)
    }
  }
}

// axios库取消请求
// 通过传递一个 executor 函数到 CancelToken 的构造函数来创建 cancel token，请求参数携带 CancelToken 实例，取消的时候调用 cancel 函数即可。
/**
 * 1. 借助于 axios.CancelToken 生成实例、注册 cancel 函数，请求携带 cancelToken 参数。
 * 2. 取消请求时调用 cancel 方法
 */
const CancelToken = axios.CancelToken;
let cancel
axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c
  })
})

// 取消请求
cancel()