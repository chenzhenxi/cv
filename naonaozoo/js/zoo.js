/**
 * 
 * 主文件
 * @author jiang xiaoming 
 * @author chen zhenxi
 */
(function(window){
	//道具数量 
	//@author jiang xiaoming
	//@editer chen zhenxi 暂时取消了点击触发道具删除了
/*	var rock = document.querySelector('#main .item .rock em'),
		magic = document.querySelector('#main .item .magic em'),
		sandy = document.querySelector('#main .item .sandy em'),
		mouse = document.querySelector('#main .item .mouse em'),
		clown = document.querySelector('#main .item .clown em');*/
	//静态私有变量
	//@author jiang xiaoming
	//@editer chen zhenxi  
	var anim = {},
		weibo = {//weibo的配置都在这里
			ranking : {//排行
				total :{//总排行
					id : 1//id
				}
			}
		},
		count = 7,//矩阵7*7
		state = 1,//状态
		events = [],//事件缓存
		linkCount = 3,//多少个连消
		traceMatrix = [],//寻路的时候用,点击每个方块后，查找周围方块
		deadMatrix = [],//记录是否死掉
		gameTimeDefault = 60000,//默认每局时间,毫秒
		increaseTime = 0,//增加的游戏时间
		gameTime = gameTimeDefault,//游戏时间
		score = 0,//游戏分数
		scoreMul = 100,//得分乘法因子
		fps = 0, //这里的fps是用于计算每帧的fps,而且不是设置游戏fps.显示fps功能已经注释掉了
		//道具配置
		gameplay = {
			config:{//配置
				/**rock:{//摇一摇
					time:5000,//时间
					limit:10000//最多获得次数,10000表示无次数限制
				},
				magic:{//魔棒
					combo:3,//条件，连续消除3次
					limit:3//最多获得次数
				},
				sandy:{//沙漏
					combo:10,//条件，连续消除10次
					limit:1,//最多获得次数
					increase:30000//增加游戏时间30秒
				},
				mouse:{//老鼠
					time:20000,//20秒内，某一格一直没有消除
					limit:2//最多获得次数
				},
				clown:{//小丑
					score:20000,//超过的分数
					limit:1,//次数
					increase:10000//增加积分
				},**/
				randomFresh:{//5秒随机刷新二个格子,具体功能已经注视掉了
					time:5000//毫秒数,可以配置
				},
				deadDetect:{//每一秒检查是不是有至少一个格子可以消除,不能则会刷新2个格子
					time:1000//一秒
				}

				,crab:{	//螃蟹
					img : 3,//对应图片
					bouns: 900,//触发后的奖励
					combo: 8, //触发次数
					count: document.getElementById('crab_count'),//这里是更新数量的地方,下同
					text: '一次炸9个呢，</br>快点使用吧!'
				},
				frog:{	//青蛙
					img : 4,//对应图片
					bouns: 1200,//触发后的奖励
					combo: 11, //触发次数11
					count: document.getElementById('frog_count'),
					text: '吃一竖排呢，</br>快点使用吧!'
				},
				elephant:{	//大象
					img : 1,//对应图片
					bouns: 1200,//触发后的奖励
					combo: 11, //触发次数11
					count: document.getElementById('elephant_count'),
					text: '吃一横排呢，</br>快点使用吧!'
				},
				chick:{	//小鸡
					img : 5,//对应图片
					bouns: 1500,//触发后的奖励
					combo: 14, //触发次数
					count: document.getElementById('chick_count'),
					increase : 10000,
					text: '叽叽叽叽叽，</br>增加时间咯!'
				},
				bat:{	//蝙蝠
					img : 0,//对应图片
					bouns: 1500,//触发后的奖励
					combo: 14, //触发次数
					count: document.getElementById('bat_count'),
					text: '点谁谁就88，</br>快点使用吧!'
				},
				fox:{	//狐狸
					img : 2,//对应图片
					bouns: 3000,//触发后的奖励
					combo: 24, //触发次数
					count: document.getElementById('fox_count'),
					text: '神了炸好多，</br>快点使用吧!'
				},
				pig:{	//猪,囧脸
					img : 6,//对应图片
					format : [//囧脸是由一个7*7的数组组成,6,1是猪的图片
					[[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1]],
					[[6,1],     ,[6,1],     ,[6,1],     ,[6,1]],
					[[6,1],[6,1],     ,     ,     ,[6,1],[6,1]],
					[[6,1],     ,     ,     ,     ,     ,[6,1]],
					[[6,1],     ,[6,1],[6,1],[6,1],     ,[6,1]],
					[[6,1],     ,[6,1],     ,[6,1],     ,[6,1]],
					[[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1]]
					],
					bouns: 3600,//触发后的奖励
					combo: 35, //触发次数
					count: document.getElementById('pig_count'),
					text: '囧死你啊啊，</br>囧啊囧啊!'
				},
				panda:{	//熊猫
					img : 7,//对应图片
					bouns: 4500,//触发后的奖励
					combo: 44, //触发次数
					count: document.getElementById('panda_count'),
					text: '全屏清除，</br>还加分!'
				}
			},
			//下面放的游戏运行时会改变的数据
			run:(function(){//这样这里设定一次，下次执行restore方法即可恢复初试数据
				var res = {};
				var def = {
					crab:{	//螃蟹
						count : 0,//有多少道具
						clear : 0 //清除了几个
					},
					frog:{	//青蛙
						count : 0,//有多少道具
						clear : 0 //清除了几个
					},
					elephant:{	//大象
						count : 0,//有多少道具
						clear : 0 //清除了几个
					},
					chick:{	//小鸡
						count : 0,//有多少道具
						clear : 0 //清除了几个
					},
					bat:{	//蝙蝠
						count : 0,//有多少道具
						clear : 0 //清除了几个
					},
					fox:{	//狐狸
						run : 0,//如何跑
						count : 0,//有多少道具
						clear : 0 //清除了几个
					},
					pig:{	//猪
						count : 0,//有多少道具
						clear : 0 //清除了几个
					},
					panda:{	//熊猫
						count : 0,//有多少道具
						clear : 0 //清除了几个
					},
					randomFresh:{
						time:0//记录时间
					},
					deadDetect:{
						time:0//记录时间
					},
					toolAlerting:0,//提醒工具中
					toolsEvent:[],//道具缓存
					toolsWarning:[],//道具警告缓存
					toolsEventIndex:0,//道具游标,
					toolsEventLock:false,//事件锁
					dropLock:false,//事件锁
					toolsEventAutoUnlock : null
				}
				res.reStore = function(){
					for(var k in def){
						res[k] = JSON.parse(JSON.stringify(def[k]));
					}
					return res;
				};
				return res.reStore();
			})()
			/**{//运行时的一些数据记录
				/**rock:{//摇一摇
					time:0,
					limit:0,
					count:0//获得数
				},
				magic:{//魔棒
					combo:0,//条件，连续消除3次到达条件
					limit:0,
					useing:false,
					count:0//获得数
				},
				sandy:{//沙漏
					combo:0,//条件，连续消除10次，到达条件
					limit:0,
					count:0//获得数
				},
				mouse:{//老鼠
					matrix:[],
					cells:[],
					limit:0,
					time:0
				},
				clown:{//小丑
					score:0,//超过的分数
					limit:0,
					count:0//获得数
				},
				randomFresh:{
					time:0
				},
				deadDetect:{
					time:0
				}
			}**/
		},
		loadingCtl,//加载框
		noAnim = true,//当前是否没有动画的执行
		progressBar,//进度条外框
		//ctlPanel,//暂停后弹出来的控制面板
		//remainEm,//进度条里面剩下的时间
		pauseBtn,//暂停按钮
		timer,//时间框
		scoreBar,//分数条
		messageBox,//道具信息框
		divscreen = {
			dom : null,
			height : 381,
			uping : null,
			downing : null
		},//幕布
		divHelp,//帮助
		canvas,
		ctx,
		clickStop =false,
		cellSize;//每一个单元格的宽高
	//重置traceMatrix
	function resetMatrix(matrix) {
		for (var i = 0; i < count; i++) {
			matrix[i] = [];
			for (var j = 0; j < count; j++) {
				matrix[i][j] = 0;
			}
		}
	}
	//获得鼠标相对canvas的位置	
	function getRelativePos(e) {
		var pageX = e.pageX;
		var pageY = e.pageY;
		if (e.type === "touchstart" || e.type === "touchend") {
			pageX = e.touches[0].pageX;
			pageY = e.touches[0].pageY;
		}
		var target = e.target;
		var offsetTop = target.offsetTop;
		var offsetLeft = target.offsetLeft;
		while (target = target.offsetParent) {
			offsetTop += target.offsetTop;
			offsetLeft += target.offsetLeft;
		}
		return {
			x:pageX - offsetLeft,
			y:pageY - offsetTop
		};
	}
	//得到点击的单元格
	function getTouchCell(pos){
		return Cell.cells[Math.floor(pos.y/(cellSize+Cell.cells[0][0].diffY))][Math.floor(pos.x/cellSize)];
	}
	//获得anim函数
	function getAnimateFunction (speed) {
		speed = speed || 60;
		return window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
			window.setTimeout(callback, 1000 / speed);
		};
	}
	//判断当前是否有锁定的单元格
	function hasLocked(){
		var row = Cell.cells.length;
		for(var i=0; i<row; i++){
			var col = Cell.cells[i].length;
			for(var j=0; j<col; j++){
				if(Cell.cells[i][j].getLock()){
					return true;
				}
			}
		}
		return false;
	
	}
	//获得相连的cell
	function getChainCell(cell, except) {// except含义：0 表示排除上一步的，1表示右，2表示下，3表示左
		var res = [], row, col, nextCell;
		res.push(cell);
		traceMatrix[cell.row][cell.col] = 1;
		if (cell.row + 1 < count && except !== 2) {// 下移一步
			row = cell.row + 1;
			col = cell.col;
			nextCell = Cell.cells[row][col];
			if (!nextCell.getLock() && nextCell.getImgIndex() === cell.getImgIndex() && traceMatrix[row][col] === 0) {// 没有lock，而且同花，之前没有入堆栈
				res = res.concat(getChainCell(nextCell, 0));// 排除上一步的
			}
		}
		if (cell.col + 1 < count && except !== 1) {// 右移一步
			row = cell.row;
			col = cell.col + 1;
			nextCell = Cell.cells[row][col];
			if (!nextCell.getLock() && nextCell.getImgIndex() === cell.getImgIndex() && traceMatrix[row][col] === 0) {// 没有lock，而且同花
				res = res.concat(getChainCell(nextCell, 3));//排除左
			}
		}
		if (cell.row - 1 >= 0 && except !== 0) {// 上移一步
			row = cell.row - 1;
			col = cell.col;
			nextCell = Cell.cells[row][col];
			if (!nextCell.getLock() && nextCell.getImgIndex() === cell.getImgIndex() && traceMatrix[row][col] === 0) {// 没有lock，而且同花
				res = res.concat(getChainCell(nextCell, 2));// 排除下
			}
		}

		if (cell.col - 1 >= 0 && except !== 3) {// 左移一步
			row = cell.row;
			col = cell.col - 1;
			nextCell = Cell.cells[row][col];
			if (!nextCell.getLock() && nextCell.getImgIndex() === cell.getImgIndex() && traceMatrix[row][col] === 0) {// 没有lock，而且同花
				res = res.concat(getChainCell(nextCell, 1));// 排除右
			}
		}
		return res;
	}
	//是否死了，没的可玩了
	function isDead(){
		resetMatrix(deadMatrix);
		var row = Cell.cells.length,tempChain;
		for(var i=0; i<row; i++){
			var col = Cell.cells[i].length;
			for(var j=0; j<col; j++){
				resetMatrix(traceMatrix);
				tempChain = getChainCell(Cell.cells[i][j]);
				deadMatrix[i][j] =  tempChain.length;
				if(deadMatrix[i][j] > 2){
					return false;
				}
			}
		}
		return true;
	}
	//死了，洗牌
	//chainNum要生成的chain数据的数目,默认是2
	function change(chainNum){
		var row,col,pc,top,left,right,bottom,tempCell;
		chainNum = chainNum || 2;
		for(var i = 0; i<chainNum; i++){
			pc = 0;
			row = parseInt(Math.random()*count,10);
			col = parseInt(Math.random()*count,10);
			tempCell = Cell.cells[row][col];
			top = tempCell.top();
			left = tempCell.left();
			right = tempCell.right();
			bottom = tempCell.bottom();
			if(pc < 2 && top){
				 top.img[0] = tempCell.img[0];
				 top.img[1] = tempCell.img[1];
				 top.setRedraw();
				 pc++;
			}
			if(pc < 2 && right){
				 right.img[0] = tempCell.img[0];
				 right.img[1] = tempCell.img[1];
				 right.setRedraw();
				 pc++;
			}
			if(pc < 2 && bottom){
				 bottom.img[0] = tempCell.img[0];
				 bottom.img[1] = tempCell.img[1];
				 bottom.setRedraw();
				 pc++;
			}
			if(pc < 2 && left){
				 left.img[0] = tempCell.img[0];
				 left.img[1] = tempCell.img[1];
				 left.setRedraw();
				 pc++;
			}
		}
	}
	//更新进度条
	function updateProgress(gameTime){
	//function updateProgress(percent){
		var num1 = parseInt(gameTime/10000);
		var num2 = parseInt(gameTime/1000%10);
		if(num1==0&&num2%2==1){
			progressBar[0].className = 'time_bg time_num_'+num1+'_red';
			progressBar[1].className = 'time_bg time_num_'+num2+'_red';
		}else{
			progressBar[0].className = 'time_bg time_num_'+num1;
			progressBar[1].className = 'time_bg time_num_'+num2;
		}


		// percent = parseInt(percent,10);
		// percent = percent >100 ? 100: percent;
		// progressBar.style.width = percent + '%';
	}

	//道具使用警报
	function warningForTool(tool){
		if(!tool){
			if(gameplay.run.toolsEventIndex<gameplay.run.toolsWarning.length){
				document.getElementById('div_messagebox').style.display = 'block';
				document.getElementById('control_panel').style.opacity =  '0.3';
				if(gameplay.run.toolAlerting==1){
					return;
				}
				gameplay.run.toolsWarning[gameplay.run.toolsEventIndex]();
			}
			return;
		}
		gameplay.run.toolsWarning.push(function(){
			document.getElementById('messagebox_tool').style.background = "url('img/item/"+tool.img+".png') no-repeat";
			document.getElementById('messagebox_tool').style.backgroundSize = '45px 51px';
			document.getElementById('messagebox_tool_text').innerHTML = tool.text;
		});
		warningForTool();
	}

	//使用道具
	function alertForTool(tool){
		document.getElementById('control_panel').style.opacity =  '0.3';
		document.getElementById('messagebox_tool').style.background = "url('img/item/"+tool.img+".png') no-repeat"; 
		document.getElementById('messagebox_tool').style.backgroundSize = "45px 51px"; 
		document.getElementById('messagebox_tool_text').innerHTML = tool.text;
		document.getElementById('div_messagebox').style.display = 'block';
		document.getElementById('control_panel').style.opacity =  '0.3';
		gameplay.run.toolAlerting = 1;
		setTimeout(function(){
			document.getElementById('div_messagebox').style.display = 'none';
			document.getElementById('control_panel').style.opacity =  '1';
			gameplay.run.toolAlerting =0;
			warningForTool();
		},1000);
		warningForTool();
}


	//保存上次分数不每次刷新
	var oldScore = -1;
	//更新分数
	function updateScore(score){
		if(oldScore == score){
			return;
		}
		oldScore = score;
		var prefix = "<span class='score_bg score_num_"
		var sufix = "'></span>";
		if(score <= 0){
			scoreBar.innerHTML = prefix+0+sufix;
			return;
		}
		var html = prefix+parseInt(score%10)+sufix;
		var i = 10;
		var num = parseInt(score/i);
		while(num){
			html =   prefix+num%10+sufix+html;
			i=i*10;
			num = parseInt(score/i);
		}
		scoreBar.innerHTML = html;
	}

	var downScreen;
	var upScreen;
	//暂停以后弹出菜单
	function openCtl (pause){
		if(pause){
			document.getElementById('screen_resume_diffheight_div').style.display = 'block';	
			document.getElementById('resume').style.display = 'block';
			document.getElementById('screen_prize_span').style.display = 'none';
		}else{
			document.getElementById('screen_resume_diffheight_div').style.display = 'none';	
			document.getElementById('resume').style.display = 'none';
			document.getElementById('screen_prize_span').style.display = 'block';
			document.getElementById('final_score_div').innerHTML = document.getElementById('span_score').innerHTML;
			
		}
		downScreen();
		//ctlPanel.style.display = 'block';
	}
	//关闭控制菜单
	function closeCtl(){
		upScreen();
		//ctlPanel.style.display = 'none';
	}
	//退出
	function exit(){

		pauseBtn.style.display = 'none';
		timer.style.display = 'none';
		document.querySelector('header').style.display = 'none';
		document.getElementById('div_messagebox').style.display = 'none';
		document.getElementById('control_panel').style.opacity = '1';
		document.getElementById('main').style.display = 'none';
		document.querySelector('.entrance').style.display = 'block';;
		document.getElementById('div_screen').style.display = 'none';
	}
	//进入游戏
	function enter(){
		document.querySelector('header').style.display = 'block';
		document.getElementById('main').style.display = 'block';
		document.querySelector('.entrance').style.display = 'none';
	}
	//获取老鼠移动方向的
	function getMouseCell(){
		var tempArr = [],
			result = null;
		for (var i = 0; i < count; i++) {
			for (var j = 0; j < count; j++) {
				if(gameplay.run.mouse.matrix[i][j] === 0){
					tempArr.push({row:i,col:j});
				}
			}
		}
		if(tempArr.length > 0){
			result = tempArr[Math.floor(Math.random()*tempArr.length)];
		}
		//计算老鼠滚动方向
		if(result){
			var left = result.col,
				top = result.row,
				right = count - result.col - 1,
				bottom = count - result.row - 1,
				arr = [],
				max;
				max = Math.max(left,right,bottom,top);
				arr[left] = 'left';
				arr[top] = 'top';
				arr[right] = 'right';
				arr[bottom] = 'bottom';
				result.direct = arr[max];
				result.num = max + 1;//可以消除的格子数
		}
		return result;
	}

	function getPageSize(){
		var xScroll, yScroll, pageHeight, pageWidth, arrayPageSize,windowWidth, windowHeight;
		if (window.innerHeight && window.scrollMaxY) {
			xScroll = document.body.scrollWidth;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}
		if (self.innerHeight) { // all except Explorer
			windowWidth = self.innerWidth;
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) { // other Explorers
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}

		if (yScroll < windowHeight) {
			pageHeight = windowHeight;
		} else {
			pageHeight = yScroll;
		}
		if (xScroll < windowWidth) {
			pageWidth = windowWidth;
		} else {
			pageWidth = xScroll;
		}
		arrayPageSize = [pageWidth, pageHeight, windowWidth, windowHeight];
		return arrayPageSize;

	}
	/*
	 * 页面各个元素的初始化
	 * */
	function initDomAndAnim(skin){
		//设置canvas大小
	 	var initSize = getPageSize(),min,max;
		ctx = canvas.getContext('2d');
	 	
	 	min = Math.min(initSize[0],initSize[1]);
	 	max = Math.max(initSize[0],initSize[1]);

	 	min = 320;//min > 480 ? 480: min*0.9;
	 	
	 	//计算单元格宽高
	 	cellSize = 45;//parseInt(min/count,10);
	 	
	 	//canvas信息
	 	canvas.width = cellSize*count;
	 	canvas.height = canvas.width+(cellSize*(Cell.sh/Cell.sw - 1))*count;

			var hidefCanvasWidth = canvas.width ;
			var hidefCanvasHeight = canvas.height;
			var hidefCanvasCssWidth = hidefCanvasWidth;
			var hidefCanvasCssHeight = hidefCanvasHeight;

			canvas.width =  hidefCanvasWidth * window.devicePixelRatio;
			canvas.height=  hidefCanvasHeight * window.devicePixelRatio;
			canvas.style.width = hidefCanvasCssWidth +'px';
			canvas.style.height = hidefCanvasCssHeight +'px';

			ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

	 	var diffHeight = initSize[1] - canvas.height;
	 	//diffHeight = diffHeight > 40 ? (30 + (diffHeight-40)/2) : 40;
	 	diffHeight = 57;
	 	canvas.style.marginTop = diffHeight+"px";
	 	
	 	//上面进度信息
	 	var header =  document.querySelector('header');
	 	header.style.height = (diffHeight)+"px";
	 	header.style.visibility = 'visible';
	 	
	 	//设置进度条
	 	progressBar =  document.querySelectorAll('.time_bg');
	 	// progressBar =  document.querySelector('.progress-bar');
	 	// progressBar.style.right = ((initSize[0]-min)/2 + 4)+'px';
	 	// progressBar.style.width = (min-5)+'px';
	 	// progressBar.style.visibility = 'visible';
	 	// remainEm = progressBar.querySelector('em');
	 	// progressBar = progressBar.querySelector('span');
	 	
	 	//暂停按钮
	 	// btn.style.left = (initSize[0]-min)/2+'px';
	 	// btn.style.visibility = 'visible';
	 	scoreBar = document.getElementById('span_score');
	 	//scoreBar = document.querySelector('.score');
	 	// scoreBar.style.right = (initSize[0]-min+8)/2+'px';
	 	// scoreBar.style.visibility = 'visible';

	 	//底部消息框位置设定与载入，messageBox
		messageBox = document.getElementById('div_messagebox');
		messageBox.style.left = document.getElementById('span_messagebox').offsetLeft + 'px';
		messageBox.style.top = (document.getElementById('span_messagebox').offsetTop -4)  + 'px';

		//幕布 divscreen
		divscreen.dom = document.getElementById('div_screen');
		divscreen.dom.style.left = document.getElementById('control_panel').offsetLeft + 'px';
		divscreen.dom.style.top = (diffHeight - divscreen.height )+'px';
		divscreen.dom.style.display = 'block';

		downScreen = (function(divscreen,diffHeight,window){
			return function(){
				divscreen.dom.style.top = '0px';
			};
		})(divscreen,diffHeight,window);


		upScreen = (function(divscreen,diffHeight,window){
			return function(){
				divscreen.dom.style.top = diffHeight +'px';
			};
		})(divscreen,diffHeight - divscreen.height,window);


	 	//重新开始游戏，返回游戏，退出的控制面板
	 	// ctlPanel = document.querySelector('.ctl-panel');
	 	// ctlPanel.style.cssText = "top:"+(canvas.offsetTop)+"px;left:"+(canvas.offsetLeft+70)+"px;";
		//加载器
	 	if(!loadingCtl){
	 		loadingCtl = new CanvasLoader('main');
			loadingCtl.setColor('#59aceb'); // default is '#000000'
			loadingCtl.setShape('spiral'); // default is 'oval'
			loadingCtl.setDiameter(83); // default is 40
			loadingCtl.setDensity(29); // default is 40
			loadingCtl.setFPS(27); // default is 24
			var loaderObj = document.getElementById("canvasLoader");
	  		loaderObj.style.position = "absolute";
	  		loaderObj.style.top = ((diffHeight)+canvas.height/4-30) + "px";
	  		loaderObj.style.left = ((initSize[0]-min)/2+canvas.width/4-30) + "px";
	 	}
	 	loadingCtl.show(); // Hidden by default


	 	//暂停按钮
		pauseBtn.style.top = document.getElementById('control_panel').offsetTop + 31 +'px';
		pauseBtn.style.left = document.getElementById('control_panel').offsetLeft + 28+'px';
		pauseBtn.style.display = 'block';


		timer.style.top = document.getElementById('control_panel').offsetTop + 31 +'px';
		timer.style.left = document.getElementById('control_panel').offsetLeft +251+'px';
		timer.style.display = 'block';


	 	anim.init({
	 		skin:skin
	 	});
	}
	/**
	*处理掉落动画
	*处理一列的时候必须从上往下处理
	*/
	function dropAnimProcess(cells,callback){
		dropLock = true;
		cells.sort(function(A,B){
			return A.col - B.col;
		});
		cells.sort(function(A,B){
			return A.row - B.row;
		});
		for (var i=0;i<cells.length;i++) {
			processOnce(cells[i]);
		};

		function processOnce(cell){
			var top = cell.top();
			while(top){
				cell.img[0] = top.img[0];
				cell.img[1] = top.img[1];
				cell.dropHeight += cell.height;
				cell.animDrop();
				
				cell        = top;
				top         = cell.top();
			}
			cell.dropHeight += cell.height;
			cell.setImgIndex(Cell.getRandom()); 
			cell.animDrop();
		}
		setTimeout(function(){
			gameplay.run.dropLock = false;
		},1000)
	}

	/**处理星火**/
	function starsAnim(cells,callback1,callback2){
		for (var i = 0; i < cells.length - 1; i++) {
			cells[i].animStar();
		};
		if(callback1){
			cells[cells.length - 1].animStar(callback1);
		}else{
			cells[cells.length - 1].animStar((function(callback2){
				return function(){
					setTimeout(function(){
						dropAnimProcess(cells);
						callback2();
					},100);
				};
			})(callback2));
		}
	}

		/**处理boom**/
	function boomAnim(cell,callback1,callback2){
		if(callback1){
			cell.animBoom(callback1);
		}else{
			cell.animBoom((function(callback2){
				return function(){
					setTimeout(function(){
						dropAnimProcess(cells);
						callback2();
					},100);
				};
			})(callback2));
		}
	}

		/**处理booming**/
	function boomingAnim(cells,callback1,callback2){
		for (var i = 0; i < cells.length - 1; i++) {
			cells[i].animBooming();
		};
		if(callback1){
			cells[cells.length - 1].animBooming(callback1);
		}else{
			cells[cells.length - 1].animBooming((function(callback2){
				return function(){
					setTimeout(function(){
						dropAnimProcess(cells);
						callback2();
					},100);
				};
			})(callback2));
		}
	}

		/**处理boom**/
	function bigboomAnim(cells,callback1,callback2){
		for (var i = 0; i < cells.length - 1; i++) {
			cells[i].animBigboom();
		};
		if(callback1){
			cells[cells.length - 1].animBigboom(callback1);
		}else{
			cells[cells.length - 1].animBigboom((function(callback2){
				return function(){
					setTimeout(function(){
						dropAnimProcess(cells);
						callback2();
					},100);
				};
			})(callback2));
		}
	}

	anim.init = function(opts){
		var loader = new PxLoader();//定义一个图片加载器
		Cell.imgArr = [];//存储加载好的图片，图片是一个二维数据，第一维度定义动物类型，第二维度定义动物状态
		Cell.cells = []; //储存单元格动物对象
		//加载多有图片资源todo合并图片
		for(var i=0; i<Cell.animalNum; i++){
			Cell.imgArr[i] = [];
			for(var j=1; j<=state; j++){
				Cell.imgArr[i][j] = loader.addImage('img/'+opts.skin+'/'+i+j+'.png');				
			}
		}
		Cell.mouseImgArr = [];
		Cell.mouseImgArr[0] = loader.addImage('img/mouse1.png');
		Cell.mouseImgArr[1] = loader.addImage('img/mouse2.png');
		Cell.mouseImgArr[2] = loader.addImage('img/mouse3.png');
		Cell.mouseImgArr[3] = loader.addImage('img/mouse4.png');
		Cell.mouseImgArr[4] = loader.addImage('img/mouse5.png');
		Cell.mouseImgArr[5] = loader.addImage('img/mouse6.png');
		Cell.mouseImgArr[6] = loader.addImage('img/mouse7.png');
		Cell.mouseImgArr[7] = loader.addImage('img/mouse8.png');
		Cell.starsArr = [];
		for(var i=1;i<16;i++){
			Cell.starsArr[i] = loader.addImage('img/stars/'+i+'.png');
		}
		Cell.boomArr = [
			 loader.addImage('img/boom/boom0.png'),
			 loader.addImage('img/boom/boom1.png')
		];

		Cell.boomingArr = [];
		for(var i=0;i<7;i++){
			Cell.boomingArr[i] = loader.addImage('img/boom/booming'+i+'.png');
		}

		Cell.boomed = loader.addImage('img/boom/boomed.png');

		Cell.bigboomArr = [
			 loader.addImage('img/boom/bigboom0.png'),
			 loader.addImage('img/boom/bigboom1.png')
		];

		Cell.disappearArr = [];
		for(var i=0;i<11;i++){
			Cell.disappearArr[i] = loader.addImage('img/disappear/'+i+'.png');
		}

		Cell.frogImgArr = [];
		Cell.frogImgArr[0] = loader.addImage('img/mouse1.png');
		Cell.frogImgArr[1] = loader.addImage('img/mouse2.png');
		Cell.frogImgArr[2] = loader.addImage('img/mouse3.png');
		Cell.frogImgArr[3] = loader.addImage('img/mouse4.png');
		Cell.frogImgArr[4] = loader.addImage('img/mouse5.png');
		Cell.frogImgArr[5] = loader.addImage('img/mouse6.png');
		Cell.frogImgArr[6] = loader.addImage('img/mouse7.png');
		Cell.frogImgArr[7] = loader.addImage('img/mouse8.png');

		//图片加载完毕后
		loader.addCompletionListener(function() { 
			console.log(cellSize);
			loadingCtl.hide();
			for(var i =0; i<count; i++){
				Cell.cells[i] = [];
				for(var j=0; j<count; j++){
					Cell.cells[i][j] =  new Cell({
						img:[Cell.getRandom(),1],
						ctx:ctx,
						height:cellSize,
						width:cellSize,
						x:j*cellSize,
						y:i*cellSize,
						row:i,
						col:j
					});
					Cell.cells[i][j].show();//显示动物
				}
			}
			anim.reStart();
		}); 
		loader.start();//加载器开始执行图片下载
	};
	anim.stop = function(){
		document.getElementById('div_messagebox').style.display = 'none';
		document.getElementById('control_panel').style.opacity =  '1';
		this.stoped = true;
	};
	anim.pause = function(){
		document.getElementById('div_messagebox').style.display = 'none';
		document.getElementById('control_panel').style.opacity =  '1';
		this.paused = true;
	};
	anim.resume = function(){
		warningForTool();
		this.paused = false;
	};
	//随机刷新 2个格子
	anim.refresh = function(){
		var changeNum = 2,row,col,tempCell;
		for(var i = 0; i<changeNum; i++){
			row = parseInt(Math.random()*count,10);
			col = parseInt(Math.random()*count,10);
			tempCell = Cell.cells[row][col];
			if(!tempCell.getLock()){
				tempCell.setImgIndex(Cell.getRandom()); 
				tempCell.setRedraw();
			}
		}
	};
	//整体刷新
	anim.refreshAll = function() {
		var row = Cell.cells.length;
		for (var i = 0; i < row; i++) {
			var col = Cell.cells[i].length;
			for (var j = 0; j < col; j++) {
				Cell.cells[i][j].setImgIndex(Cell.getRandom());
				Cell.cells[i][j].setRedraw();
			}
		}
	};
	//消除相同颜色色块
	anim.clearSameColor = function(cell){
		var len = 0;
		var row = Cell.cells.length;
		var tempCells = [];
		for (var i = 0; i < row; i++) {
			var col = Cell.cells[i].length;
			for (var j = 0; j < col; j++) {
				if(Cell.cells[i][j].getImgIndex() === cell.getImgIndex()){
					if(!Cell.cells[i][j].getLock()){
						//Cell.cells[i][j].animScale();
						tempCells.push(Cell.cells[i][j]);
					}
					len++;
				}
			}
		}
		starsAnim(tempCells,null,function(){
			setTimeout(function(){
				gameplay.run.toolsEventLock = false;	
			},400);
		});
		//dropAnimProcess();
		score += scoreMul*len;
	};
	//消除所有色块
	anim.clearAll = function(){
		var row = Cell.cells.length;
		//var tempCells = [];
		for (var i = 0; i < row; i++) {
			var col = Cell.cells[i].length;
			for (var j = 0; j < col; j++) {
				if(!Cell.cells[i][j].getLock()){
					//tempCells.push(Cell.cells[i][j]);
					Cell.cells[i][j].animScale();
				}
			}
		}
		//dropAnimProcess(tempCells);
		//score += gameplay.config.clown.increase;
	};
	//重新开始动画
	anim.reStart = function(){
		document.getElementById('div_messagebox').style.display = 'none';
		document.getElementById('control_panel').style.opacity = '1';
		this.paused = false;
		anim.stop();
		(function(){
			var calleeFunc = arguments.callee;
			window.setTimeout(function(){
				if(noAnim){
					anim.start();
				}else{
					calleeFunc.call(anim);
				}
			},100);			
		})();
	};
	//开始动画
	anim.start = function() {
		/**
		 *重置所有的数据 
		 */
		/*rock.innerHTML = 0;
		magic.innerHTML = 0;
		sandy.innerHTML = 0;
		mouse.innerHTML = 0;
		clown.innerHTML = 0;*/
		events = [];//清除掉事件
		noAnim = false;
		this.stoped = false;
		this.paused = false;
		updateProgress(gameTime);
		//updateProgress(100);
		updateScore(0);
		//scoreBar.innerHTML = '0';
		score = 0;
		//doubleHit = 0;
		/*
		gameplay.run = {//数据结构
				rock:{//摇一摇
					time:0,
					limit:0,
					count:0//获得数
				},
				magic:{//魔棒
					combo:0,//条件，连续消除3次到达条件
					useing:false,
					limit:0,
					count:0//获得数
				},
				sandy:{//沙漏
					combo:0,//条件，连续消除10次，到达条件
					limit:0,
					count:0//获得数
				},
				mouse:{//老鼠
					matrix:[],
					cells:[],
					limit:0,
					time:0
				},
				clown:{//小丑
					score:0,//超过的分数
					limit:0,
					count:0//获得数
				},
				randomFresh:{
					time:0
				},
				deadDetect:{
					time:0
				}
		};*/
		gameplay.run.reStore();//重新赋值初试数据
		/*
		resetMatrix(gameplay.run.mouse.matrix);
		*/
		gameTime = gameTimeDefault;
		increaseTime = 0;//这一局增加的游戏时间
		
		//动画开始
		var requestAnimationFrame = getAnimateFunction();
		var start = Date.now(),i,diffTime;
		//定时执行动画
		requestAnimationFrame(function(time) {
			var time = Date.now();
			if(anim.stoped && !hasLocked()){
				noAnim = true;
				return;
			}
			diffTime = time - start;
			if(diffTime >= 32){//控制fps在30帧
				fps++;
				if(!anim.paused ){//如果没有暂停
					/**
					 *更新时间
					 */
					if(!gameplay.run.toolsEventLock&&!gameplay.run.dropLock){
						gameTime-=diffTime;
					}
					if(gameTime <= 0){
						gameTime = 0;
						anim.stop();
						window.setTimeout(function(){
							openCtl();
							sendRank(weibo.ranking.total.id,score);
							// try{
							// 	if(!localStorage['ranking']||! JSON.parse(localStorage['ranking']).length){
							// 		localStorage['ranking'] = JSON.stringify(new Array());
							// 	}
							// }catch(e){
							// 	localStorage['ranking'] = JSON.stringify(new Array());
							// }
							// var ranking = JSON.parse(localStorage['ranking']);
							// if(ranking.length<10 ||score > ranking[ranking.length-1].score){
							// 	var name=prompt("大师,您已经成功进入排行榜!敢问大师名号:","");
							// 	name = name == null || name.length<1 ? '神秘大师' : name;
							// 	ranking.push({
							// 		name:name,
							// 		score:score
							// 	});
							// 	ranking.sort(function(a,b){
							// 		return b.score-a.score;
							// 	});
							// 	while(ranking.length>10){//delete last one when length>10
							// 		ranking.pop();
							// 	}
							// 	localStorage['ranking'] = JSON.stringify(ranking);
							// }

						},1500);
						updateProgress(gameTime);//更新进度条
						//updateProgress(gameTime/((gameTimeDefault+increaseTime)/100));//更新进度条
						//remainEm.innerHTML = parseInt(gameTime/1000,10);//更新剩余时间
					}
					//end
	
					/**
					 * 五秒随机刷新
					 * */
					gameplay.run.randomFresh.time +=diffTime;
					if(gameplay.run.randomFresh.time >= gameplay.config.randomFresh.time){
						gameplay.run.randomFresh.time = 0;
						//anim.refresh();
					}
					//end
					
					/**
					 *每一秒钟检查是否死掉,以及更新进度
					 */
					gameplay.run.deadDetect.time +=diffTime;
					if(gameplay.run.deadDetect.time >= gameplay.config.deadDetect.time){
						updateProgress(gameTime);//更新进度条
					//	updateProgress(gameTime/((gameTimeDefault+increaseTime)/100));//更新进度条
						//remainEm.innerHTML = parseInt(gameTime/1000,10);//更新剩余时间
						gameplay.run.deadDetect.time = 0;
						if(isDead()){
							change();
						}
					}
					//end
					
					/**
					 * 摇一摇,位置必须在处理事件之前
					
					if(events.length === 0){
						gameplay.run.rock.time += diffTime;
					}else{
						gameplay.run.rock.time = 0;
					}
					if(gameplay.run.rock.time > gameplay.config.rock.time && gameplay.run.rock.limit < gameplay.config.rock.limit){
						gameplay.run.rock.count++;
						gameplay.run.rock.limit++;
						rock.innerHTML = gameplay.run.rock.count;
						gameplay.run.rock.time = 0;
					} */
					//end

					/**处理各种动物显示数**/
					(function(){
						for(var animalName in gameplay.config){
							var animal = gameplay.config[animalName];
							if(animal.count){
								animal.count.innerHTML = gameplay.run[animalName].clear;
							}
						}

					})()


					/**
					 * 处理点击事件
					 */
					var tail = events.pop();//所有事件缓存
					while(tail && tail.cell){
						resetMatrix(traceMatrix);//重置trace矩阵
						
						//处理道具事件
						if(!gameplay.run.toolsEventLock&&gameplay.run.toolsEventIndex<gameplay.run.toolsEvent.length&&!gameplay.run.dropLock){
							gameplay.run.toolsEventLock=true;
							if(!gameplay.run.toolsEventAutoUnlock){
								clearTimeout(gameplay.run.toolsEventAutoUnlock);
							}
							gameplay.run.toolsEventAutoUnlock = setTimeout(function(){
								gameplay.run.toolsEventLock = false;
							},4000);
							gameplay.run.toolsEventIndex++;
							gameplay.run.toolsEvent[gameplay.run.toolsEventIndex-1](tail,gameplay.run);//执行事件
							if(gameplay.run.toolsEventIndex<gameplay.run.toolsWarning.length){
								warningForTool();
							}else{
								document.getElementById('div_messagebox').style.display = 'none';
								document.getElementById('control_panel').style.opacity =  '1';
							}
							break;
						}else if(!gameplay.run.toolsEventLock&&!gameplay.run.dropLock){
							//处理魔棒
							/*TODO 魔棒
							if(gameplay.run.magic.useing){
								gameplay.run.magic.useing = false;
								anim.clearSameColor(tail.cell);
							}*/
							if(!tail.cell.getLock()){//当前点击的cell没有lock，处理点击事件
								var chains = getChainCell(tail.cell);
								var chainsLen = chains.length;
								if(chainsLen >= linkCount){
									//doubleHit++;
									//gameplay.run.magic.combo++;//魔棒
									//gameplay.run.sandy.combo++;//沙漏
									if(chains[0].img[0]==6 && chains.length > 15){
										gameplay.run.pig.clear = gameplay.run.pig.clear+1;
									}else{
										for(i=0; i<chainsLen; i++){
											//chains[i].animScale();//缩放动画
											//.run.mouse.matrix[chains[i].row][chains[i].col] += 1;
											(function (){
												var img = chains[i].img[0];//获取图片号码
												
												for(var animalName in gameplay.config){
													var animal = gameplay.config[animalName];
													if(animal.img == img){
														gameplay.run[animalName].clear++;
													}
												}
												
											})()
										}
									}

									//处理狐狸
									if(gameplay.run.fox.clear>gameplay.config.fox.combo){
										gameplay.run.fox.clear -= gameplay.config.fox.combo;
										warningForTool(gameplay.config.fox);
										gameplay.run.toolsEvent.push(function(tail,run){
											var chains = getChainCell(tail.cell);
											var chainsLen = chains.length;
											var newChainsLen = (function(){
												var foxArr = [];
												for(var i = 0 ;i< chainsLen ; i++){
													var cell = chains[i];
													var x = cell.col;
													var y = cell.row;
													addFoxArr([y,x]);
													for(var j=-1;j<2;j++){
														var xj = x+j;
														if(xj>-1&&xj<count){
															for(var k=-1;k<2;k++){
																var yk = y+k;
																if(yk>-1&&yk<count){
																	addFoxArr([yk,xj]);
																}
															}
														}
													}
												}
												function addFoxArr(arr){
													for(var i=0;i<foxArr.length;i++){
														if(foxArr[i][0]==arr[0]&&foxArr[i][1]==arr[1]){
															return;
														}
													}
													foxArr.push(arr);
												}
												chains = [];
												for(var x=0;x<foxArr.length;x++){
													chains.push(Cell.cells[foxArr[x][0]][foxArr[x][1]]);
												}

												return foxArr.length;
											})();
											score += gameplay.config.fox.bouns;
											//消除加分
											score += chainsLen*scoreMul;
											bigboomAnim(chains,null,function(){
												setTimeout(function(){
													gameplay.run.toolsEventLock = false;	
												},400);
											});//掉落动画处理	
										});
										
									}

									//处理猪
									if(chainsLen<10&&gameplay.run.pig.clear>gameplay.config.pig.combo){
										gameplay.run.pig.clear-=gameplay.config.pig.combo;
										alertForTool(gameplay.config.pig);
										(function(){
											for(var i=0;i<gameplay.config.pig.format.length;i++){
												for(var j=0;j<gameplay.config.pig.format[i].length;j++){
													var f = gameplay.config.pig.format[i][j];
													if(f){
														Cell.cells[i][j].img[0] = f[0];
														Cell.cells[i][j].img[1] = f[1];
														Cell.cells[i][j].setRedraw();
													}
												}
											}
										})();
										score += gameplay.config.pig.bouns;
									}else{
										for(var i = 0 ;i< chainsLen -1; i ++){
											gameplay.run.toolsEventLock = true;
											chains[i].animDisappear();
										}
										chains[chainsLen-1].animDisappear(function(){
											dropAnimProcess(chains);//掉落动画处理
											setTimeout(function(){
												gameplay.run.toolsEventLock = false;	
											},400);
										});
										//消除加分
										score += chainsLen*scoreMul;
									}
								}else{
									//gameplay.run.magic.combo = 0;//魔棒
									//gameplay.run.sandy.combo = 0;//沙漏
								}
							}

							break;
						}
						tail = events.pop();
					}

					updateScore(score);
					//scoreBar.innerHTML = score;
					//end

					//缓存道具
					//处理螃蟹
						if(gameplay.run.crab.clear>gameplay.config.crab.combo){
							gameplay.run.crab.clear -= gameplay.config.crab.combo;
							warningForTool(gameplay.config.crab);
							gameplay.run.toolsEvent.push(function(tail){
								var cells = [];
								var x = tail.cell.col;
								var y = tail.cell.row;
								var max = Cell.cells.length;
								for(var i=-1;i<2;i++){
									var xi = x+i;
									if(xi>-1&&xi<max){
										for(var j=-1;j<2;j++){
											var yj = y+j;
											if(yj>-1&&yj<max){
												cells.push(Cell.cells[yj][xi]);
											}
										}
									}
								}
								boomAnim(tail.cell,(function(ba,cells,fn){
									return function(){
										ba(cells,null,fn);
									};
								})(boomingAnim,cells,function(){
									setTimeout(function(){
										gameplay.run.toolsEventLock = false;	
									},400);
								}));

								score += gameplay.config.crab.bouns;
							});
						}

						//处理青蛙
						if(gameplay.run.frog.clear>gameplay.config.frog.combo){
							gameplay.run.frog.clear -= gameplay.config.frog.combo;
							warningForTool(gameplay.config.frog);
							gameplay.run.toolsEvent.push(function(tail){
								Cell.cells[Cell.cells.length-1][tail.cell.col].animMouse('top',function(){
									var cells = [];
									for(var i=0;i<Cell.cells.length;i++){
										cells.push(Cell.cells[i][this.col]);
									}
									dropAnimProcess(cells);
									setTimeout(function(){
										gameplay.run.toolsEventLock = false;	
									},400);
								});
								score += scoreMul*count;
								score += gameplay.config.frog.bouns;
							});
						}

						//处理大象
						if(gameplay.run.elephant.clear>gameplay.config.elephant.combo){
							gameplay.run.elephant.clear -= gameplay.config.elephant.combo;
							warningForTool(gameplay.config.elephant);
							gameplay.run.toolsEvent.push(function(tail){
								Cell.cells[tail.cell.row][0].animMouse('right',function(){
									dropAnimProcess(Cell.cells[this.row]);
									setTimeout(function(){
										gameplay.run.toolsEventLock = false;	
									},400);
								});
								score += scoreMul*count;
								score += gameplay.config.elephant.bouns;
							});
							
						}

						//处理蝙蝠
						if(gameplay.run.bat.clear>gameplay.config.bat.combo){
							gameplay.run.bat.clear -= gameplay.config.bat.combo;
							warningForTool(gameplay.config.bat);
							gameplay.run.toolsEvent.push(function(tail){
								anim.clearSameColor(tail.cell);
								score += gameplay.config.bat.bouns;
							});	
						}


					//立刻执行事件
					//处理小鸡
						if(gameplay.run.chick.clear>gameplay.config.chick.combo){
							gameplay.run.chick.clear -= gameplay.config.chick.combo;
							if(gameTime + gameplay.config.chick.increase>gameTimeDefault){
								gameTime = gameTimeDefault;
							}else{
								gameTime += gameplay.config.chick.increase;
							}

							score += gameplay.config.chick.bouns;
							alertForTool(gameplay.config.chick);
						}

						//处理熊猫
						if(gameplay.run.panda.clear>gameplay.config.panda.combo){
							alertForTool(gameplay.config.panda);
							gameplay.run.panda.clear-=gameplay.config.panda.combo;
							anim.clearAll();
							score += gameplay.config.panda.bouns;
							score += scoreMul*count*count;//清除全屏幕加分
						}

					/**
					 * 魔棒
					 
					if(gameplay.run.magic.combo>=gameplay.config.magic.combo && gameplay.run.magic.limit < gameplay.config.magic.limit){
						gameplay.run.magic.count++;
						gameplay.run.magic.limit++;
						magic.innerHTML = gameplay.run.magic.count;
						gameplay.run.magic.combo = gameplay.run.magic.combo%gameplay.config.magic.combo;
					}*/
					//end
					/**
					 * 沙漏
					
					if(gameplay.run.sandy.combo>=gameplay.config.sandy.combo && gameplay.run.sandy.limit < gameplay.config.sandy.limit){
						gameplay.run.sandy.count++;
						gameplay.run.sandy.limit++;
						sandy.innerHTML = gameplay.run.sandy.count;
						gameplay.run.sandy.combo = gameplay.run.sandy.combo%gameplay.config.sandy.combo;
					} */
					//end
					/**
					 * 小丑
					 
					gameplay.run.clown.score = score;
					if(gameplay.run.clown.score >= gameplay.config.clown.score && gameplay.run.clown.limit < gameplay.config.clown.limit){
						gameplay.run.clown.count++;
						gameplay.run.clown.limit++;
						clown.innerHTML = gameplay.run.clown.count;
					}*/
					//end
					/**
					 * 老鼠
					
					gameplay.run.mouse.time += diffTime;
					if(gameplay.run.mouse.time >= gameplay.config.mouse.time && gameplay.run.mouse.limit < gameplay.config.mouse.limit){
						var tempCell = getMouseCell();
						if(tempCell){
							gameplay.run.mouse.cells.push(tempCell);
							gameplay.run.mouse.limit++;
						}
						mouse.innerHTML = gameplay.run.mouse.cells.length;
						resetMatrix(gameplay.run.mouse.matrix);
						gameplay.run.mouse.time = 0;
					} */
					//end
					/**
					 *更新所有cell 
					 */
					var row = Cell.cells.length;
					for(i=0; i<row; i++){
						var col = Cell.cells[i].length;
						for(var j=0; j<col; j++){
							Cell.cells[i][j].update();
						}
					}
					//end
				}
				start = time;
			}//end 控制fps
			//timer
			requestAnimationFrame(arguments.callee);
		});
	};

	function touchOrMouseDown(el, fn){
		el.addEventListener('mousedown', fn, false);
		el.addEventListener('touchstart', fn, false);
	}
	
	//绑定事件，fps
	(function(){
		//游戏部分事件绑定
		canvas = document.getElementById('canvas');
		pauseBtn = document.getElementById('btn_pause');
		timer = document.getElementById('div_timer');
		touchOrMouseDown(canvas,function(e){//游戏canvas事件banding
			if(!clickStop&&!gameplay.run.toolsEventLock){
				clickStop = true;
				setTimeout(function(){
					clickStop = false;
				},200);
				if(!anim.paused){
					events.push({
						cell:getTouchCell(getRelativePos(e)),
						e:e
					});
				}
			}
		});
		touchOrMouseDown(pauseBtn ,function(e){//暂停按钮
			if(!anim.paused){
				if(gameTime >0){
					anim.pause(); 
				}
				openCtl(gameTime >0);
			}
		});
		
		//菜单事件绑定
		var resumeBtn = document.getElementById('resume');
		var restartBtn = document.getElementById('restart');
		var quitBtn = document.getElementById('quit');
		touchOrMouseDown(resumeBtn, function(e){
			anim.resume();
			closeCtl();
		});
		touchOrMouseDown(restartBtn, function(e){
			anim.refreshAll();
		 	anim.reStart();
		 	closeCtl();
		});
		touchOrMouseDown(quitBtn, function(e){
			try{
				closeCtl();
				exit();
			}catch(ex){
			}
		});

		//help
		divHelp = document.getElementById('help_div');
		divHelp.style.left = document.getElementById('mainMenu').offsetLeft + 'px';
		divHelp.style.top = '0px';
	
		//入口部分事件绑定
		var oneminute = document.getElementById('oneminute');
		var night = document.getElementById('night');
		var about = document.getElementById('about');
		var help = document.getElementById('help');
		touchOrMouseDown(oneminute, function(e){
			enter();
			initDomAndAnim('140150');
		});
		touchOrMouseDown(night, function(e){
			enter();
			initDomAndAnim('night');
		});
		touchOrMouseDown(about, function(e){
			divHelp.style.display='block';
			document.getElementById('help_div_about_us').style.display='block';
		});
		touchOrMouseDown(help, function(e){
			divHelp.style.display='block';
			document.getElementById('help_div_0').style.display='block';
		});


		touchOrMouseDown(document.getElementById('divScreenHelpBtn'), function(e){
			divHelp.style.display='block';
			document.getElementById('help_div_0').style.display='block';
		});

		if(!localStorage['notFristInit']){
			localStorage['notFristInit'] = true;
			divHelp.style.display='block';
			document.getElementById('help_div_0').style.display='block';
		}

		touchOrMouseDown(document.getElementById('divScreenBodyHelpBtn'), function(e){
			divHelp.style.display='block';
			document.getElementById('help_div_0').style.display='block';
		});

		touchOrMouseDown(divHelp, function(e){
			if(document.getElementById('help_div_0').style.display=='block'){
				document.getElementById('help_div_0').style.display='none';
				document.getElementById('help_div_1').style.display='block';
			}else if(document.getElementById('help_div_1').style.display=='block'
				||document.getElementById('help_div_about_us').style.display=='block'
				||document.getElementById('help_div_ranking').style.display=='block'
				){
				divHelp.style.display='none';
				document.getElementById('help_div_1').style.display='none';
				document.getElementById('help_div_about_us').style.display='none';
				document.getElementById('help_div_ranking').style.display='none';
			}
		});

		
	})();


	function sendRank( rankId ,score){
	
	}

	(function(ab,index){
			ab.style.background = "url('img/light"+index+".png') no-repeat";
			ab.style.backgroundSize = "157px 54px";
			setTimeout(
				(function(c,ab,index){
					return function(){
						c(ab,index==1?2:1);
					};
				})(arguments.callee,ab,index)
			,150);
		})(document.getElementById('div_messagebox'),1);
})(window);
