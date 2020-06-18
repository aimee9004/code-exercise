

/**
 * Web Worker 
 * Web Worker 属于 HTML5 中的内容
 * 在 Web Worker 标准中，定义了解决客户端 JavaScript 无法多线程的问题。
 * 其中定义的“worker”是指执行代码的并行过程。不过，Web Worker 处在一个自包含的执行环境中，无法访问
 * Window 对象和 Document 对象，和主线程之间的通信业只能通过异步消息传递机制来实现
  */

  /**
   * Web Worker
   * 在火狐中可以直接打开测试，在 Chrome 中需要起服务器
   */
  var i = 0
  function timedCount() {
    i = i + 1
    console.log('window 对象为：', typeof window)
    console.log('global 对象为：', typeof global)
    console.log('self 对象为：', self)
    var root = (typeof window == 'object' && window.window == window && window) ||
              (typeof global === 'object' && global.global == global && global);
    console.log(root)
    postMessage(i)
    setTimeout('timedCount()', 500)
  }
  timedCount()