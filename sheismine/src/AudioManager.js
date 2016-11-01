var AUDIOMANAGER;
var AudioManager = cc.Class.extend({
    ctor: function(){
        AUDIOMANAGER = this;
        this.AE = cc.AudioEngine.getInstance();
    },
    playMenuBackgroundMusic : function(){
        cc.AudioEngine.getInstance().stopBackgroundMusic();
        this.AE.playBackgroundMusic(m_MenuBg, true);
    },
    playFightBackgroundMusic : function(){
        cc.AudioEngine.getInstance().stopBackgroundMusic();
        this.AE.playBackgroundMusic(m_FightBg, false);
    },
    playScoreBackgroundMusic : function(){
        cc.AudioEngine.getInstance().stopBackgroundMusic();
        this.AE.playBackgroundMusic(m_ScoreBg, true);
    },
    playColliedEffect : function(){
        this.AE.playEffect(m_Collide);  
    },
    playDeadEffect :  function(){
        this.AE.playEffect(m_Dead);  
    }
});