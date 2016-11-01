/**
 * 定义每一个格子的对象
 */
(function(window,undefined) {
	var rowMax = 7;
	var colMax = 7;
	var defaultStatus = {
		x:0,
		y:0,
		width:45,
		height:45,
		row:0,//行
		col:0,//列
		img:null,//图片
		ctx:null//canvas context 引用
	};

	function extend(target) {
		var emptyArray = [], slice = emptyArray.slice;
		slice.call(arguments, 1).forEach(function(source) {
			for (var key in source) {
				target[key] = source[key];
			}
		});
		return target;
	} 
	
	function Cell(option) {
		this.isLock = false;//锁定，意味着需要更新，每一次timer都需要调用update。
		extend(this,defaultStatus,option);
		this.diffY = Math.ceil(this.height*(Cell.sh/Cell.sw - 1));//高度差
		this.y += this.diffY*this.row;//y轴的偏移
		this.dropHeight = 0;
	}
	Cell.sw = 90;//图片原始的宽度
	Cell.sh = 96;//图片原始的高度
	
	Cell.animalNum = 6;//默认有8种动物
	Cell.getRandom = function(except){
		var res = parseInt(Math.random()*Cell.animalNum,10);
		return res === except? (res+1)%Cell.animalNum: res;
	};
	Cell.prototype = {
		//初始化的时候，第一次显示
		show : function() {
			this.ctx.drawImage(Cell.imgArr[this.img[0]][this.img[1]],this.x,this.y,this.width,this.height+this.diffY);	
		},
		destroy : function() {
			this.ctx.clearRect(this.x,this.y,this.width,this.height+this.diffY);
		},
		//动画处理
		update : function() {
			if(this.isLock){//单元格锁定，做一些动画
				this.ctx.clearRect(this.x,this.y,this.width,this.height+this.diffY);
				if(this.dropHeight > 0){
					this.dropHeight -= this.dropDiffHeight;
					if(this.dropHeight <= 0){
						this.isLock = false;
						this.dropHeight = 0;
						this.ctx.drawImage(Cell.imgArr[this.img[0]][this.img[1]],this.x,this.y-this.dropHeight,this.width ,this.height+this.diffY);	
					}else{
						this.ctx.drawImage(Cell.imgArr[this.img[0]][this.img[1]],this.x,this.y-this.dropHeight,this.width ,this.height+this.diffY);	
					}
				}
				else if(this.scale){//缩小的动画
					this.scale += 4;
					if(this.scale < this.width/2){
						this.ctx.drawImage(Cell.imgArr[this.img[0]][this.img[1]],this.x + this.scale,this.y + this.scale,this.width - this.scale*2 ,this.height- this.scale*2+this.diffY);	
					}else{
						this.scale = 0;
						this.img = [Cell.getRandom(this.img[0]),1];
						this.magnify = parseInt(this.width/4,10);
					}
					
				}else if(this.shake){//抖动
					this.shake -=1;
					var shakeDiff = this.shake%2 === 0 ? -1 : 1;
					if(this.shake >0){
						this.ctx.drawImage(Cell.imgArr[this.img[0]][this.img[1]],this.x + shakeDiff,this.y+ shakeDiff,this.width,this.height+this.diffY);
					}else{
						this.shake = 0;
						this.animScale();
					}
				}else if(this.magnify){//放大
					this.magnify-=2;
					if(this.magnify < 0){
						this.magnify = 0;
					}
					this.ctx.drawImage(Cell.imgArr[this.img[0]][this.img[1]],this.x+this.magnify/2,this.y+this.magnify/2,this.width - this.magnify ,this.height- this.magnify+this.diffY);				
					if(this.magnify === 0){
						this.isLock = false;
					}
				}else if(this.mouse){//老鼠跑出一条线
					if(this.mouse.repeat <= 0){
						var next = Cell.prototype[this.mouse.direct].call(this);
						this.isLock = false;
						//this.setRedraw();
						if(next){
							next.animMouse(this.mouse.direct,this.mouse.callback);						
						}else{
							this.mouse.callback.call(this);
						}
						this.mouse = null;
					}else{
						var mouseImgTmp ;
						if(this.mouse.direct == 'bottom' ){
							mouseImgTmp	= Cell.mouseImgArr[this.mouse.step];
						}else{
							mouseImgTmp	= Cell.frogImgArr[this.mouse.step];
						}
						this.ctx.drawImage(mouseImgTmp,this.x,this.y,this.width,this.height+this.diffY);
						this.mouse.step++;
						if(this.mouse.step >= 3){
							this.mouse.repeat--;
							this.mouse.step = 0;
						}
					}
				}
			}else if(this.star){//火花
				if(this.star.count<=this.star.max){
					this.ctx.clearRect(this.x,this.y,this.width,this.height+this.diffY);
					this.ctx.drawImage(Cell.imgArr[this.img[0]][this.img[1]],this.x,this.y,this.width,this.height+this.diffY);
					this.ctx.drawImage(Cell.starsArr[this.star.count],this.x,this.y,this.width,this.height+this.diffY);
					this.star.count+=this.star.step;
				}else{
					this.ctx.drawImage(Cell.imgArr[this.img[0]][this.img[1]],this.x,this.y,this.width,this.height+this.diffY);
					if(this.star.callback){
						this.star.callback();
					}
					this.star = null;
				}
			}else if(this.boom){
				if(this.boom.count<=this.boom.max){
					this.ctx.clearRect(this.x,this.y,this.width,this.height+this.diffY);
					this.ctx.drawImage(Cell.imgArr[this.img[0]][this.img[1]],this.x,this.y,this.width,this.height+this.diffY);
					this.ctx.drawImage(Cell.boomArr[this.boom.count%2],this.x,this.y,this.width+this.boom.max-this.boom.count,this.height+this.diffY+this.boom.max-this.boom.count);
					this.boom.count+=this.boom.step;
				}else{
					this.ctx.drawImage(Cell.imgArr[this.img[0]][this.img[1]],this.x,this.y,this.width,this.height+this.diffY);
					if(this.boom.callback){
						this.boom.callback();
					}
					this.boom = null;
				}
			}else if(this.booming){
				if(this.booming.count<=this.booming.max){
					this.ctx.clearRect(this.x,this.y,this.width,this.height+this.diffY);
					if(this.booming.count>this.booming.startBoomed){
						this.ctx.drawImage(Cell.boomed,this.x,this.y,this.width,this.height+this.diffY);
					}else{
						this.ctx.drawImage(Cell.imgArr[this.img[0]][this.img[1]],this.x,this.y,this.width,this.height+this.diffY);
					}
					if(this.booming.count<=this.booming.boomingMax){
						this.ctx.drawImage(Cell.boomingArr[parseInt(this.booming.count,10)],this.x,this.y,this.width,this.height+this.diffY);
					}
					this.booming.count+=this.booming.step;
				}else{
					if(this.booming.callback){
						this.booming.callback();
					}
					this.booming = null;
				}
			}else if(this.bigboom){
				if(this.bigboom.count<=this.bigboom.max){
					this.ctx.clearRect(this.x,this.y,this.width,this.height+this.diffY);
					this.ctx.drawImage(Cell.bigboomArr[this.bigboom.count%2],this.x,this.y,this.width,this.height+this.diffY);
					this.bigboom.count+=this.bigboom.step;
				}else{
					if(this.bigboom.callback){
						this.bigboom.callback();
					}
					this.bigboom = null;
				}
			}else if(this.disappear){
				if(this.disappear.count<this.disappear.max){
					this.ctx.clearRect(this.x,this.y,this.width,this.height+this.diffY);
				//	this.ctx.drawImage(Cell.imgArr[this.img[0]][this.img[1]],this.x,this.y,this.width,this.height+this.diffY);
					this.ctx.drawImage(Cell.disappearArr[this.disappear.count],this.x,this.y,this.width,this.height+this.diffY);
					this.disappear.count+=this.disappear.step;
				}else{
					if(this.disappear.callback){
						this.disappear.callback();
					}
					this.disappear = null;
				}
			}else if (this.isRedraw){//重画
				this.ctx.clearRect(this.x,this.y,this.width,this.height+this.diffY);
				this.ctx.drawImage(Cell.imgArr[this.img[0]][this.img[1]],this.x,this.y,this.width,this.height+this.diffY);
				this.isRedraw = false;
			}
		},
		//重画
		setRedraw:function(){
			this.isRedraw = true;
		},
		//缩放动画
		animScale:function(){
			this.isLock = true;
			this.scale = 1;
		},
		//掉落动画
		animDrop:function(callback){
			this.isLock = true;
			//this.dropDiffHeight = parseInt(this.dropHeight/this.height,10);
			//this.dropDiffHeight = parseInt(this.dropDiffHeight * (this.height/5),10);
			this.dropDiffHeight = parseInt(this.height/4,10);
			this.dropCallBack = callback;
		},
		//老鼠跑动
		animMouse:function(direct,callback){
			this.isLock = true;
			this.mouse={
				direct:direct,
				repeat:1,
				callback:callback,
				step:0
			};
		},

		//火花
		animStar:function(callback){
			this.star = {
				count: 1,
				max: 15,
				step : 1,
				callback : callback
			}; 
		},


		animBoom:function(callback){
			this.boom = {
				count: 1,
				max: 15,
				step : 1,
				callback : callback
			}; 
		},


		animBooming:function(callback){
			this.booming = {
				count: 0,
				max: 9,
				boomingMax : 6,
				startBoomed :3,
				step : 0.5,
				callback : callback
			}; 
		},

		animBigboom:function(callback){
			this.bigboom = {
				count: 1,
				max: 15,
				step : 1,
				callback : callback
			}; 
		},

		animDisappear:function(callback){
			this.disappear = {
				count: 1,
				max: 11,
				step : 1,
				callback : callback
			}; 
		},

		//抖动
		animShake:function(){
			this.isLock = true;
			this.shake = 20;			
		},
		//设置状态
		setState:function(state){
			this.img[1] = state;
		},
		//获得状态
		getState:function(){
			return this.img[1];
		},	
		setImgIndex:function(index){
			this.img[0] = index;
		},	
		getImgIndex:function(){
			return this.img[0];
		},
		getLock:function(){
			return this.isLock;
		},
		//上面的单元
		top:function(){
			return this.row-1 >= 0 ? Cell.cells[this.row-1][this.col]: null;
		},
		bottom:function(){
			return this.row+1 < rowMax ? Cell.cells[this.row+1][this.col] : null;
		},
		left:function(){
			return this.col - 1 >= 0 ? Cell.cells[this.row][this.col - 1] : null;
		},
		
		right:function(){
			return this.col + 1 < colMax ? Cell.cells[this.row][this.col + 1] : null;
		}
	};
	window.Cell = Cell;
})(window);
