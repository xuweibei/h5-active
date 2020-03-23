const position=[    //三维数组: 不同行的x相等， y加109；同一行的y相等，x加109 用来定义单元格的位置
  [['0','0'],['109px','0'],['218px','0'],['327px','0']],
  [['0','109px'],['109px','109px'],['218px','109px'],['327px','109px']],
  [['0','218px'],['109px','218px'],['218px','218px'],['327px','218px']],
  [['0','327px'],['109px','327px'],['218px','327px'],['327px','327px']]
]
function getNumberBackgroundColor(number) {
  switch (number) {
    case 2:
      return "#eee4da";
    case 4:
      return "#eee4da";
    case 8:
      return "#f26179";
    case 16:
      return "#f59563";
    case 32:
      return "#f67c5f";
    case 64:
      return "#f65e36";
    case 128:
      return "#edcf72";
    case 256:
      return "#edcc61";
    case 512:
      return "#9c0";
    case 1024:
      return "#3365a5";
    case 2048:
      return "#09c";
    case 4096:
      return "#a6b";
    case 8192:
      return "#93c";
  }
  return "black";
}


//随机生成两个元素
function createNum() {
     let items = document.getElementsByClassName('grid-cell');   //获取所有单元格
     let itemPosition = null;
     let arr = [2,2,4];
     let container = document.querySelector('.tile-container'); //获取生成数字的最外层div
     let tile = document.createElement('div');  //生成单个数字外层的div
     let tile_inner = document.createElement('div');  //生成单个数字最内层的div
     tile.className = 'tile';
     tile_inner.className = 'tile-inner'; //单元格内层的div的类名
     let itemValue = arr[getRandomNumber(0,2)];   //生成元素的值
     itemPosition = items[getRandomNumber(0, items.length-1)];  // 生成元素的位置
      //如果生成的元素位置上已经是非空的了，就重新生成
     while(itemPosition.classList.contains('nonEmptyItem')) {
        itemPosition = items[getRandomNumber(0, items.length-1)];  // 生成元素的位置
     }
     itemPosition.classList.remove('emptyItem');   //删除空元素的标志
     itemPosition.classList.add('nonEmptyItem');   //添加非空元素的标志
     let x = itemPosition.getAttribute('x')-0;  //生成元素的x坐标
     let y = itemPosition.getAttribute('y')-0;   //生成元素的y轴坐标
     tile.style.top = position[x][y][1];   //单元格绝对定位的位置，随机
     tile.style.left = position[x][y][0];
     tile.setAttribute('data-pos', x + ',' + y + ',' + itemValue); //给tiles添加位置标识
     tile_inner.innerHTML = itemValue.toString();   //初始生成的数字为2
     tile_inner.style.backgroundColor = getNumberBackgroundColor(itemValue);  //设置数字所在单元格的颜色
     tile.appendChild(tile_inner);   //给单元格的外层div tile 追加内层子元素div tile_inner
     container.appendChild(tile);    //将单元格追加到最大的div 上
}

