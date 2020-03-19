//1.1声明全局变量
var can1,can2,ctx1,ctx2,canWidth,canHeigh,bgImg,ane, mom, baby, fruit, dust, data, halo, wave;
var lastTime;//上一帧被执行的时间
var deltaTime;//二帧间隔的时间差
var mx, my;
// const DEBUG = true;
//入口
function game(){
    init();
    gameloop();
}
//创建所有的对象
function init(){
    can1=document.getElementById('canvas1')
    ctx1=can1.getContext('2d')
    can2=document.getElementById('canvas2') 
    ctx2=can2.getContext('2d') 
    //获取画布高宽
    canWidth=can2.width;
    canHeigh=can2.height;
    //创建背景对象并下载
    bgImg=new Image();  
    bgImg.src='src/background.jpg'; 
    lastTime = Date.now();   
    deltaTime = 0;   

    //创建对象并初始化
    ane=new aneObj(); 
    ane.init(); 

    mom = new momObj();
    mom.init();

    baby = new babyObj();
    baby.init();

    fruit = new fruitObj();
    fruit.init();

    dust = new dustObj();
    dust.init();

    data = new dataObj();

    halo = new haloObj();
    halo.init();

    wave = new waveObj();
    wave.init();

    mx = canWidth * 0.5;
    my = canHeigh * 0.5;
    can1.addEventListener("mousemove",onMouseMove,false);//false为事件冒泡阶段执行函数，true为事件捕获阶段执行
};
//绘制所有角色
// function gameloop(){
//     requestAnimFrame(gameloop);
//     //绘制背景图片函数
//     draw();
//     //绘制海葵
//     ane.draw();
// };
function gameloop(){
    requestAnimFrame(gameloop);//绘制一个图片，跟据机器的性能，选择下一次(最佳)绘制时间
    // console.log("loop 测试是否成功");  
    
    
    var now  = Date.now();         //计算二帧之间一共执行了多长时间 
    deltaTime = now - lastTime;   
    lastTime = now;               
    if(deltaTime>40) deltaTime = 40;

    //console.log(deltaTime);     //不同的浏览器计算结果不一致
    drawBackground();
    ctx1.clearRect(0,0,canWidth,canHeigh);
    ane.draw();
    mom.draw();
    baby.draw();
    fruitMonitor();
    fruit.draw();
    dust.draw();
    data.draw();
    momFruitsCollision();
    momBabyCollision();
    halo.draw();
    wave.draw();
}
function onMouseMove(e){
    //游戏结束，鼠标不能控制大鱼
    if(data.gameOver){return;}

    if(e.offsetX || e.layerX){//e.offsetX和e.layerX是相对当前坐标系的坐标的兼容性写法
      mx = e.offsetX == undefined ? e.layerX : e.offsetX;
    }
    if(e.offsetY || e.layerY){
     my = e.offsetY == undefined ? e.layerY : e.offsetY;
    }
    // console.log(mx,my)
         
}
window.onload=game;//绑定一个函数