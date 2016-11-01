//滚动背景层
var ScrollLayer = (function(){
    function getMove(time){
        return cc.MoveBy.create(time, cc.p(3200, 0));
    }

    function getBg(url,parent){
        var s = cc.Sprite.create(url);
        s.setAnchorPoint(cc.p(0.84375, 0.5));
        parent.addChild(s);
        return s;
    }

    function getScrollAction(pos,duration){
        return cc.RepeatForever.create(cc.Sequence.create(cc.Place.create(pos),getMove(duration)));
    }
    return cc.Layer.extend({
        ctor:function() {
           
            this._super();
            var size = cc.Director.getInstance().getWinSize();

            var bg1 = getBg(s_Bg1,this);
            var bg1_1 = getBg(s_Bg1,this);
            var bg2 = getBg(s_Bg2,this);
            var bg2_1 = getBg(s_Bg2,this);
            var bg3 = getBg(s_Bg3,this);
            var bg3_1 = getBg(s_Bg3,this);
     
            var midInSize = cc.p(size.width / 2, size.height / 2);
            bg1.runAction(getScrollAction(midInSize,90));
            bg1_1.runAction(getScrollAction(cc.p(-2700, size.height / 2),90));

            bg2.runAction(getScrollAction(midInSize,60));
            bg2_1.runAction(getScrollAction(cc.p(-2700, size.height / 2),60));

            bg3.runAction(getScrollAction(midInSize,30));
            bg3_1.runAction(getScrollAction(cc.p(-2700, size.height / 2),30));
        }
    });
})();