//获取 [min, max] 中随机的整数
function getRandomNumber(min, max) {
    return min + Math.floor(Math.random()*(max-min+1));
}

   //元素移动
   function remove(dire) {
       let nonEmptyItems = document.getElementsByClassName('nonEmptyItem');  //获取所有的非空元素 
       if (dire == 'left' || dire == 'up') {

           //如果按下的方向是左或上，则正向遍历非空元素
        for (let i = 0; i < nonEmptyItems.length; i++) {
            let currentItem = nonEmptyItems[i];
            removeItem(currentItem, dire);
        }
    } else if (dire == 'right' || dire == 'bottom') {//如果按下的方向是右或下，则反向遍历非空元素
        for (let i = nonEmptyItems.length - 1; i >= 0; i--) {
             let currentItem = nonEmptyItems[i];
             removeItem(currentItem, dire);
        }
    }
   }
 
   //单个元素移动
   function removeItem(item, dire) {
     console.log('removeItemremoveItemremoveItem');
       //当前元素的X和y
       let itemX = item.getAttribute('x')-0;
       let itemY = item.getAttribute('y')-0;
        //获取相邻元素
       let sideItem = getSideItem(item, dire);

        //获取所有的tile
       let els = document.querySelectorAll('.tile');
       let container = document.querySelector('.tile-container');  //获取最外层的div
       let posArray = [];  //定义一个数组，用来存放一个单元格
         //如果当前元素不在最右边上
       if(sideItem.length) {  
        let sideItemX = sideItem[0].getAttribute('x')-0;
        let sideItemY = sideItem[0].getAttribute('y')-0;
            //当前元素不在最后一个且左（右、上、下）侧元素是空元素
            if(sideItem[0].classList.contains('emptyItem')) {
               sideItem[0].classList.remove('emptyItem'); //相邻元素清除空标志
               sideItem[0].classList.add('nonEmptyItem');  //相邻元素添加非空标志
               item.classList.remove('nonEmptyItem'); //当前元素清除非空标志
               item.classList.add('emptyItem');  //当前元素添加空标志 
               item.value=0; //当前元素的value置零
               for (let i = 0; i < els.length; i++) {
                   posArray= els[i].dataset.pos.split(',');    //将每一个单元格的位置以二维数组的形式放置在posArray中
                   if(posArray[0] == itemX && posArray[1] == itemY) {  //找到需要移动的tile
                      els[i].style.top = position[sideItemX][sideItemY][1];  //改变tile的绝对定位，让它移动
                      els[i].style.left = position[sideItemX][sideItemY][0];
                      els[i].dataset.pos = sideItemX + ',' + sideItemY + ',' + posArray[2];
                      i=0;
                      break;
                    }
                  }
                  removeItem(sideItem[0], dire);
            } else{ //当前元素不在最后一个且左（右、上、下）侧元素是非空元素
                 let currentValue = getTile(item); //当前位置的值和索引
                 let sideItemValue = getTile(sideItem[0]);   //相邻位置
                  if(currentValue[1] === sideItemValue[1]) {
                    let currentIndex = currentValue[0];
                    let sideItemIndex = sideItemValue[0];
                    let tileInner = els[currentIndex].firstElementChild;  //获取tiles的子元素 tile_inner
                    let score = currentValue[1]*2;
                    let singleScore = document.getElementById('singleScore').innerHTML -0;
                    let highestScore = document.getElementById('highestScore').innerHTML -0;
                    singleScore += score*10;
                    if(singleScore>highestScore){
                      highestScore = singleScore;
                    }                   
                    document.getElementById('singleScore').innerHTML = singleScore;  //单次叠加获得的分数
                    document.getElementById('highestScore').innerHTML = highestScore;  //单次叠加获得的分数
                    localStorage.highestScore = highestScore;   //将最高分存到本地的localStorage中
                    item.classList.remove('nonEmptyItem'); //当前元素清除非空标志
                    item.classList.add('emptyItem');  //当前元素添加空标志 
                    container.removeChild(els[sideItemIndex]);  //删除这个相邻元素
                    els[currentIndex].style.top = position[sideItemX][sideItemY][1];
                    els[currentIndex].style.left = position[sideItemX][sideItemY][0];
                    els[currentIndex].dataset.pos = sideItemX + ',' + sideItemY + ',' + score;  
                    els[currentIndex].firstElementChild.innerHTML = score; 
                    tileInner.style.backgroundColor = getNumberBackgroundColor(score);  //设置元素的颜色 
                    return
                  }
            }
       }
   }

   //获取单元格上面对应的tiles
   function getTile(item) {
       //获取所有的tile
    let els = document.querySelectorAll('.tile');
    let itemX = item.getAttribute('x')-0;
    let itemY = item.getAttribute('y')-0; 
    let currentValue = [];  //当前位置的值和索引
    for (let i = 0; i < els.length; i++) {
        posArray= els[i].dataset.pos.split(',');    //将每一个单元格的位置以二维数组的形式放置在posArray中
        if(posArray[0] == itemX && posArray[1] == itemY) {  //找到需要移动的tile
            currentValue = [i,posArray[2]-0];
            i=0;
          break;
        }
      } 
    return currentValue;
   }

   //获取相邻的元素
   function getSideItem(item, dire) {
     //当前元素的X和y
    let itemX = item.getAttribute('x')-0;
    let itemY = item.getAttribute('y')-0;
     if(dire === 'left') {
        sideItemX = itemX;
        sideItemY = itemY-1;
     }else if(dire === 'right') {
      sideItemX = itemX;
      sideItemY = itemY+1;
     }else if(dire === 'up') {
      sideItemX = itemX-1;
      sideItemY = itemY;
     }else if(dire === 'bottom') {
      sideItemX = itemX+1;
      sideItemY = itemY;
     }
     let sideItem = document.getElementsByClassName('x'+sideItemX+'y'+sideItemY);
     return sideItem;
   }

   //判断游戏是否结束
   function isGameOver() {
    //获取所有元素
    let items = document.getElementsByClassName('grid-cell');  //获取所有的元素 
    let tiles = document.querySelectorAll('.tile'); //获取所有tile
    //获取所有非空元素
    let nonEmptyItems = document.getElementsByClassName('nonEmptyItem');  //获取所有的非空元素 
    if (items.length == nonEmptyItems.length) {//所有元素的个数 == 所有非空元素的个数  即没有空元素
        //遍历所有非空元素
        for (var i = 0; i < nonEmptyItems.length; i++) {
            var currentItem = nonEmptyItems[i];
            if (getSideItem(currentItem, 'up').length != 0 && getTile(currentItem)[1] ==getTile(getSideItem(currentItem, 'up')[0])[1]) {
                //上边元素存在 且 当前元素中的内容等于上边元素中的内容
                 console.log('upupupupupu')
                return false;
            } else if (getSideItem(currentItem, 'bottom').length != 0 && getTile(currentItem)[1] == getTile(getSideItem(currentItem, 'bottom')[0])[1]) {
                //下边元素存在 且 当前元素中的内容等于下边元素中的内容
                console.log('bottombottombottom')
                return false;
            } else if (getSideItem(currentItem, 'left').length != 0 && getTile(currentItem)[1]  == getTile(getSideItem(currentItem, 'left')[0])[1]) {
                //左边元素存在 且 当前元素中的内容等于左边元素中的内容
                console.log('leftleftleft')
                return false;
            } else if (getSideItem(currentItem, 'right').length != 0 && getTile(currentItem)[1] == getTile(getSideItem(currentItem, 'right')[0])[1]) {
                //右边元素存在 且 当前元素中的内容等于右边元素中的内容
                console.log('rightrightright')
                return false;
            }
        }
    } else {
       return false;
  }
  console.log('满了满了满了')
  for (let i = 0; i < tiles.length; i++) {
    setTimeout(() => {
      tiles[i].style.transform = 'scale3d(0, 0, 0)';
    }, 180 * i);
  }
  // TODO 处理游戏结束
  setTimeout(() => {
    tileContainer.innerHTML = '';
  }, 30000);
  let cells = document.getElementsByClassName('grid-cell');  //获取所有的元素 
//   document.getElementById('singleScore').innerHTML = 0;  //单次叠加获得的分数
//   let highestScore = 0;
//   if (localStorage.highestScore) {
//     highestScore = localStorage.highestScore - 0;
// }
//   document.getElementById('highestScore').innerHTML = highestScore;  //单次叠加获得的分数
  for (var i = 0; i < cells.length; i++) {
    cells.classList.remove('nonEmptyItem'); //当前元素清除非空标志
   if(!cells[i].classList.contains('emptyItem')){
    cells.classList.add('emptyItem');  //当前元素添加空标志 
   }
}
  return true;
    }


    function debouce(func, delay, immediate) {
      let timer = null;
      return function () {
        let context = this;
        let args = arguments;
        if (timer) {
          clearTimeout(timer);
        }
        if (immediate) {
          let doNow = !timer;
          timer = setTimeout(() => {
            timer = null;
          }, delay);
          if (doNow) {
            func.apply(context, args);
          }
        } else {
          timer = setTimeout(() => {
            func.apply(context, args);
          }, delay);
        }
      }
    }
    
