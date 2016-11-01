//妹纸
var Girl = (function(){

    return cc.Sprite.extend({
        ctor : function(){
            this._super();
            this.follow = null;
            this.setScale(0.5);
            this.initWithFile(s_Girl);
            this.scheduleUpdate();
            this.setAnchorPoint(cc.p(0.5, 0.5));
            this.reset();

            this.runAction(cc.RepeatForever.create(//不断旋转的妹纸
                cc.RotateBy.create(5, 360)
            ));
        },
        reset : function(){
            var size = cc.Director.getInstance().getWinSize();
            this.setPosition(cc.p(size.width/2,size.height/2));
        },
        update : function(dt){
            with(this){
                if(follow){
                    var p = follow.getPosition();
                    setPosition(cc.p(p.x + 20,p.y - 20));
                }
            }
        }
    });
})();