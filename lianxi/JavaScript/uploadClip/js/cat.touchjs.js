/*
* author: www.somethingwhat.com
*/
var cat = window.cat || {};
cat.touchjs = {
    left: 0,
    top: 0,
    scaleVal: 1,    //缩放
    rotateVal: 0,   //旋转
    curStatus: 0,   //记录当前手势的状态, 0:拖动, 1:缩放, 2:旋转
    ydx:0,//移动X
    ydy:0,
    //初始化
    init: function (clipDivCover,clipImg, callback) {
        touch.on(clipDivCover, 'touchstart', function (ev) {
            cat.touchjs.curStatus = 0;
            ev.preventDefault();//阻止默认事件
        });
        callback(0, 0, 1, 0);
    },
    //判断是否可以执行
    Continue:function(ev){
        if(cat.touchjs.ydx>circleX+(clipImgW*cat.touchjs.scaleVal-clipImgW)/2 && ev.x>0){
            return false;
        }
        else if(cat.touchjs.ydy>circleY+(clipImgH*cat.touchjs.scaleVal-clipImgH)/2 && ev.y>0){
            return false;
        }
        else if(cat.touchjs.ydx < circleX + circleRadius * 2-(clipImgW*cat.touchjs.scaleVal-clipImgW)/2-clipImgW&&ev.x<0){
            return false;
        }
        else if(cat.touchjs.ydy < circleY + circleRadius * 2-(clipImgH*cat.touchjs.scaleVal-clipImgH)/2-clipImgH&&ev.y<0){
            return false;
        }
        return true;
    },

    //拖动
    drag: function (clipDivCover,clipImg, callback) {
        console.log("拖动");
        touch.on(clipDivCover, 'drag', function (ev) {
            cat.touchjs.ydx=cat.touchjs.left + ev.x;
            cat.touchjs.ydy=cat.touchjs.top + ev.y;
            console.log(cat.touchjs.left,ev.x,cat.touchjs.top,ev.y,ev);
            var continu=cat.touchjs.Continue(ev);
            if(continu){
                clipImg.css("left", cat.touchjs.ydx).css("top", cat.touchjs.ydy);
            }else{
                cat.touchjs.ydx=cat.touchjs.left;
                cat.touchjs.ydy=cat.touchjs.top;
            }
            // clipImg.css("left", ydx).css("top", ydy);
        });
        touch.on(clipDivCover, 'dragend', function (ev) {
             cat.touchjs.left =cat.touchjs.ydx;
             cat.touchjs.top =cat.touchjs.ydy;
             callback(cat.touchjs);
        });
    },
    //缩放
    scale: function (clipDivCover,clipImg, callback) {
        var initialScale = cat.touchjs.scaleVal || 1;
        var currentScale;
        touch.on(clipDivCover, 'pinch', function (ev) {
            if (cat.touchjs.curStatus == 10) {
                return;
            }
            cat.touchjs.curStatus = 1;
            currentScale = ev.scale - 1;
            currentScale = initialScale + currentScale;
            cat.touchjs.scaleVal = currentScale;
            var transformStyle = 'scale(' + cat.touchjs.scaleVal + ')';
            clipImg.css("transform", transformStyle).css("-webkit-transform", transformStyle);
            callback(cat.touchjs);
        });

        touch.on(clipDivCover, 'pinchend', function (ev) {
            if (cat.touchjs.curStatus == 2) {
                return;
            }
            initialScale = currentScale;
            cat.touchjs.scaleVal = currentScale;
            callback(cat.touchjs);
        });
    },
};