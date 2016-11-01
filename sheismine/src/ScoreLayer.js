//分数统计页面
var ScoreLayer = (function(){
	return cc.Layer.extend({
    	ctor:function(p1Score,p2Score) {
            this._super();
            this.setTouchEnabled(true);
            var size = cc.Director.getInstance().getWinSize();

            var backgroud = cc.Sprite.create(s_Score);

            backgroud.setPosition(cc.p(size.width/2,size.height*0.382));
            this.addChild(backgroud);

            var winSprite;
            if(p1Score>p2Score){
            	winSprite = cc.Sprite.create(s_PlayerYellowWin);
            }else{
            	winSprite = cc.Sprite.create(s_PlayerRedWin);
            }
            winSprite.setPosition(cc.p(size.width/2-10,size.height*0.618+80));
            this.addChild(winSprite);

            var p1ScoreLable = cc.LabelTTF.create(''+Math.ceil(p1Score), "Arial", 34,cc.size(220, 38),cc.TEXT_ALIGNMENT_LEFT);
			backgroud.addChild(p1ScoreLable);
			p1ScoreLable.setPosition(cc.p(210,100));
			var p2ScoreLable = cc.LabelTTF.create(''+Math.ceil(p2Score), "Arial", 34,cc.size(220, 38),cc.TEXT_ALIGNMENT_LEFT);
			p2ScoreLable.setPosition(cc.p(540,100));
			backgroud.addChild(p2ScoreLable);
			var againBtn = cc.LabelTTF.create('再来一次 RESTART', "Arial", 24);
			var againBtn2 = cc.LabelTTF.create('再来一次 RESTART', "Arial", 24);
			this.addChild(againBtn);
			this.addChild(againBtn2);
			againBtn.setPosition(cc.p(size.width/2,100));
			againBtn2.setPosition(cc.p(size.width/2,100));
			againBtn2.setOpacity(128);
			againBtn2.runAction(cc.RepeatForever.create(cc.Sequence.create(
                cc.ScaleTo.create(0.1, 1.03),
                cc.ScaleTo.create(0.1, 1),
                cc.ScaleTo.create(0.1, 1.03),
                cc.ScaleTo.create(0.1, 1),
                cc.ScaleTo.create(0.1, 1.03),
                cc.ScaleTo.create(0.1, 1),
                cc.ScaleTo.create(0.1, 1.03),
                cc.ScaleTo.create(0.1, 1),
                cc.DelayTime.create(1)
                )));
        },
        onTouchesEnded:function (touches, event) {
            var p = touches[0].getLocation();
            if(p.x>390&&p.y>90&&p.x<610&&p.y<120){//位置判断
                MAINSCENE.toMenuLayer();
            }
        }
    });

})();