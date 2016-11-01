var imgsDir = "res/images/";

var s_PlayerRedHeader = imgsDir + "player/red/header.png";
var s_PlayerRedFrame = imgsDir + "player/red/frame.png";
var s_PlayerRedWin = imgsDir + "player/red/win.png";
var s_PlayerYellowHeader = imgsDir + "player/yellow/header.png";
var s_PlayerYellowFrame = imgsDir + "player/yellow/frame.png";
var s_PlayerYellowWin = imgsDir + "player/yellow/win.png";
var s_PlayerFire = imgsDir +"player/fire.png";
var s_Score = imgsDir +"score.png";
var s_Girl = imgsDir +"girl.png";
var s_Loading = imgsDir +"loading.png";
var s_Logo = imgsDir +"logo.jpg";
var s_Menu = imgsDir +"menu.png";
var s_Bg1 =  imgsDir +"bg/1.jpg";
var s_Bg2 =  imgsDir +"bg/2.png";
var s_Bg3 =  imgsDir +"bg/3.png";
var s_BeamBeam =  imgsDir +"beam/beam.png";
var s_BeamEffect =  imgsDir +"beam/effect.png";
var s_BeamGenerator =  imgsDir +"beam/generator.png";

var m_MenuBg = "res/audios/menuBg";
var m_ScoreBg = "res/audios/scoreBg";
var m_FightBg = "res/audios/fightBg";
var m_Collide = "res/audios/collide";
var m_Dead = "res/audios/dead";

var g_ressources = [
    //image
    {type:"image", src:s_PlayerRedHeader},
    {type:"image", src:s_PlayerRedFrame},
    {type:"image", src:s_PlayerRedWin},
    {type:"image", src:s_PlayerYellowHeader},
    {type:"image", src:s_PlayerYellowFrame},
    {type:"image", src:s_PlayerYellowWin},
    {type:"image", src:s_PlayerFire},

    {type:"image", src:s_Score},
    {type:"image", src:s_Girl},
    {type:"image", src:s_Loading},
    {type:"image", src:s_Logo},
    {type:"image", src:s_Menu},
    {type:"image", src:s_Bg1},
    {type:"image", src:s_Bg2},
    {type:"image", src:s_Bg3},
    {type:"image", src:s_BeamBeam},
    {type:"image", src:s_BeamEffect},
    {type:"image", src:s_BeamGenerator},
    //plist

    //fnt

    //tmx

    //audio ressources
    //bgm
    {type:"bgm", src:m_MenuBg},
    {type:"bgm", src:m_ScoreBg},
    {type:"bgm", src:m_FightBg},
    
    //effect
    {type:"effect", src:m_Collide},
    {type:"effect", src:m_Dead}
];