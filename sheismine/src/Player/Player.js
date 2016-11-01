//角色
var Player = (function(){


    var FRAMEDATA = {//序列帧动画参数
        width : 190,
        height : 170,
        actions : {
            flyUp : {
                startPos : {x:0,y:0},
                cols : 4,
                duration:0.1,
                create : cc.RepeatForever.create
            },
            flyDown : {
                startPos : {x:760,y:0},
                cols : 4,
                duration:0.1,
                create : cc.RepeatForever.create
            },
            flyRight : {
                startPos : {x:1520,y:0},
                cols : 4,
                duration:0.1,
                create : cc.RepeatForever.create
            },
            flyLeft : {
                startPos : {x:2280,y:0},
                cols : 4,
                duration:0.1,
                create : cc.RepeatForever.create
            },
            dead : {
                startPos : {x:3040-6,y:0},
                cols : 15,
                duration:0.1,
                create : function(anim){
                    return cc.Repeat.create(anim,1);
                }
            }
        }
    };

    //序列帧
    function setActions(actions,texture){
        for(var key in FRAMEDATA.actions){
            var actionData = FRAMEDATA.actions[key];
            actions[key] = buildAction(actionData,texture);
        }
    }

    //创建动作
    function buildAction(actionData,texture){
        var animFrames = [];
        for(var col = 0; col < actionData.cols; col++){
            animFrames[animFrames.length] = cc.SpriteFrame.createWithTexture(texture, 
                    cc.rect(FRAMEDATA.width * col + actionData.startPos.x, actionData.startPos.y , FRAMEDATA.width, FRAMEDATA.height)
            );
        }
        var animation = cc.Animation.create(animFrames, actionData.duration);
        var animate = cc.Animate.create(animation);
        return actionData.create(animate);
    }

    return cc.Sprite.extend({
        ctor : function(url,pos){
            this._super();
            this.curAction = null;//当前动作
            this.actions = {};//动作
            this.setScale(0.5);
            this.setAnchorPoint(cc.p(0.5, 0.5));
            this.flyState = new PlayerFlyState(this,pos);
            this.deadState = new PlayerDeadState(this,FRAMEDATA.actions.dead.duration*FRAMEDATA.actions.dead.cols);
            this.curState = this.flyState;//当前状态
            this.canCollide = true;//是否允许碰撞
            var texture = cc.TextureCache.getInstance().addImage(url);
            setActions(this.actions,texture);
            this.scheduleUpdate();
            
        },
        update : function(dt){
            this.curState.update(dt);
        },

        //执行动作前，自动取消当前动作
        doAction : function(name){
            with(this){
                curAction&&stopAction(curAction);
                runAction(actions[name]);
                curAction = actions[name];
            }
        },

        flyUp : function(){
            this.curState.flyUp();
        },

        flyDown : function(){
            this.curState.flyDown();  
        },

        flyLeft : function(){
            this.curState.flyLeft();  
        },

        flyRight : function(){
            this.curState.flyRight();  
        },

        dead : function(){
            this.curState.dead();
        },

        toFlyState : function(){
            this.curState = this.flyState;
            this.flyState.reset();
            this.canCollide = true;
        },

        toDeadState : function(){
            this.curState = this.deadState;
            this.deadState.reset();
            this.canCollide = false;
        },

        getCurStateName : function(){
            return this.curState.getStateName();
        }
    });
})();