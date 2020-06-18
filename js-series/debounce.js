import { _ } from "./underscore";

var count = 1
var container = document.getElementById('container')
function getUserAction(e) {
  console.log(e)
  container.innerHTML = count++
  // this的值本应为 <div id="container"></div> 
}
// container.onmousemove = getUserAction
// var setUserAction = debounce(getUserAction, 1000, true)
// container.onmousemove = setUserAction
// document.getElementById('button').addEventListener('click', function() {
  //   setUserAction.cancel()
  // })
  
  container.onmousemove = throttle(getUserAction, 3000, true)

/**
 * 防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，
 * 那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行，真是任性呐!
 */

//  第一版
function debounce1(func, wait) {
  var timeout;
  return function() {
    clearTimeout(timeout)
    timeout = setTimeout(func, wait)
  }
}

// 第二版
function debounce2(func, wait) {
  var timeout;
  return function() {
    var context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context)
    }, wait)
  }
}

/**
 * 第三版 
 * 1. this 指向
 * 2. event 对象
 */
function debounce3(func, wait) {
  var timeout;
  return function() {
    var context = this
    var args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

/**
 * 第四版
 * 立刻执行
  */
function debounce4(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this
    var args = arguments
    if(timeout) clearTimeout(timeout)
    if(immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if(callNow) func.apply(context, args)
    }else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 * 第五版
 * 返回值
 */
function debounce5(func, wait, immediate) {
  var timeout, result;
  return function() {
    var context = this
    var args = arguments
    if(timeout) clearTimeout(timeout)
    if(immediate) {
      var callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if(callNow) {
        result = func.apply(context, args)
      }
    }else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
    return result
  }
}

/**
 * 第六版 最后一版
 * 取消
 */
function debounce(func, wait, immediate) {
  var timeout, result;
  var debounced = function() {
    var context = this;
    var args = arguments;
    if(timeout) clearTimeout(timeout)
    if(immediate) {
      var callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if(callNow) result = func.apply(context, args)
    }else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
    return result
  }
  debounced.cancel = () => {
    console.log(123)
    clearTimeout(timeout)
    timeout = null
  }
  return debounced
}


///////////////////////////////////////////////////////////////////

// 节流
/**
 * 使用时间戳
 * 第一版
 * 当触发事件的时候，取出当前的时间戳，然后减去之前的时间戳（最一开始值为0），
 * 如果大于设置的时间周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于就不执行。
 */
function throttle1(func, wait) {
  var context, args;
  var previous = 0
  return function() {
    var now = +new Date()
    context = this
    args = arguments
    if(now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}

/**
 * 使用定时器
 * 第二版 
 * 当触发事件的时候，设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，
 * 直到定时器执行，然后执行函数，清空定时器
 */
function throttle2(func, wait) {
  var timeout, context, args;
  var previous = 0
  return function() {
    context = this
    args = arguments
    if(!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 * 双剑合璧
 * 第三版
 * 鼠标移入能立刻执行，停止触发的时候还能再执行一次
 * leading 代表首次是否执行，trailing 代表结束后是否再次执行一次
 */
function throttle3(func, wait) {
  var timeout, context, args, result;
  var previous = 0
  var later = function() {
    previous = +new Date()
    timeout = null
    func.apply(context, args)
  }
  var throttled = function() {
    var now = +new Date()
    // 下次触发 func 剩余的时间
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    // 如果没有剩余的时间了或者改了系统时间
    if(remaining <= 0 || remaining > wait) {
      if(timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(context, args)
    }else if(!timeout) {
      timeout = setTimeout(later, remaining)
    }
  }
  return throttled
}

/**
 * 优化
 * 第四版
 * 有时希望无头有尾，或者有头无尾
 * 设置个options作为第三个参数
 * leading: false 表示禁用第一次执行
 * trailing: false 表示禁用停止触发的回调
 */
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if(!options) options = {}
  var later = function() {
    previous = options.leading === false ? 0 : new Date().getTime()
    timeout = null
    func.apply(context, args)
    if(!timeout) context = args = null
  }
  var throttled = function() {
    var now = new Date().getTime()
    if(!previous && options.leading === false) previous = now
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    if(remaining <= 0 || remaining > wait) {
      if(timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(context, args)
      if(!timeout) context = args = null
    }else if(!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
  }
  return throttled
}

/**
 * 1. 函数节流处理
 * 2. 立即执行回调函数
 * 3. 函数脱离事件后，还会执行一次
 */
function throttle5(fn, delay, immediate) {
  var timer = null
  var start = +new Date()
  return function() {
    window.clearTimeout(timer)
    var context = this
    var now = +new Date()
    var arr = []
    var result = null
    for(var i = 0; i < arguments.length; i++) {
      arr.push(arguments[i])
    }
    // 是否需要立即执行
    if(immediate) {
      // 只执行第一次
      immediate = false
      fn.apply(context, arr)
    }else {
      if(now - start >= delay) {
        start = now
        result = fn.apply(context, arr)
      }else {
        // 函数脱离事件后仍然会执行
        timer = window.setTimeout(() => {
          fn.apply(context, arr)
        }, delay)
      }
    }
    return result
  }
}



/**
 * underscore 源码
 * 
 * underscore 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 * 
 * @param {function} func   回调函数
 * @param {number}  wait    表示时间窗口的间隔
 * @param {boolean} immediate   设置为true时，是否立即调用函数
 * @return {function}           返回客户调用函数 
 */
_.debounce = function(func, wait, immediate) {
  var timeout, args, context, timestamp, result;
  var later = function() {
    // 现在和上一次时间戳比较
    var last = _.now() - timestamp
    // 如果当前间隔时间少于设定时间且大于0就重新设置定时器
    if(last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    }else {
      // 否则的话就是时间到了执行回调函数
      timeout = null
      if(!immediate) {
        result = func.apply(context, args)
        if(!timeout) context = args = null
      }
    }
  };

  return function() {
    context = this
    args = arguments
    // 获得时间戳
    timestamp = _.now()
    // 如果定时器不存在且立即执行函数
    var callNow = immediate && !timeout
    // 如果定时器不存在就创建一个
    if(!timeout) timeout = setTimeout(later, wait)
    if(callNow) {
      // 如果需要立即执行函数的话，通过 apply 执行
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}

/**
 * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
 * 
 * @param {function} func   回调函数
 * @param {number}  wait    表示时间窗口的间隔
 * @param {object}  options   如果想忽略开始函数的调用，传入{leading: false}
 *                            如果想忽略结尾函数的调用，传入{trailing: false}
 *                            两者不能共存，否则函数不能执行
 * @return {function}         返回客户调用函数
 */
_.throttle = function(func, wait, options) {
  var context, args, result;
  var timeout = null
  // 之前的时间戳
  var previous = 0
  // 如果 options 没传则设为空对象
  if(!options) options = {}
  // 定时器回调函数
  var later = function() {
    // 如果设置了 leading，就将 previous 设为0
    // 用于下面函数的第一个 if 判断
    previous = options.leading === false ? 0 : _.now()
    // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
    timeout = null
    result = func.apply(context, args)
    if(!timeout) context = args = null
  }
  return function() {
    // 获得当前时间戳
    var now = _.now()
    // 首次进入前者肯定为 true
      // 如果需要第一次不执行函数
      // 就将上次时间戳设为当前的
    // 这样在接下来计算 remaining 的值时会大于0
    if(!previous && options.leading === false) previous = now
    // 计算剩余时间
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    // 如果当前调用已将大于上次调用时间 + wait
    // 或者用户手动调了时间
      // 如果设置了 trailing，只会进入这个条件
      // 如果没有设置 leading，那么第一次会进入这个条件
      // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
      // 其实还是会进入的，因为定时器的延时
      // 并不是准确的时间，很可能你设置了2秒
      // 但是他需要2.2秒才触发，这时候就会进入这个条件
    if(remaining <= 0 || remaining > wait) {
      // 如果存在定时器就清理掉否则会调用二次回调
      if(timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if(!timeout) context = args = null
    }else if(!timeout && options.trailing !== false) {
      // 判断是否设置了定时器和 trailing
        // 没有的话就开启一个定时器
      // 并且不能同时设置 leading 和 trailing
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}