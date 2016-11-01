//菜单层
var MenuLayer = (function(){
    return cc.Layer.extend({
        ctor:function() {
            this._super();
            this.setTouchEnabled(true);
            var size = cc.Director.getInstance().getWinSize();
           
            var menu = cc.Sprite.create(s_Menu);
            this.addChild(menu);
            menu.setScale(0.8);
            menu.setPosition(cc.p(size.width / 2, size.height / 2));

            var menu2 = cc.Sprite.create(s_Menu);
            this.addChild(menu2);
            menu2.setOpacity(128);
            menu2.setPosition(cc.p(size.width / 2, size.height / 2));
            menu2.runAction(cc.RepeatForever.create(cc.Sequence.create(
                cc.ScaleTo.create(0.1, 0.8),
                cc.ScaleTo.create(0.1, 0.81),
                cc.ScaleTo.create(0.1, 0.8),
                cc.ScaleTo.create(0.1, 0.81),
                cc.ScaleTo.create(0.1, 0.8),
                cc.ScaleTo.create(0.1, 0.81),
                cc.ScaleTo.create(0.1, 0.8),
                cc.ScaleTo.create(0.1, 0.81),
                cc.ScaleTo.create(0.1, 0.8),
                cc.DelayTime.create(1)
                )));
        },

        onTouchesEnded:function (touches, event) {
            var p = touches[0].getLocation();
            if(p.x>395&&p.y>125&&p.x<575&&p.y<175){//位置判断
                MAINSCENE.toFightLayer();
            }
        }
    });


})();
var MAINSCENE;

var MainScene =cc.Scene.extend({
    onEnter:function () {
        new AudioManager();
        MAINSCENE = this;
        this._super();
        var scrollLayer = new ScrollLayer();
        this.addChild(scrollLayer);//背景滚动

        this.curLayer = null;
        this.toMenuLayer();
    },

    toFightLayer : function(){
        if(this.curLayer){
            this.removeChild(this.curLayer);
        }
        var fightLayer = new FightLayer();
        this.curLayer = fightLayer;
        this.addChild(fightLayer);
        AUDIOMANAGER.playFightBackgroundMusic();
    },

    toMenuLayer: function(){
        if(this.curLayer){
            this.removeChild(this.curLayer);
        }
        var menuLayer = new MenuLayer();
        this.curLayer = menuLayer;
        this.addChild(menuLayer);
        AUDIOMANAGER.playMenuBackgroundMusic();
    },

    toScoreLayer : function(p1Score,p2Score){
        if(this.curLayer){
            this.removeChild(this.curLayer);
        }
        var scoreLayer = new ScoreLayer(p1Score,p2Score);
        this.curLayer = scoreLayer;
        this.addChild(scoreLayer);  
        AUDIOMANAGER.playScoreBackgroundMusic();
    }
});