const position=[    //三维数组: 不同行的x相等， y加109；同一行的y相等，x加109 用来定义单元格的位置
  [['0','0'],['109px','0'],['218px','0'],['327px','0']],
  [['0','109px'],['109px','109px'],['218px','109px'],['327px','109px']],
  [['0','218px'],['109px','218px'],['218px','218px'],['327px','218px']],
  [['0','327px'],['109px','327px'],['218px','327px'],['327px','327px']]
]

//生成数字的背景颜色
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

//生成数字所在的位置
function getNumberPosition() {
  let x = position[0].length;   // position列的下标
  let y = position.length;    //  position行的下标
  let tiles = document.querySelectorAll('.tile');  //获取单元格的位置
  console.log('tiles', tiles, tiles.length);
  let randomX = Math.floor(Math.random()*x);  //生成随机的[0,3] 的整数(三维数组position是一个四行四列的数组)；用来决定随机生成的元素所属的行
  let randomY = Math.floor(Math.random() *y);  //生成随机的[0,3] 的整数；用来决定随机生成的元素所属的列
  if (tiles.length === 16) {   //如果单元格占满16格，返回[6,6]
    return [6, 6];
  }
  //遍历每一个生成的数字所在的位置是否和新生成的数字所在的位置相等
  for (let i = 0; i < tiles.length; i++) {
    let pos = tiles[i].dataset.pos.slice(0, 3);   //获取旧元素所在的位置  tiles[i].dataset.pos存放{a, b,c}  保存了元素的位置信息以及数字的大小,a,b决定位置信息。c表示数字
    if (pos === randomX + ',' + randomY) {    //判断旧的元素的x和y轴是否和新元素的相等
      randomX = Math.floor(Math.random() * x);   //如果相等则重新生成随机的x,和y
      randomY = Math.floor(Math.random() * y);
      i = -1;    //将i=-1再次遍历重新生成的随机数是否有和旧元素重合的
    }
  }
  return [randomX, randomY];   //返回生成的随机数（用来决定元素的位置）
}



//页面加载完成生成两个随机的初始值
var createNum = function(num=2) {
  let container = document.querySelector('.tile-container');  //获取生成数字的最外层div
  let tile = document.createElement('div');  //生成单个数字外层的div
  let tile_inner = document.createElement('div');  //生成单个数字最内层的div
  let pos = getNumberPosition();  //获取生成数字所在的位置
  if (pos[0] > 3) {   //pos[0]的范围在[0,3]之间
    return false;
  }
  tile_inner.innerHTML = num.toString();   //初始生成的数字为2
  tile_inner.style.backgroundColor = getNumberBackgroundColor(num);  //设置数字所在单元格的颜色
  tile.className = 'tile';   //单元格外层div tile的类名
  tile.style.top = position[pos[0]][pos[1]][0];   //单元格绝对定位的位置，随机
  tile.style.left = position[pos[0]][pos[1]][1];
  //setAttribute给单元格添加最外层div tile添加属性data-pos，可以看到元素的位置以及数字的大小
  tile.setAttribute('data-pos', pos + ',' + num);
  tile_inner.className = 'tile-inner'; //单元格内层的div的类名
  tile.appendChild(tile_inner);   //给单元格的外层div tile 追加内层子元素div tile_inner
  container.appendChild(tile);    //将单元格追加到最大的div 上
  return true;
}

