/**
 * underscore 系列之如何写自己的 underscore
 */

(function() {
  var root = this
  var _ = {}
  root._ = _
  // 在这里添加自己的方法
  _.reverse = function(string) {
    return string.split('').reverse().join('')
  }
})()
_.reverse('hello')

// 判断了浏览器和 Node 环境
var root1 = (typeof window == 'object' && window.window == window && window) ||
            (typeof global == 'object' && global.global == global && global)


// v1.8.3
var root2 = (typeof self == 'object' && self.self == self && self) ||
            (typeof global === 'object' && global.global == global && global) ||
            this || {}

// 函数对象
// 函数式风格
_.each([1, 2, 3], function(item) {
  conosle.log(item)
})
// 面向对象风格
// _函数返回一个对象
_([1, 2, 3]).each(function(item) {
  console.log(item)
})

var _ = function(obj) {
  if(!(this instanceof _)) return new _(obj)
  this._wrapped = obj
}


// minxin
var ArrayProto = Array.prototype
var push = ArrayProto.push
_.minin = function(obj) {
  _.each(_.functions(obj), function(name) {
    var func = _[name] = obj[name]
    _.prototype[name] = function() {
      var args = [this._wrapped]
      push.apply(args, arguments)
      return func.apply(_, args)
    }
  })
  return _
}
_.minin({
  addOne: function(num) {
    return num + 1
  }
})
// 至此，算是实现了同时支持面向对象风格和函数风格

// 导出 最后一步 root._ = _
if(typeof exports != 'undefined' && !exports.nodeType) {
  if(typeof module != 'undefined' && !module.nodeType && module.exports) {
    exports = modules.exports = _
  }
  exports._ = _
}else {
  root._ = _
}

// nodejs 模块的 API 早起版本
exports.addOne = function(num) {
  return num + 1
}
var add = require('./add')
add.addOne(2)

/**
 * 源码
 * 最终的代码如下，有了这个基本结构，可以自由添加需要使用到的函数
 */
(function() {
  var root = (typeof self === 'object' && self.self === self && self) ||
              (typeof global === 'object' && global.global === global && global) ||
              this || {};
  var ArrayProto = Array.prototype;
  var push = ArrayProto.push;
  var _ = function(obj) {
    if(obj instanceof _) return obj;
    if(!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };
  if(typeof exports != 'undefined' && !exports.nodeType) {
    if(typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _
  }else {
    root._ = _
  }
  _.VERSION = '0.1'
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var isArrayLike = function(collection) {
    var length = collection.length
    return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  _.each = function(obj, callback) {
    var length, i = 0;
    if(isArrayLike(obj)) {
      length = obj.length
      for(; i < length; i++) {
        if(callback.call(obj[i], obj[i], i) === false) {
          break;
        }
      }
    }else {
      for(i in obj) {
        if(callback.call(obj[i], obj[i], i) === false) {
          break;
        }
      }
    }
    return obj;
  }
  _.isFunction = function(obj) {
    return typeof obj === 'function' || false;
  };

  _.functions = function(obj) {
    var names = []
    for(var key in obj) {
      if(_.isFunction(obj[key])) names.push(key)
    }
    return names.sort()
  };

  /**
   * 在 _.mixin(_)前添加自己定义的方法
   */
  _.reverse = function(string) {
    return string.split('').reverse().join('');
  }

  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name]
      _.prototype[name] = function() {
        var args = [this._wrapped]
        push.apply(args, arguments)
        return func.apply(_, args)
      }
    })
    return _;
  };
  _.mixin();

})()