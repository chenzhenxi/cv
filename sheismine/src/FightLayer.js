//战斗控制，主要战场逻辑区域
var FightManager = (function(){

	var MAXTIME = 68;//每一局游戏时间

	function notCollide(aabb1,aabb2){
		return aabb1.max.x < aabb2.min.x
		|| aabb1.max.y < aabb2.min.y
		|| aabb2.max.x < aabb1.min.x
		|| aabb2.max.y < aabb1.min.y;
	}

	return cc.Class.extend({
		ctor:function(mainLayer){
            var size = cc.Director.getInstance().getWinSize();

			this.mainLayer = mainLayer;
			//妹纸
			this.girl = new Girl();
			mainLayer.addChild(this.girl);

			//激光矩阵
			this.beam = new Beam(mainLayer); 

            //玩家1，黄头发
            var p1 = new Player(s_PlayerYellowFrame,{x:400,y:282});
            this.p1 = p1;
            mainLayer.addChild(p1);
            //玩家1，名字
           	var p1NameLabel = cc.LabelTTF.create('Mr. WASD', "Arial", 28);
           	p1.addChild(p1NameLabel);
           	p1NameLabel.setPosition(cc.p(100,180));

            //玩家1，计分板
            var p1Header = cc.Sprite.create(s_PlayerYellowHeader);
            mainLayer.addChild(p1Header);
            p1Header.setScale(0.5);
            p1Header.setPosition(cc.p(15,size.height-15));
            this.p1Score = 0;//玩家1分数
            this.p1ScoreLabel = cc.LabelTTF.create(this.p1Score+ ' ', "Arial", 24,cc.size(300, 24),cc.TEXT_ALIGNMENT_LEFT);
            this.p1ScoreLabel.setPosition(cc.p(40,size.height-18));
            this.p1ScoreLabel.setAnchorPoint(cc.p(0, 0.5));//左对齐就是设置左边的p为0
            mainLayer.addChild(this.p1ScoreLabel);

            //玩家2，红头发
            var p2 = new Player(s_PlayerRedFrame,{x:600,y:282});
            this.p2 = p2;
            mainLayer.addChild(p2);

            //玩家2，名字
           	var p2NameLabel = cc.LabelTTF.create('Mr. ARROW', "Arial", 28);
           	p2.addChild(p2NameLabel);
           	p2NameLabel.setPosition(cc.p(100,180));


            //玩家2，计分板
            var p1Header = cc.Sprite.create(s_PlayerRedHeader);
            mainLayer.addChild(p1Header);
            p1Header.setScale(0.5);
            p1Header.setPosition(cc.p(size.width - 15,size.height-15));
            this.p2Score = 0;//玩家1分数
            this.p2ScoreLabel = cc.LabelTTF.create(this.p2Score + ' ', "Arial", 24,cc.size(300, 24),cc.TEXT_ALIGNMENT_RIGHT);
            this.p2ScoreLabel.setPosition(cc.p(size.width -25,size.height-18));
            this.p2ScoreLabel.setAnchorPoint(cc.p(1, 0.5));//左对齐就是设置左边的p为0
            mainLayer.addChild(this.p2ScoreLabel);

            //倒计时
            this.timeRemaining = MAXTIME;
            this.stopwatch = cc.LabelTTF.create(' '+ this.timeRemaining + ' ', "Arial", 28);
            this.stopwatch.setPosition(cc.p(size.width/2,size.height-16));
            mainLayer.addChild(this.stopwatch);
            //键盘代理
			var dct = cc.Director.getInstance();
			var keyboardDispatcher = dct.getKeyboardDispatcher();
            var keyboardDelegate = cc.KeyboardDelegate.extend({//按键代理
				onKeyDown : function(key){
					if(key == KEYCODE_W){
						p1.flyUp();
					}else if(key == KEYCODE_S){
						p1.flyDown();
					}else if(key == KEYCODE_A){
						p1.flyLeft();
					}else if(key == KEYCODE_D){
						p1.flyRight();
					}else if(key == KEYCODE_UP){
						p2.flyUp();
					}else if(key == KEYCODE_DOWN){
						p2.flyDown();
					}else if(key == KEYCODE_LEFT){
						p2.flyLeft();
					}else if(key == KEYCODE_RIGHT){
						p2.flyRight();
					}
				}
			});
			keyboardDispatcher.addDelegate(new keyboardDelegate());
		},

		update : function(dt){
			this.timeRemaining -= dt;
			if(this.timeRemaining <= 0){//倒计时结束
				MAINSCENE.toScoreLayer(this.p1Score,this.p2Score);
			}
			this.stopwatch.setString(' '+parseInt(this.timeRemaining,10)+' ');

			var p1 = this.p1;
			var p2 = this.p2;
			var girl = this.girl;
			var p1Pos = p1.getPosition();//p1位置
			var p2Pos = p2.getPosition();//p2位置
			var aabb1 = {//玩家1碰撞矩形
					min : {
						x : p1Pos.x - 10,
						y : p1Pos.y - 10
					},
					max : {
						x : p1Pos.x + 10,
						y : p1Pos.y + 10
					}
				};
			var aabb2 = {//玩家2碰撞矩形
				min : {
					x : p2Pos.x - 10,
					y : p2Pos.y - 10
				},
				max : {
					x : p2Pos.x + 10,
					y : p2Pos.y + 10
				}
			};

			//死亡检测
			with(this.beam){
				update(dt);//更新激光矩阵
				if(aabb1.min.x < min.x 
					|| aabb1.min.y < min.y 
					|| aabb1.max.x > max.x 
					|| aabb1.max.y > max.y 
					){//碰撞激光检测
					if(girl.follow == p1){
						if(p2.getCurStateName()=='dead'){
							girl.follow = null;
							girl.reset();
						}else{
							girl.follow = p2;
						}
					}
					p1.dead();
				}
				if(aabb2.min.x < min.x
					||  aabb2.min.y < min.y
					||  aabb2.max.x > max.x
					||  aabb2.max.y > max.y){
					if(girl.follow == p2){
						if(p1.getCurStateName()=='dead'){
							girl.follow = null;
							girl.reset();
						}else{
							girl.follow = p1;
						}
					}
					p2.dead();
				}
			}


			if(p1.canCollide&&p2.canCollide){//如果可以碰撞
				//检查妹纸
				if(!girl.follow){
					var gPos = girl.getPosition();
					var gAabb ={//妹纸碰撞矩形
						min : {
							x : gPos.x - 25,
							y : gPos.y - 25
						},
						max : {
							x : gPos.x + 25,
							y : gPos.y + 25
						}
					};
					if(!notCollide(aabb1,gAabb)){
						girl.follow = p1;
					}else if(!notCollide(aabb2,gAabb)){
						girl.follow = p2;
					}
				}

				if(!notCollide(aabb1,aabb2)){//碰撞检测
					AUDIOMANAGER.playColliedEffect();
					var v = p1.curState.v;
					var a = p1.curState.a;
					p1.curState.v = p2.curState.v;
					p1.curState.a = p2.curState.a;
					p2.curState.v = v;
					p2.curState.a = a;
				}
			}

			if(girl.follow){//计分
				if(girl.follow == p1){
					this.p1Score += dt*255;
					this.p1ScoreLabel.setString(parseInt(this.p1Score,10)+' ');
				}else{
					this.p2Score += dt*255;
					this.p2ScoreLabel.setString(parseInt(this.p2Score,10)+' ');
				}
			}
		}
	});
})();

