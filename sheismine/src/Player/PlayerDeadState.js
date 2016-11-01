//死亡状态
var PlayerDeadState = (function(){
	//死亡状态是不做任何事情的，所以到此状态不会做任何事情直到动画结束
	return cc.Class.extend({
		ctor : function(player,maxDt){
			this.player = player;
			this.maxDt = maxDt;
			this.reset();
		},
		reset:function(){
			this.isDead = false;
        	this.count = 0;
		},
		update : function(dt){
			with(this){
				count+=dt;
				if(count>maxDt){//大于死亡时间
					player.toFlyState();
					player.doAction('flyDown');
				}
			}
		},
        flyUp : nilFn,
        flyDown : nilFn,
        flyLeft : nilFn,
        flyRight : nilFn,
        dead : function(){
        	if(this.isDead){//不让连续死
        		return;
        	}
        	this.isDead = true;
        	this.player.doAction('dead');
			AUDIOMANAGER.playDeadEffect();
        },
        getStateName : function(){
        	return 'dead';
        }
	});
})();