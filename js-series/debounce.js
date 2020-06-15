var count = 1
var container = document.getElementById('container')
function getUserAction(e) {
  console.log(e)
  container.innerHTML = count++
  // this的值本应为 <div id="container"></div> 
}
// container.onmousemove = getUserAction
var setUserAction = debounce(getUserAction, 1000, true)
container.onmousemove = setUserAction
document.getElementById('button').addEventListener('click', function() {
  setUserAction.cancel()
})

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
