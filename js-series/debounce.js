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