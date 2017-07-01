;(function() {
	var DEFAULT_FPS = 60;
	
	var vendors = ['webkit', 'moz', 'ms'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	};

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback) {
			return window.setTimeout(callback, 1000 / DEFAULT_FPS);
		};
	};
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	};

	/**
	 * 雪碧图动画效果
	 * @param {[type]} el     容器元素
	 * @param {[type]} option 配置选项
	 */
	var SAnim = function(el, option) {
		option = option || {};
		var $canvas = this.$canvas = $(el);
		if( $canvas.length <= 0 ) {
			console.error('canvas 元素不存在');
			return ;
		};

		var canvas = $canvas[0];

		// 需要设置canvas的width 和 height，否则这两个值默认为 300 和 150
		// https://html.spec.whatwg.org/multipage/canvas.html#attr-canvas-width
		this.canvasWidth = canvas.width;
		this.canvasHeight = canvas.height;

		this.ctx = canvas.getContext('2d');

		this.config = $.extend(true, {
			src: '',									// 图片地址
			xy: 'y', 									// 图片方向
			fps: 50,									// 帧数
			keyframes: 12, 						// 图片关键帧数
			repeat: 12, 							// 重复次数， 0 为无线循环
			padding: 0,								// 边距
			callback: function(t) { 	// 播放结束回调函数
				t.hideGift();
			} 					
		}, option || {});
	}

	/**
	 * 修改图片地址
	 * @param {[type]} src [description]
	 */
	SAnim.prototype.setSrc = function(src) {
		this.config.src = src;
		return this;
	};

	/**
	 * 隐藏画布
	 * @return {[type]} [description]
	 */
	SAnim.prototype.hideGift = function() {
		this.$canvas.fadeOut();
		return this;
	};

	/**
	 * 设置频率
	 * @param {[type]} fps [description]
	 */
	SAnim.prototype.setFps = function(fps) {
		this.config.fps = fps || DEFAULT_FPS;
		return this;
	};

	/**
	 * 绘制
	 * @return {[type]} [description]
	 */
	SAnim.prototype.drawImage = function() {
		var ctx = this.ctx;
		var img = this.img;
		var conf = this.config;
		this.curKeyFrame = this.curKeyFrame || 0;
		var curKeyFrame = this.curKeyFrame % conf.keyframes;

		ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		var x = 0, y = 0, w = this.canvasWidth, h = this.canvasHeight;

		var padding = String(conf.padding || '').split(/\s+/g);
		if( padding.length == 1 ) {
			x = y = padding[0];
			w = w - 2 * padding[0];
			h = h - 2 * padding[0];
		} else if( padding.length == 2 ) {
			x = padding[1];
			y = padding[0];
			w = w - 2 * padding[1];
			h = h - 2 * padding[0];
		} else if( padding.length == 3 ) {
			x = padding[1];
			y = padding[0];
			w = w - 2 * padding[1];
			h = h - padding[0] - padding[2];
		} else if( padding.length == 4 ) {
			x = padding[3];
			y = padding[0];
			w = w - padding[1] - padding[3];
			h = h - padding[0] - padding[2];
		}

		if( conf.xy == 'x' ) {
			ctx.drawImage(img, curKeyFrame * this.unitWidth, 0 , this.unitWidth, this.unitHeight, x, y, w, h);
		} else {
			ctx.drawImage(img, 0, curKeyFrame * this.unitHeight, this.unitWidth, this.unitHeight, x, y, w, h);
		}
		// 下一帧
		++ this.curKeyFrame;
	};

	/**
	 * 加载图片
	 * @return {[type]} [description]
	 */
	SAnim.prototype.loadImage = function() {
		var deferred = $.Deferred();
		var t = this;
		var img = this.img = new Image();
		var conf = t.config ;

		img.onload = function() {

			var imgWidth = t.imgWidth = this.width;
			var imgHeight = t.imgHeight = this.height;

			
			if( conf.xy == 'x' ) {
				// 计算帧数
				conf.keyframes = Math.round(imgWidth/imgHeight);

				t.unitWidth = imgWidth / conf.keyframes;
				t.unitHeight = imgHeight;
			} else {
				// 计算帧数
				conf.keyframes = Math.round(imgHeight/imgWidth);

				t.unitWidth = imgWidth;
				t.unitHeight = imgHeight / conf.keyframes;
			}

			deferred.resolve(this);
		};

		img.onerror = function(err) {
			deferred.reject(err);
		};
		img.src = conf.src;

		return deferred.promise();
	};

	/**
	 * [animate description]
	 * @return {[type]} [description]
	 */
	SAnim.prototype.animate = function() {
		var t = this;
		var conf = t.config;

		// 按照设置的帧率
		var fps, fpsInterval, startTime, now, then, elapsed;
		fpsInterval = 1000 / conf.fps;
		then = startTime = Date.now();


		t.ret = 0;

		t.loadImage().then(function(data) {
			t.$canvas.show();

			function drawFrame() {
				now = Date.now();
    		elapsed = now - then;

				if( elapsed > fpsInterval ) {
					then = now - (elapsed % fpsInterval);
					t.drawImage();	
				}

				// 播放结束
				if( conf.repeat > 0 && t.curKeyFrame > conf.repeat * conf.keyframes) {
					conf.callback && conf.callback(t);
					return;
				}
				t.ret = requestAnimationFrame(drawFrame);
			};

			t.ret = requestAnimationFrame(drawFrame);
		});
	};

	/**
	 * 取消动画
	 * @return {[type]} [description]
	 */
	SAnim.prototype.cancel = function() {
		this.ret && cancelAnimationFrame(this.ret);
	};

	window.SAnim = SAnim;
})();