window.onload = () => {

  let highestScore = 0;
  if (localStorage.highestScore) {
    highestScore = localStorage.highestScore - 0;
}
  document.getElementById('highestScore').innerHTML = highestScore;  //最高分
    // 初始化界面，生成两个元素 2或4
  createNum();
  createNum();
  let newGame = document.querySelector('#new-game');   //获取重新开始游戏的按钮
  let cells = document.getElementsByClassName('grid-cell');  //获取所有的元素 
  let tileContainer = document.querySelector('.tile-container');  
  newGame.onclick = debouce((e) => {
    console.log('新游戏新游戏')
    // 首先删除tile-container的所有子元素
    // 其次，随机生成两个 2 的元素方块
    //将分数置0
    document.getElementById('singleScore').innerHTML = 0;  //单次叠加获得的分数

    tileContainer.innerHTML = '';
    for (var i = 0; i < cells.length; i++) {
           cells[i].classList.remove('nonEmptyItem'); //当前元素清除非空标志
          if(!cells[i].classList.contains('emptyItem')){
            cells[i].classList.add('emptyItem');  //当前元素添加空标志 
          }
    }
    console.log(cells)
    createNum();
    createNum();
  }, 500, true);
  //键盘事件
  document.onkeyup = (e) => {
         let result = isGameOver();
         console.log('result', result);
      if(!result) {
        console.log('继续继续行就行')
        switch(e.keyCode) {
          case 37: {
            remove('left');
            break;
          }
          case 38: {
            remove('up');
            break;
          }
          case 39: {
            remove('right');
            break;
          }
          case 40: {
            remove('bottom');
            break;
          }
        }   
        if ([37, 38, 39, 40].indexOf(e.keyCode) !== -1) {
          console.log('[37, 38, 39, 40].indexOf(e.keyCode) !== -1)');
          setTimeout(() => {
            createNum();
          }, 400);
        }
      } 
  }
}