//键盘事件执行的函数，元素位置和数值的改变
function operateEvent(rank = 0, dire = 0) {
  let els = document.querySelectorAll('.tile');
  let container = document.querySelector('.tile-container');
  let posArray = [];  //定义一个数组，用来存放每一个单元格
  let needCharge = [];   //定义一个数组，
  let nowPos;  //用来存放临时的 els[i].dataset.pos
  let flag = true;
  for (let i = 0; i < els.length; i++) {
    posArray.push(els[i].dataset.pos.split(','));    //将每一个单元格的位置以二维数组的形式放置在posArray中
  }
  for (let i = 0; i < els.length; i++) {
    nowPos = els[i].dataset.pos.split(',');   //依次循环将数组里 的第i项赋值给 nowPos
    for (let j = 0; j < posArray.length; j++) {
      if (posArray[j][rank] === nowPos[rank]) {   //键决定rank的值: 上下键rank===0,左右键rank===1
          needCharge.push(posArray[j]);
      }
    }
    //findIndex方法返回满足条件的数组下标, index为满足条件的数组下标， needCharge是一个二维数组， element这个二维数组里面的一维数组
    let index = needCharge.findIndex((element, index, array) => {
      return element.toString() === nowPos.toString();
    });
    // TODO 融合操作，应该如何处理
    if (dire) {
      // 如果是down和right事件(向下或向右)，并且这个元素和下一个元素的值相等，那么index++(合并);
      if (index > 0 && needCharge[index][2] === needCharge[index - 1][2]) {
          index--;
      }
      index = 3 - index;
    } else {
      // 如果是up和left事件(向左或向右)，那么需要 index--(合并)
      if (index > 0 && needCharge[index][2] === needCharge[index - 1][2]) {
        index--;
      }
    }
    needCharge.splice(0, needCharge.length);   //删除从0开始, needCharge.length个元素；清空数组
    let posArr = els[i].dataset.pos.split(',');
    //上下左右移动的时候改变元素的位置
    if (!rank) {   //上下
      els[i].dataset.pos = nowPos[0] + ',' + index + ',' + posArr[posArr.length - 1];  //上下改变的是y轴, els[i].dataset.pos ={a, b, c}, a控制x轴，b控制y轴， c是元素的值
      els[i].style.top = position[index][nowPos[0]][1];   //上下改变的是y轴+109 ||-109 在position三维数组中不同行的x相同，y增加或减少109px； 取决于index+1 || index-1
    } else {   //左右
      els[i].dataset.pos = index + ',' + nowPos[1] + ',' + posArr[posArr.length - 1];  //左右改变的是x轴
      els[i].style.left = position[nowPos[1]][index][0];   //左右改变的是X轴+109 ||-109 三维数组中同一行的y不变，x增加或减少109px; 取决于index+1 || index-1
    }
    // 移动元素到该位置后，将此位置上原来的元素删除
    for (let j = 0; j < els.length; j++) {
      if (els[j].dataset.pos === els[i].dataset.pos && i !== j) {
        container.removeChild(els[j]);
        let pos = els[i].dataset.pos.split(',');   //获取 els[i].dataset.pos 以数组[a, b, c] 的形式存放
        pos[pos.length - 1] *= 2;  // 分数加倍
        els[i].firstElementChild.innerHTML = pos[pos.length - 1];  //将加倍后的分数放到tiles的子元素 tile_inner 上
        els[i].dataset.pos = pos.toString();  //将新的els[i].dataset.pos重新赋给els[i]
        let tileInner = els[i].firstElementChild;  //获取tiles的子元素 tile_inner
        tileInner.style.backgroundColor = getNumberBackgroundColor(pos[pos.length - 1]);  //设置元素的颜色
        // 重新设置同一列或者同一行元素的位置
        flag = false;
      }
    }
  }
  return flag;
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
  // 初始化界面，生成两个元素 2
  createNum();
  createNum();
  let newGame = document.querySelector('#new-game');   //获取重新开始游戏的按钮
  let tileContainer = document.querySelector('.tile-container');  
  newGame.onclick = debouce((e) => {
    // 首先删除tile-container的所有子元素
    // 其次，随机生成两个 2 的元素方块
    tileContainer.innerHTML = '';
    createNum();
    createNum();
  }, 500, true);
  document.onkeyup = (e) => {
    let code = e.keyCode;
    let tiles = document.querySelectorAll('.tile');
    if (tiles.length === 16) {
      for (let i = 0; i < tiles.length; i++) {
        setTimeout(() => {
          tiles[i].style.transform = 'scale3d(0, 0, 0)';
        }, 180 * i);
      }
      // TODO 处理游戏结束
      setTimeout(() => {
        tileContainer.innerHTML = '';
      }, 30000);
    } else {
      let flag = false;
      switch (code) {
        case 37: {
          // left event
          while (!flag) {
            flag = operateEvent(1);
          }
          break;
        }
        case 38: {
          // top event
          while (!flag) {
            flag = operateEvent();
          }
          break;
        }
        case 39: {
            // right event
          while (!flag) {
            flag = operateEvent(1, 1);
          }
          break;
        }
        case 40: {
          // button event
          while (!flag) {
            flag = operateEvent(0, 1);
          }
          break;
        }
      }
      if ([37, 38, 39, 40].indexOf(code) !== -1) {
        setTimeout(() => {
          createNum();
        }, 400);
      }
    }
  }
};

/*
TODO 解决分数增加问题
TODO 尝试去解决3个2合成一个4的问题
TODO 利用cookie去记录best score
*/
