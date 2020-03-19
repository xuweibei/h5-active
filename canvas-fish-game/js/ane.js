// //创建海葵类
// var aneObj=function(){
//     this.len=[];//海葵高度
//     this.x=[];//海归位置
// }
// aneObj.prototype.num=50;//花魁数量
// //添加方法
// aneObj.prototype.init=function(){
//     for(var i=0;i<this.num;i++){
//         this.len.push(Math.random()*50+200);
//         this.x.push(i*16+Math.random()*20);
//     }
    
// }
// aneObj.prototype.draw=function(){
//     //保存画笔状态
//     ctx2.save();
//     ctx2.strokeStyle='#3b154e'
//     ctx2.globalAlpha=0.6
//     ctx2.lineGap='round'
//     ctx2.lineWidth=20;
//     for(var i=0;i<this.num;i++){
//         ctx2.beginPath();
//         ctx2.moveTo(this.x[i],canHeight)
//         ctx2.lineTo(this.x[i],canHeight-this.len[i])
//         ctx2.stroke();
//     }
//     ctx2.restore();
// }

//海葵类
//所有海葵都在此类中50条
var aneObj = function(){
    //start point,control point,end point
    this.rootx = [];//start point   y值固定在最底部
    this.headx = [];//end point
    this.heady = [];
    this.amp = [];//正浮    (-1~1)
    this.alpha = 0;//正弦函数的角度。。
}
aneObj.prototype.num = 50;//50条海葵...
aneObj.prototype.init = function(){

  var h = canHeigh; 
  for(var i=0;i<this.num;i++){
      //每个海葵，生长的位置随机，比较像自然生长
      this.rootx[i] = i * 16 + Math.random()*20;
      this.headx[i] = this.rootx[i];//如果结束点在中心，是一条笔直线段
      this.heady[i] = canHeigh - 250 + Math.random()*50;
      this.amp[i] = Math.random() * 50 + 50;
  }
}

aneObj.prototype.draw = function(){
   //海葵是随着时间变化的
   this.alpha += deltaTime * 0.0008;
   var l = Math.sin(this.alpha);
   //console.log(l);
   ctx2.save();
   ctx2.strokeStyle = "#3b154e";//填充颜色
   ctx2.globalAlpha = 0.6;//透明度
   ctx2.lineCap = "round";//设置线条的结束端点样式
   ctx2.lineWidth = 20;//线条宽度
   
   for(var i=0;i<this.num;i++){
    ctx2.beginPath();//创建一条路径
    ctx2.moveTo(this.rootx[i],canHeigh);//移动到指定位置
    this.headx[i] = this.rootx[i] + l * this.amp[i];

    ctx2.quadraticCurveTo(this.rootx[i],canHeigh-100,this.headx[i],this.heady[i]);
    //ctx.strokeStyle();
    ctx2.stroke();
   }
   ctx2.restore();
   
}