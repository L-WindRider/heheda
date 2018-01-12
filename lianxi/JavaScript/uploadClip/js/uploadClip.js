var uploadClip = window.uploadClip || {};
uploadClip = {
    left: 0,
    top: 0,
    scaleVal: 1,    //缩放
    rotateVal: 0,   //旋转
    curStatus: 0,   //记录当前手势的状态, 0:拖动, 1:缩放, 2:旋转
    ydx:0,//记录移动X坐标
    ydy:0,//记录Y坐标
    deviation:0,//定义图片居中偏移值
    circleRadius:window.innerWidth*560/750/2,//圆半径
    circleDiameter:window.innerWidth*560/750,//圆的直径
    circleX:window.innerWidth/2-window.innerWidth*560/750/2,//圆形X坐标
    circleY:window.innerHeight/2-window.innerWidth*560/750/2,//圆形Y坐标
    clipImgW:0,//图片最初显示宽度
    clipImgH:0,//图片最初显示高度
    //初始化
    init: function (clipDivCover,clipImg) {
        touch.on(clipDivCover, 'touchstart', function (ev) {
            uploadClip.curStatus = 0;
            ev.preventDefault();//阻止默认事件
        });
        clipImg.css({
            left: uploadClip.left,
            top: uploadClip.top,
            'transform': 'scale(' + uploadClip.scaleVal + ')'
        });
    },

    //拖动
    drag: function (clipDivCover,clipImg) {
        touch.on(clipDivCover, 'drag', function (ev) {
            uploadClip.ydx=uploadClip.left + ev.x;
            uploadClip.ydy=uploadClip.top + ev.y;
            if(uploadClip.ydx>uploadClip.circleX+(uploadClip.clipImgW*uploadClip.scaleVal-uploadClip.clipImgW)/2 && ev.x>0){
                uploadClip.ydx=uploadClip.left;
                uploadClip.ydy=uploadClip.top;
                return;
            }
            else if(uploadClip.ydy>uploadClip.circleY+(uploadClip.clipImgH*uploadClip.scaleVal-uploadClip.clipImgH)/2 && ev.y>0){
                uploadClip.ydx=uploadClip.left;
                uploadClip.ydy=uploadClip.top;
                return;
            }
            else if(uploadClip.ydx < uploadClip.circleX + uploadClip.circleDiameter-(uploadClip.clipImgW*uploadClip.scaleVal-uploadClip.clipImgW)/2-uploadClip.clipImgW&&ev.x<0){
                uploadClip.ydx=uploadClip.left;
                uploadClip.ydy=uploadClip.top;
                return;
            }
            else if(uploadClip.ydy < uploadClip.circleY + uploadClip.circleDiameter-(uploadClip.clipImgH*uploadClip.scaleVal-uploadClip.clipImgH)/2-uploadClip.clipImgH&&ev.y<0){
                uploadClip.ydx=uploadClip.left;
                uploadClip.ydy=uploadClip.top;
                return;
            }
            clipImg.css("left", uploadClip.ydx).css("top", uploadClip.ydy);
        });
        touch.on(clipDivCover, 'dragend', function (ev) {
             uploadClip.left =uploadClip.ydx;
             uploadClip.top =uploadClip.ydy;
        });
    },
    //缩放
    scale: function (clipDivCover,clipImg) {
        var initialScale = uploadClip.scaleVal || 1;
        var currentScale;
        touch.on(clipDivCover, 'pinch', function (ev) {
            if (uploadClip.curStatus == 10) {
                return;
            }
            uploadClip.curStatus = 1;
            currentScale = ev.scale - 1;
            currentScale = initialScale + currentScale;
            if(uploadClip.ydx>uploadClip.circleX+(uploadClip.clipImgW*uploadClip.scaleVal-uploadClip.clipImgW)/2&&uploadClip.scaleVal>currentScale){
                return;
            }
            else if(uploadClip.ydy>uploadClip.circleY+(uploadClip.clipImgH*uploadClip.scaleVal-uploadClip.clipImgH)/2&&uploadClip.scaleVal>currentScale){
                return;
            }
            else if(uploadClip.ydx < uploadClip.circleX + uploadClip.circleDiameter-(uploadClip.clipImgW*uploadClip.scaleVal-uploadClip.clipImgW)/2-uploadClip.clipImgW&&uploadClip.scaleVal>currentScale){
                return;
            }
            else if(uploadClip.ydy < uploadClip.circleY + uploadClip.circleDiameter-(uploadClip.clipImgH*uploadClip.scaleVal-uploadClip.clipImgH)/2-uploadClip.clipImgH&&uploadClip.scaleVal>currentScale){
                return;
            }
            uploadClip.scaleVal = currentScale;
            var transformStyle = 'scale(' + uploadClip.scaleVal + ')';
            clipImg.css("transform", transformStyle);
        });

        touch.on(clipDivCover, 'pinchend', function (ev) {
            if (uploadClip.curStatus == 2) {
                return;
            }
            initialScale = currentScale;
            uploadClip.scaleVal = currentScale;
        });
    },
};