//战斗层
var FightLayer = (function(){
    return cc.Layer.extend({
    	ctor:function() {
            this._super();
        	this.fightManager = new FightManager(this);//创建主战场
        	this.scheduleUpdate();//注册主循环
        },

        update: function(dt){
        	this.fightManager.update(dt);
        }
    });
})();

//光柱
var Beam = (function(){
	return cc.Class.extend({
		ctor : function(parent){
			this.min = {
				x:100,
				y:100
			};
			this.max = {
				x:900,
				y:513
			};
			this.next = {
				max : this.max,
				min : this.min
			};
			this.v = 0;

			this.up = cc.Sprite.create(s_BeamBeam);//上光柱
            this.up.setScaleY(0.3);
            parent.addChild(this.up);
            this.down = cc.Sprite.create(s_BeamBeam);//下光柱
            this.down.setScaleY(0.3);
            parent.addChild(this.down);
            this.left = cc.Sprite.create(s_BeamBeam);//左光柱
            this.left.setRotation(90);//扭转90°，成为竖直光柱
            this.left.setScaleY(0.3);
            parent.addChild(this.left);
            this.right = cc.Sprite.create(s_BeamBeam);//右光柱
            this.right.setRotation(90);//扭转90°，成为竖直光柱
            this.right.setScaleY(0.3);
            parent.addChild(this.right);

            this.upLeft = cc.Sprite.create(s_BeamGenerator);//左上角
            this.upLeft.setScale(0.3);
            parent.addChild(this.upLeft);
            this.upRight = cc.Sprite.create(s_BeamGenerator);//右上角
            this.upRight.setScale(0.3);
            parent.addChild(this.upRight);
            this.downLeft = cc.Sprite.create(s_BeamGenerator);//左下角
            this.downLeft.setScale(0.3);
            parent.addChild(this.downLeft);
            this.downRight = cc.Sprite.create(s_BeamGenerator);//右上角
            this.downRight.setScale(0.3);
            parent.addChild(this.downRight);
		},
		update : function(dt){
			with(this){//重定向空间
				//这里可以优化的
				if(max.x<next.max.x){
					max.x += v*dt;
					if(max.x>next.max.x){
						max.x=next.max.x;
					}
				}
				if(max.y<next.max.y){
					max.y += v*dt;
					if(max.y>next.max.y){
						max.y=next.max.y;
					}
				}
				if(max.x>next.max.x){
					max.x -= v*dt;
					if(max.x<next.max.x){
						max.x=next.max.x;
					}
				}
				if(max.y>next.max.y){
					max.y -= v*dt;
					if(max.y<next.max.y){
						max.y=next.max.y;
					}
				}
				if(min.x>next.min.x){
					min.x -= v*dt;
					if(min.x<next.min.x){
						min.x=next.min.x;
					}
				}
				if(min.y>next.min.y){
					min.y -= v*dt;
					if(min.y<next.min.y){
						min.y=next.min.y;
					}
				}

				if(min.x<next.min.x){
					min.x += v*dt;
					if(min.x>next.min.x){
						min.x=next.min.x;
					}
				}
				if(min.y<next.min.y){
					min.y += v*dt;
					if(min.y>next.min.y){
						min.y=next.min.y;
					}
				}

				if(max.x==next.max.x
				&&max.y==next.max.y
				&&min.x==next.min.x
				&&min.y==next.min.y
				){//随机下一个形状
					next = {
						min : {
							x : Math.random()*450-100,
							y : Math.random()*300-50
						},
						max : {
							x : Math.random()*500+650,
							y : Math.random()*300+313
						}
					};
					v = Math.random()*100+30;
				}

				var width = max.x - min.x;//激光矩阵的宽度
				var height = max.y - min.y;//激光矩阵的高度
				var widthScale = width / 79;//图片的原始宽度
				var heightScale = height / 79;//图片的原始高度
				up.setPosition(cc.p(min.x + width / 2, max.y));//光柱坐标
				up.setScaleX(widthScale);//光柱缩放
				down.setPosition(cc.p(min.x + width / 2, min.y));//光柱坐标
				down.setScaleX(widthScale);//光柱缩放
				left.setPosition(cc.p(min.x , min.y + height / 2));//光柱坐标
				left.setScaleX(heightScale);//光柱缩放
				right.setPosition(cc.p(max.x , min.y + height / 2));//光柱坐标
				right.setScaleX(heightScale);//光柱缩放

				upLeft.setPosition(cc.p(min.x,max.y));
				upRight.setPosition(cc.p(max.x,max.y));
				downLeft.setPosition(cc.p(min.x,min.y));
				downRight.setPosition(cc.p(max.x,min.y));
			}
		}
	});
})();