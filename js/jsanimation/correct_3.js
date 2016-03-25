 var iCurrentIndex = 0;
 var originalTimer = null;
 var left = 0; //若left=1,表示oDivLeft.onclick事件触发
 var iClickIndex = null; //表示oSmallLi[i].onlclick事件时的索引i


 var oALeft = getByClass("mark_left")[0];
 var oARight = getByClass("mark_right")[0];
 var oDivLeft = getByClass("prev")[0];
 var oDivRight = getByClass("next")[0];
 var oInfoLeft = getByClass('text')[0];
 var oInfoRight = getByClass('progressor')[0];

 var aBigLi = getByClass("big_pic")[0].getElementsByTagName("li");
 var len = aBigLi.length;
 var oSmallUl = getByClass("small_pic")[0].getElementsByTagName("ul")[0]; //注意返回的数组，所以[0]不能丢
 var oSmallLi = oSmallUl.getElementsByTagName("li");
 var oSmallLiFst = oSmallUl.getElementsByTagName("li")[0];
 oSmallLiFst.style.opacity = 1;
 // oSmallLiFst.style.filter = alpha(opacity = 100);

 var g_zIndex = 2;

 var g_aImgInfo = [{
     info: "都市魅力",
     href: 'http://www.miaov.com/'
 }, {
     info: "古香古色",
     href: 'http://www.miaov.com/'
 }, {
     info: "沉浸舞步的舞者",
     href: 'http://www.miaov.com/'
 }, {
     info: "名贵跑车",
     href: 'http://www.miaov.com/'
 }, {
     info: "聆听天籁的精灵",
     href: 'http://www.miaov.com/'
 }, {
     info: "绚彩光芒",
     href: 'http://www.miaov.com/'
 }];
 // 工具函数，根据class获取元素
 function getByClass(sClassName) {
     var aEle = document.getElementsByTagName('*');
     var aResult = [];
     for (var i = 0; i < aEle.length; i++) {
       
         if (aEle[i].className && aEle[i].className.search(sClassName) != -1) {
             aResult.push(aEle[i]);
         }
     }
     return aResult;
 }

 window.onload = function() {

     /*注册事件*/
     // 左右的箭头按钮淡入淡出事件
     oDivLeft.onmouseover = oALeft.onmouseover = function() {
         startMove(oDivLeft, 100, 'opacity');
         stopAllMove();
     }
     oDivLeft.onmouseout = oALeft.onmouseout = function() {
         startMove(oDivLeft, 0, 'opacity');
         autoMove();
     }
     oDivRight.onmouseover = oARight.onmouseover = function() {
         startMove(oDivRight, 100, 'opacity');
         stopAllMove();
     }
     oDivRight.onmouseout = oARight.onmouseout = function() {
         startMove(oDivRight, 0, 'opacity');
         autoMove();
     }
     oSmallUl.onmouseover = function() {
         stopAllMove();
     }
     oSmallUl.onmouseout = function() {
             autoMove();
         }
         //oSmallLi的移入移出事件
     for (var i = 0; i < len; i++) {
         oSmallLi[i].index = i; //为对象注册索引属性
         oSmallLi[i].onmouseover = function(event) {
             event = event || window.event;
             event.preventDefault();
             if (this.index != iCurrentIndex) {
                 startMove(this, 100, 'opacity');
             }
         }
         oSmallLi[i].onmouseout = function(event) {
             event = event || window.event;
             event.preventDefault();
             if (this.index != iCurrentIndex) {
                 startMove(this, 60, 'opacity');
             }
         }
         oSmallLi[i].onclick = function(event) {
             event = event || window.event;
             event.preventDefault();
             if (this.index != iCurrentIndex) {
                 iClickIndex = this.index
                 startBigPicMove(aBigLi, 320, 'height');
                 startOpacityMove(oSmallLi, 100, 'opacity');
                 startSmallPicMove(oSmallUl, 130, 'left');

                 iCurrentIndex = iClickIndex;
                 iClickIndex = null;
             }


         }
     }

     // 左箭头点击事件
     oDivLeft.onclick = function(event) {
         event = event || window.event;
         event.preventDefault();
         left = 1;
         startBigPicMove(aBigLi, 320, 'height');
         startOpacityMove(oSmallLi, 100, 'opacity');
         startSmallPicMove(oSmallUl, 130, 'left');

         iCurrentIndex = getNextIndex(iCurrentIndex, len);
         left = 0;
     };
     // 右箭头点击事件
     oDivRight.onclick = function(event) {
         event = event || window.event;
         event.preventDefault();

         startBigPicMove(aBigLi, 320, 'height');
         startOpacityMove(oSmallLi, 100, 'opacity');
         startSmallPicMove(oSmallUl, 130, 'left');

         iCurrentIndex = getNextIndex(iCurrentIndex, len);
     };

     //自动播放
     autoMove();

 }

 // 自动播放
 function autoMove() {
     /*包括三项运动
       第一项运动：大图运动，
       第二项运动：小图运动，
                  小图运动包括图片透明度运动和图片透明度运动
       第三项运动：文字运动，
       注意：三项运动通过全局变量iCurrentIndex,协同操作
            当鼠标移入整个区域，自动播放停止
            当移出时，自动播放继续，并且是从当前页面继续
       这里有个问题就是如果是第三个函数分别去运行，势必会导致时间差，最后导致执行不协同，所以做以下调整:
       这三个函数每次只执行动作一次
              */
     clearInterval(originalTimer);
     originalTimer = setInterval(function() {

         startBigPicMove(aBigLi, 320, 'height');
         startOpacityMove(oSmallLi, 100, 'opacity');
         startSmallPicMove(oSmallUl, 130, 'left');

         iCurrentIndex = getNextIndex(iCurrentIndex, len);
     }, 3000)

 }

 function stopAllMove() {

     clearInterval(originalTimer);

 }

 function startBigPicMove(aEle, iTarget, attr) {
     /*startMove(obj,iTarget,attr)
     由于本例中大图变化，他的对象是发生变化，并且是两个属性发生变化，高度与index，所以需要简单包装*/
     var iNextIndex = getNextIndex(iCurrentIndex, len);
     var obj = aEle[iNextIndex];
     obj.style[attr] = 0;

     g_zIndex++
     obj.style.zIndex = g_zIndex;
     startMove(obj, iTarget, attr);

     startCommentMove(oInfoLeft, oInfoRight, g_aImgInfo);

 }
 /*工具函数：获取下一个索引*/
 function getNextIndex(iCurrentIndex, len) {
     if (iClickIndex || iClickIndex === 0) return iClickIndex;
     else return left ? (iCurrentIndex + 5) % len : (iCurrentIndex + 1) % len;
 }

 function startCommentMove(oInfoLeft, oInfoRight, aInfo) {
     var iNextIndex = getNextIndex(iCurrentIndex, len);
     oInfoLeft.innerHTML = aInfo[iNextIndex].info;
     oInfoRight.innerHTML = (iNextIndex + 1) + "/6";
 }


 function startSmallPicMove(obj, distance, attr) {
     var iTarget = getTarget(obj, distance, attr);
     startMove(obj, iTarget, attr);
 }

 /*工具函数，获取每次运动的目标*/
 function getTarget(obj, distance, attr) {
     var iTarget = 0;
     var nextIndex = getNextIndex(iCurrentIndex, len);
     if (nextIndex == 0 || nextIndex == 1) iTarget = 0;
     else if (1 < nextIndex && nextIndex < 5) iTarget = -(nextIndex - 1) * distance;
     else if (nextIndex == 5) iTarget = -3 * distance;
     return iTarget;

 }

 function startOpacityMove(aEle, iTarget, attr) {
     var len = aEle.length;
     var iNextIndex = getNextIndex(iCurrentIndex, len);
     startMove(aEle[iCurrentIndex], 60, attr);
     startMove(aEle[iNextIndex], iTarget, attr);
 }
