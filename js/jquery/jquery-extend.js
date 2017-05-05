/**
 * $.extend 定义与调用
 */
$.extend(true, {fun1: function() {alert('执行方法一');}});
$.fun1();
/**
 * $.fn.extend 定义与调用
 */
$.fn.extend({fun2: function() {alert('执行方法2');}});
$(this).fun2();

//等同于
$.fn.fun3 = function() {alert('执行方法3');}
$(this).fun3();


/**
 * 插件通用模板（单个方法）
 * 1.把全部代码放在闭包（一个立即执行函数）里
 * 		a.避免全局依赖
 * 	·	b.避免第三方破坏
 * 		c.兼容jQuery操作符‘$’和‘jQuery’
 */
;(function($) {
	$.fn.yourName = function(options) {
		//各种属性、参数
		var options = $.extend(defaults, options);
		return this.each(function() {
			//插件实现代码
		});
	}
})(jQuery);


/**
 * 每个插件都应该包含一下部分
 */
;(function($) {
	$.fn.cyTitle = function(options) {
		//一些操作
		option = options || {};
		var domEl = this.get(0);	// 获得绑定元素的dom对象
		if(!domEl) throw "未找到绑定元素";
		if(domEl['cyTitle']) {	//这里如果调用元素的dom对象上有这个控件就直接返回 （避免了在同一个元素上多次调用出BUG）
			return domEl['cyTitle'];
		}
		options.el = domEl;	//这里在构建插件的时候直接用this.el就能访问元素的dom对象
		
		return new cyTitle(options);
	}
	
	function cyTitle(Options) {
		//这里定义插件属性
		$.extend(this,Options);
		this.ajaxType = 'get';
		this.el.cyTitle = this;	//吧控件放着dom元素的cyTitle属性上
		this.ondatabind = null;	//ajax取数的绑定方法
		
		this.init(Options);
	}
	
	cyTitle.prototype = {
		init: function() {
			//这里构建插件内容
			this.load();	//加载控件
		},
		load: function() {
			$(this.el).append("<h3>"+ (this.text || '未知') +"</h3>"); //如果指定了Options.text就显示指定的内容
			this.ref();	//调用ajax取数（类似于表格插件第一次加载）
		},
		ref: function() {
			this.bgCss();
			var e = {
				url: null
			};
			this.doEvt('ondatabind', e);	//这里调用前面定义的取数方法的内容（URL， params）
			//以此类推我们可以写绑定前（在绑定方法前面调用），绑定后（执行异步后调用）等等
			if(e.url) {
				var my = this;
				$[this.ajaxType](e.url, e.params, function(res) {
					if(res) {
						$(my.el).find('h3').text(res);
					}
				}, 'html');
			}
		},
		doEvt: function(name, p) {
			if(this[name]) {
				this[name](this, p);
			}
			return this;
		},
		bgCss: function() {
			$(this.el).css('background', this.background);
		}
	};
})(jQuery);


