var PlayerFlyState = (function(){
	var ACC = 20;
	var MAXV = 100;
	return cc.Class.extend({
		ctor : function(player,pos){
			this.player = player;
			this.defPos = pos;
			player.setPosition(cc.p(pos.x,pos.y));
			this.reset();
		},
		reset : function(){
			this.a = {//x轴和y轴的相对加速度速度 0为不动，1为正向，2为反方向
				x : 0,
				y : 0
			}

			this.v = {//x轴和y轴的速度
				x : 0,
				y : 0 
			}

			this.player.setPosition(cc.p(
				this.defPos.x,
				this.defPos.y
			));
			
		},
		update : function(dt){
			var vx = this.v.x + this.a.x * ACC;//计算新的速度
			if(vx>-MAXV && vx<MAXV){//当速度未超过最大值则赋值
				this.v.x = vx;
			}

			var vy = this.v.y + this.a.y * ACC;//计算新的速度
			if(vy>-MAXV && vy<MAXV){//当速度未超过最大值则赋值
				this.v.y = vy;
			}
			var p = this.player.getPosition();
			this.player.setPosition(cc.p(
				p.x+this.v.x*dt,
				p.y+this.v.y*dt
			));
			if(this.player.curAction == null){
				this.player.doAction('flyDown');
			}
        },
        flyUp : function(){
        	if(this.a.y != 1){//防止重复按键
	        	this.player.doAction('flyUp');
	        	this.a.y = 1;
	        	this.a.x = 0;
        	}
        },
        flyDown : function(){
        	if(this.a.y != -1){//防止重复按键
	        	this.player.doAction('flyDown');
	        	this.a.y = -1;
	        	this.a.x = 0;
	        }
        },
        flyLeft : function(){
        	if(this.a.x != -1){//防止重复按键
	        	this.player.doAction('flyLeft');
	        	this.a.y = 0;
	        	this.a.x = -1;
        	}
        },
        flyRight : function(){
        	if(this.a.x != 1){//防止重复按键
	        	this.player.doAction('flyRight');
	        	this.a.y = 0;
	        	this.a.x = 1;
        	}
        },
        dead : function(){
        	this.player.toDeadState();
        	this.player.dead();
        },

        getStateName : function(){
        	return 'fly';
        }
	});
})();