/***************************加载时执行绑定封装*****************************/
/***************************灯拖拽开始************************/
var isIE = (document.all) ? true : false;
var lh_qjbl = function (id) {
    return "string" == typeof id ? document.getElementById(id) : id;
};
var Class = {
    create: function () {
        return function () { this.initialize.apply(this, arguments); }
    }
}
var Extend = function (destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
}
var Bind = function (object, fun) {
    return function () {
        return fun.apply(object, arguments);
    }
}
var BindAsEventListener = function (object, fun) {
    return function (event) {
        return fun.call(object, Event(event));
    }
}
function Event(e) {
    var oEvent = isIE ? window.event : e;
    if (isIE) {
        oEvent.target = oEvent.srcElement;
        oEvent.pageX = oEvent.clientX + document.documentElement.scrollLeft;
        oEvent.pageY = oEvent.clientY + document.documentElement.scrollTop;
        oEvent.charCode = (oEvent.type == "keypress") ? oEvent.keyCode : 0;
        oEvent.preventDefault = function () { this.returnValue = false; };
        oEvent.detail = oEvent.wheelDelta / (-40);
        oEvent.stopPropagation = function () { this.cancelBubble = true; };
        if (oEvent.type == "mouseout") {
            oEvent.relatedTarget = oEvent.toElement;
        } else if (oEvent.type == "mouseover") {
            oEvent.relatedTarget = oEvent.fromElement;
        }
    }
    return oEvent;
}
var CurrentStyle = function (element) {
    return element.currentStyle || document.defaultView.getComputedStyle(element, null);
}
function addEventHandler(oTarget, sEventType, fnHandler) {
    if (oTarget.addEventListener) {
        oTarget.addEventListener(sEventType, fnHandler, false);
    } else if (oTarget.attachEvent) {
        oTarget.attachEvent("on" + sEventType, fnHandler);
    } else {
        oTarget["on" + sEventType] = fnHandler;
    }
};
function removeEventHandler(oTarget, sEventType, fnHandler) {
    if (oTarget.removeEventListener) {
        oTarget.removeEventListener(sEventType, fnHandler, false);
    } else if (oTarget.detachEvent) {
        oTarget.detachEvent("on" + sEventType, fnHandler);
    } else {
        oTarget["on" + sEventType] = null;
    }
};
//拖放程序
var Drag = Class.create();
Drag.prototype = {
    //拖放对象
    initialize: function (drag, options) {
        this.Drag = lh_qjbl(drag);//拖放对象
        this._x = this._y = 0;//记录鼠标相对拖放对象的位置
        this._marginLeft = this._marginTop = 0;//记录margin
        //事件对象（用于绑定移除事件）
        this._fM = BindAsEventListener(this, this.Move);
        this._fS = Bind(this, this.Stop);
        this.SetOptions(options);
        this.Limit = !!this.options.Limit;
        this.mxLeft = parseInt(this.options.mxLeft);
        this.mxRight = parseInt(this.options.mxRight);
        this.mxTop = parseInt(this.options.mxTop);
        this.mxBottom = parseInt(this.options.mxBottom);
        this.LockX = !!this.options.LockX;
        this.LockY = !!this.options.LockY;
        this.Lock = !!this.options.Lock;
        this.onStart = this.options.onStart;
        this.onMove = this.options.onMove;
        this.onStop = this.options.onStop;
        this._Handle = lh_qjbl(this.options.Handle) || this.Drag;
        this._mxContainer = lh_qjbl(this.options.mxContainer) || null;
        this.Drag.style.position = "absolute";
        //透明
        if (isIE && !!this.options.Transparent) {
            //填充拖放对象
            with (this._Handle.appendChild(document.createElement("div")).style) {
                width = height = "100%"; backgroundColor = "#fff"; filter = "alpha(opacity:0)";
            }
        }
        addEventHandler(this._Handle, "mousedown", BindAsEventListener(this, this.Start));
    },
    //设置默认属性
    SetOptions: function (options) {
        this.options = {//默认值
            Handle: "",//设置触发对象（不设置则使用拖放对象）
            Limit: false,//是否设置范围限制（为true时下面参数有用，可以是负数）
            mxLeft: 0,//左边限制
            mxRight: 9999,//右边限制
            mxTop: 0,//上边限制
            mxBottom: 9999,//下边限制
            mxContainer: "",//指定限制在容器内
            LockX: false,//是否锁定水平方向拖放
            LockY: false,//是否锁定垂直方向拖放
            Lock: false,//是否锁定
            Transparent: false,//是否透明
            onStart: function () { },//开始移动时执行
            onMove: function () { },//移动时执行
            onStop: function () { }//结束移动时执行
        };
        Extend(this.options, options || {});
    },
    //准备拖动
    Start: function (oEvent) {
        if (this.Lock) { return; }
        if (this.Limit) {
            //修正错误范围参数
            this.mxRight = Math.max(this.mxRight, this.mxLeft + this.Drag.offsetWidth);
            this.mxBottom = Math.max(this.mxBottom, this.mxTop + this.Drag.offsetHeight);
            //如果有容器必须设置position为relative来相对定位，并在获取offset之前设置
            !this._mxContainer || CurrentStyle(this._mxContainer).position == "relative" || (this._mxContainer.style.position = "relative");
        }//欢迎来到站长特效网，我们的网址是www.zzjs.net，很好记，zz站长，js就是js特效，d本站收集大量高质量js代码，还有许多广告代码下载。
        //记录鼠标相对拖放对象的位置
        this._x = oEvent.clientX - this.Drag.offsetLeft;
        this._y = oEvent.clientY - this.Drag.offsetTop;
        //记录margin
        this._marginLeft = parseInt(CurrentStyle(this.Drag).marginLeft) || 0;
        this._marginTop = parseInt(CurrentStyle(this.Drag).marginTop) || 0;
        //mousemove时移动，mouseup时停止
        addEventHandler(document, "mousemove", this._fM);
        addEventHandler(document, "mouseup", this._fS);
        if (isIE) {
            //焦点丢失
            addEventHandler(this._Handle, "losecapture", this._fS);
            //设置鼠标捕获
            this._Handle.setCapture();
        } else {
            //焦点丢失
            addEventHandler(window, "blur", this._fS);
            //阻止默认动作
            oEvent.preventDefault();
        };
        //附加程序
        this.onStart();
    },
    //拖动
    Move: function (oEvent) {
        //判断是否锁定
        if (this.Lock) { this.Stop(); return; };
        //清除选择
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        //设置移动参数
        var iLeft = oEvent.clientX - this._x, iTop = oEvent.clientY - this._y;
        //设置范围限制
        if (this.Limit) {
            //设置范围参数
            var mxLeft = this.mxLeft, mxRight = this.mxRight, mxTop = this.mxTop, mxBottom = this.mxBottom;
            //如果设置了容器，再修正范围参数
            if (!!this._mxContainer) {
                mxLeft = Math.max(mxLeft, 0);
                mxTop = Math.max(mxTop, 0);
                mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
                mxBottom = Math.min(mxBottom, this._mxContainer.clientHeight);
            };//欢迎来d到站长特效网，我们的网址是www.zzjs.net，很好记，zz站长，js就是js特效，本站收集大量高质量js代码，还有许多广告代码下载。
            //修正移动参数
            iLeft = Math.max(Math.min(iLeft, mxRight - this.Drag.offsetWidth), mxLeft);
            iTop = Math.max(Math.min(iTop, mxBottom - this.Drag.offsetHeight), mxTop);
        }
        //设置位置，并修正margin
        if (!this.LockX) { this.Drag.style.left = iLeft - this._marginLeft + "px"; }
        if (!this.LockY) { this.Drag.style.top = iTop - this._marginTop + "px"; }
        //附加程序
        this.onMove();
    },
    //停止拖动
    Stop: function () {
        //移除事件
        removeEventHandler(document, "mousemove", this._fM);
        removeEventHandler(document, "mouseup", this._fS);
        if (isIE) {
            removeEventHandler(this._Handle, "losecapture", this._fS);
            this._Handle.releaseCapture();
        } else {
            removeEventHandler(window, "blur", this._fS);
        };
        //附加程序
        this.onStop();
    }
};
//缩放程序
var Resize = Class.create();
Resize.prototype = {
    //缩放对象
    initialize: function (obj, options) {
        this._obj = lh_qjbl(obj);//缩放对象
        this._right = this._down = this._left = this._up = 0;//坐标参数
        this._scale = 1;//比例参数
        this._touch = null;//当前触发对象
        var _style = CurrentStyle(this._obj);
        this._xBorder = (parseInt(_style.borderLeftWidth) || 0) + (parseInt(_style.borderRightWidth) || 0);
        this._yBorder = (parseInt(_style.borderTopWidth) || 0) + (parseInt(_style.borderBottomWidth) || 0);
        //事件对象（用于移除事件）
        this._fR = BindAsEventListener(this, this.Resize);
        this._fS = Bind(this, this.Stop);
        this.SetOptions(options);
        this.Limit = !!this.options.Limit;
        this.mxLeft = parseInt(this.options.mxLeft);
        this.mxRight = parseInt(this.options.mxRight);
        this.mxTop = parseInt(this.options.mxTop);
        this.mxBottom = parseInt(this.options.mxBottom);
        this.minWidth = parseInt(this.options.minWidth);
        this.minHeight = parseInt(this.options.minHeight);
        this.Scale = !!this.options.Scale;
        this.onResize = this.options.onResize;
        this._obj.style.position = "absolute";
    },
    //设置默认属性
    SetOptions: function (options) {
        this.options = {//默认值
            Limit: false,//是否设置限制（为true时下面mx参数有用）
            mxLeft: 0,//左边限制
            mxRight: 9999,//右边限制
            mxTop: 0,//上边限制
            mxBottom: 9999,//下边限制
            //为减少难度设置最小宽高
            minWidth: 50,//最小宽度
            minHeight: 50,//最小高度
            Scale: true,//是否按比例缩放
            onResize: function () { }//缩放时执行
        };
        Extend(this.options, options || {});
    },
    //设置触发对象
    Set: function (resize, side) {
        var resize = lh_qjbl(resize), _fun;
        if (!resize) return;
        //根据方向设置，_fun是缩放时执行的程序
        switch (side.toLowerCase()) {
            case "up":
                _fun = this.Up;
                break;
            case "down":
                _fun = this.Down;
                break;
            case "left":
                _fun = this.Left;
                break;
            case "right":
                _fun = this.Right;
                break;
            case "left-up":
                _fun = this.LeftUp;
                break;
            case "right-up":
                _fun = this.RightUp;
                break;
            case "left-down":
                _fun = this.LeftDown;
                break;
            case "right-down":
            default:
                _fun = this.RightDown;
        };
        //设置触发对象
        //resize.style.cursor = _cursor;
        addEventHandler(resize, "mousedown", BindAsEventListener(this, function (e) {
            this._fun = _fun; this._touch = resize; this.Start(e);
        }));
    },
    //准备缩放
    Start: function (oEvent, o) {
        //防止冒泡
        if (isIE) { oEvent.cancelBubble = true; } else { oEvent.stopPropagation(); }
        //计算样式初始值
        //计算样式初始值
        this.style_width = this._obj.offsetWidth;
        this.style_height = this._obj.offsetHeight;
        this.style_left = this._obj.offsetLeft;
        this.style_top = this._obj.offsetTop;
        this.style_left_width = this.style_width + this.style_left;
        this.style_top_height = this.style_height + this.style_top;
        //计算当前边的对应另一条边的坐标，例如右边缩放时需要左边界坐标
        this._left = oEvent.clientX - this.style_width;
        this._right = oEvent.clientX + this.style_width;
        this._up = oEvent.clientY - this.style_height;
        this._down = oEvent.clientY + this.style_height;
        //设置缩放比例
        if (this.Scale) {
            this._scale = this.style_width / this.style_height;
            this._x = this.style_left + this.style_width / 2;
            this._y = this.style_top + this.style_height / 2;
            if (this.Limit) {
                this._mxScaleWidth = Math.min((this._x - this.mxLeft), (this.mxRight - this._x)) * 2;
                this._mxScaleHeight = Math.min((this._y - this.mxTop), (this.mxBottom - this._y)) * 2;
            }
        }//欢迎来到站长特效网，我们的网址d是www.zzjs.net，很好记，zz站长，js就是js特效，本站收集大量高质量js代码，还有许多广告代码下载。
        //如果有范围，先计算好范围内最大宽度和高度
        if (this.Limit) {
            this._mxRightWidth = this.mxRight - this.style_left;
            this._mxDownHeight = this.mxBottom - this.style_top;
            this.style_top_heightHeight = this.style_height + this.style_top - this.mxTop;
            this.style_left_widthWidth = this.style_width + this.style_left - this.mxLeft;
        };
        //mousemove时缩放，mouseup时停止
        addEventHandler(document, "mousemove", this._fR);
        addEventHandler(document, "mouseup", this._fS);
        if (isIE) {
            //焦点丢失
            addEventHandler(this._touch, "losecapture", this._fS);
            //设置鼠标捕获
            this._touch.setCapture();
        } else {
            //焦点丢失
            addEventHandler(window, "blur", this._fS);
            //阻止默认动作
            oEvent.preventDefault();
        };//欢迎来到站长特效网，d我们的网址是www.zzjs.net，很好记，zz站长，js就是js特效，本站收集大量高质量js代码，还有许多广告代码下载。
    },
    //缩放
    Resize: function (e) {
        //没有触发对象的话返回
        if (!this._touch) return;
        //清除选择
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        //执行缩放程序
        this._fun(window.event || e);
        //设置样式
        //因为计算用的offset是把边框算进去的所以要减去
        this._obj.style.width = this.style_width - this._xBorder + "px";
        this._obj.style.height = this.style_height - this._yBorder + "px";
        this._obj.style.top = this.style_top + "px";
        this._obj.style.left = this.style_left + "px";
        //附加程序
        this.onResize();
    },
    //绑定程序
    //右边
    Up: function (oEvent) {
        this.RepairY(this._down - oEvent.clientY, this.style_top_heightHeight);
        this.style_top = this.style_top_height - this.style_height;
    },
    //右边
    Down: function (oEvent) {
        this.RepairY(oEvent.clientY - this._up, this._mxDownHeight);
    },
    //右边
    Right: function (oEvent) {
        this.RepairX(oEvent.clientX - this._left, this._mxRightWidth);
    },
    //右边
    Left: function (oEvent) {
        this.RepairX(this._right - oEvent.clientX, this.style_left_widthWidth);
        this.style_left = this.style_left_width - this.style_width;
    },
    //右边
    RepairY: function (iHeight, mxHeight) {
        iHeight = Math.max(Math.min(iHeight, this.Limit ? mxHeight : iHeight), this.minHeight);
        if (this.Scale) {
            var iWidth = parseInt(iHeight * this._scale);
            if (iWidth < this.minWidth || (this.Limit && iWidth > this._mxScaleWidth)) {
                iWidth = Math.max(Math.min(iWidth, this.Limit ? this._mxScaleWidth : iWidth), this.minWidth);
                iHeight = parseInt(iWidth / this._scale);
            }//欢迎来到站长特效网，我们的网址是www.zzjs.net，很好记，zz站长b，js就是js特效，本站收集大量高质量js代码，还有许多广告代码下载。
            this.style_width = iWidth;
            this.style_left = this._x - iWidth / 2;
        }
        this.style_height = iHeight;
    },
    //右边
    RepairX: function (iWidth, mxWidth) {
        iWidth = Math.max(Math.min(iWidth, this.Limit ? mxWidth : iWidth), this.minWidth);
        if (this.Scale) {
            var iHeight = parseInt(iWidth / this._scale);
            if (iHeight < this.minHeight || (this.Limit && iHeight > this._mxScaleHeight)) {
                iHeight = Math.max(Math.min(iHeight, this.Limit ? this._mxScaleHeight : iHeight), this.minHeight);
                iWidth = parseInt(iHeight * this._scale);
            }
            this.style_height = iHeight;
            this.style_top = this._y - iHeight / 2;
        }
        this.style_width = iWidth;
    },
    //右边
    RightDown: function (oEvent) {
        this.RepairAngle(
        oEvent.clientX - this._left, this._mxRightWidth,
        oEvent.clientY - this._up, this._mxDownHeight
        );
    },
    //右边
    RightUp: function (oEvent) {
        this.RepairAngle(
        oEvent.clientX - this._left, this._mxRightWidth,
        this._down - oEvent.clientY, this.style_top_heightHeight
        );//欢迎来到站长特效网，a我们的网址是www.zzjs.net，很好记，zz站长，js就是js特效，本站收集大量高质量js代码，还有许多广告代码下载。
        this.style_top = this.style_top_height - this.style_height;
    },
    //右边
    LeftDown: function (oEvent) {
        this.RepairAngle(
        this._right - oEvent.clientX, this.style_left_widthWidth,
        oEvent.clientY - this._up, this._mxDownHeight
        );
        this.style_left = this.style_left_width - this.style_width;
    },
    //右边
    LeftUp: function (oEvent) {
        this.RepairAngle(
        this._right - oEvent.clientX, this.style_left_widthWidth,
        this._down - oEvent.clientY, this.style_top_heightHeight
        );
        this.style_top = this.style_top_height - this.style_height;
        this.style_left = this.style_left_width - this.style_width;
    },
    //右边
    RepairAngle: function (iWidth, mxWidth, iHeight, mxHeight) {
        iWidth = Math.max(Math.min(iWidth, this.Limit ? mxWidth : iWidth), this.minWidth);
        iHeight = this.Scale ? parseInt(iWidth / this._scale) : iHeight;
        if (iHeight < this.minHeight || (this.Limit && iHeight > mxHeight)) {
            iHeight = Math.max(Math.min(iHeight, this.Limit ? mxHeight : iHeight), this.minHeight);
            this.Scale && (iWidth = parseInt(iHeight * this._scale));
        }
        this.style_width = iWidth;
        this.style_height = iHeight;
    },
    //停止缩放
    Stop: function () {
        //移除事件
        removeEventHandler(document, "mousemove", this._fR);
        removeEventHandler(document, "mouseup", this._fS);
        if (isIE) {
            removeEventHandler(this._touch, "losecapture", this._fS);
            this._touch.releaseCapture();
        } else {
            removeEventHandler(window, "blur", this._fS);
        }
        this._touch = null;
    }
};
//结束1

var _resize = new Resize("lh_pdd1d", { Limit: false });//默认为true，执行下面（false设置不限制移动范围）
_resize.Set("rRightDown", "right-down");
_resize.Set("rLeftDown", "left-down");
_resize.Set("rRightUp", "right-up");
_resize.Set("rLeftUp", "left-up");
_resize.Set("rRight", "right");
_resize.Set("rLeft", "left");
_resize.Set("rUp", "up");
_resize.Set("rDown", "down");
_resize.mxRight = 500;//设置图片最大宽度
_resize.mxBottom = 300;//设置图片最大高度
//lh_qjbl("idScale").onclick = function () {//设置是否等比例缩放
//    if (_resize.Scale) {
//        this.value = "设置比例";
//        _resize.Scale = false;
//    } else {
//        this.value = "取消比例";
//        _resize.Scale = true;
//    }
//}

var drag = new Drag("lh_pdd1d", { mxContainer: "lh_pdd1", Limit: false });//默认为true（false设置不限制范围）

/*绑定事件（为鼠标滑动放大缩小）*/
//function addEvent(obj, sType, fn) {
//  if (obj.addEventListener) {
//    obj.addEventListener(sType, fn, false);
//  } else {
//    obj.attachEvent('on' + sType, fn);
//  }
//};
//function removeEvent(obj, sType, fn) {
//  if (obj.removeEventListener) {
//    obj.removeEventListener(sType, fn, false);
//  } else {
//    obj.detachEvent('on' + sType, fn);
//  }
//};
//function prEvent(ev) {
//  var oEvent = ev || window.event;
//  if (oEvent.preventDefault) {
//    oEvent.preventDefault();
//  }
//  return oEvent;
//}
///*添加滑轮事件*/
//function addWheelEvent(obj, callback) {
//  if (window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
//    addEvent(obj, 'DOMMouseScroll', wheel);
//  } else {
//    addEvent(obj, 'mousewheel', wheel);
//  }
//  function wheel(ev) {
//    var oEvent = prEvent(ev),
//    delta = oEvent.detail ? oEvent.detail > 0 : oEvent.wheelDelta < 0;
//    callback && callback.call(oEvent, delta);
//    return false;
//  }
//};
///*页面载入后*/
//window.onload = function() {
//  var oImg = document.getElementById('lh_pdd1d');
//  /*拖拽功能*/
//  (function() {
//    addEvent(oImg, 'mousedown', function(ev) {
//      var oEvent = prEvent(ev),
//      oParent = oImg.parentNode,
//      disX = oEvent.clientX - oImg.offsetLeft,
//      disY = oEvent.clientY - oImg.offsetTop,
//      startMove = function(ev) {
//        if (oParent.setCapture) {
//          oParent.setCapture();
//        }
//        var oEvent = ev || window.event,
//        l = oEvent.clientX - disX,
//        t = oEvent.clientY - disY;
//         var imgwi=$("#lh_pdd1d").width();/*定义图片的宽度*/
//        var imghe=$("#lh_pdd1d").height();/*定义图片的高度*/
//        var lhdivwi=$(".lh_pdd1").width();
//        var lhdivhe=$(".lh_pdd1").height();
//       // alert(imghe);
//        if (l<0) {l=0;}/*四个if，对框的定义*/
//        if (t<0) {t=0;}
//        if (l > lhdivwi - imgwi - 2) {l = lhdivwi - imgwi - 2;}
//        if (t > lhdivhe - imghe - 2) {t = lhdivhe - imghe - 2;}
//                console.log($(".lh_pdd1").height());
//                console.log($("#lh_pdd1d").height());
//        oImg.style.left = l +'px';
//        oImg.style.top = t +'px';
//        oParent.onselectstart = function() {
//          return false;
//        }
//      }, endMove = function(ev) {
//        if (oParent.releaseCapture) {
//          oParent.releaseCapture();
//        }
//        oParent.onselectstart = null;
//        removeEvent(oParent, 'mousemove', startMove);
//        removeEvent(oParent, 'mouseup', endMove);
//      };
//      addEvent(oParent, 'mousemove', startMove);
//      addEvent(oParent, 'mouseup', endMove);
//      return false;
//    });
//  })();
//  /*以鼠标位置为中心的滑轮放大功能*/
//  (function() {
//    addWheelEvent(oImg, function(delta) {
//      var ratioL = (this.clientX - oImg.offsetLeft) / oImg.offsetWidth,
//      ratioT = (this.clientY - oImg.offsetTop) / oImg.offsetHeight,
//      ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1,
//      w = parseInt(oImg.offsetWidth * ratioDelta),
//      h = parseInt(oImg.offsetHeight * ratioDelta),
//      l = Math.round(this.clientX - (w * ratioL)),
//      t = Math.round(this.clientY - (h * ratioT));
//      with(oImg.style) {
//        console.log(w);
//        console.log(h);
//        var lh_chcz=$("#lh_pdd1d").position().left;/*定义放大图片是否超出背景*/
//        var lh_chcs=$("#lh_pdd1d").position().top;
//        var lh_chcw=$("#lh_pdd1d").width();
//        var lh_chch=$("#lh_pdd1d").height();
//        var lh_ydbjw=$("#lh_pdd1").width();/*定义可移动区域的大小*/
//        var lh_ydbjh=$("#lh_pdd1").height();
//        if (lh_chcz>0&&lh_chcs>0&&lh_chcz+lh_chcw+2<lh_ydbjw&&lh_chcs+lh_chch+2<lh_ydbjh) {
//        width = w +'px';
//        height = h +'px';
//        left = l +'px';
//        top = t +'px';
//      }
//      }
//    });
//  })();
//};
/***************************灯拖拽结束************************/


$(function () {/*第一次加载的时候执行下列绑定事件*/
    lh_pdspbd();
    lh_pdbjbd();
    lh_scbjssxssnr();
    lh_scspssxssnr();
    bjdjsj123();

    spjltj123();
    lh_bjfxfz();//背景反向赋值数据绑定/新增
    lh_spfxfz();//商品反向赋值数据绑定/新增
})
/*获取屏幕宽度*/
//$(".lh_pdd7").css("height",$(".lh_pd").height()-109+"px");/*给透明白色底赋高度*/
var zycwidth = ($("body").width() - $(".lh_pdau").width() - 15) / 2 + "px";/*算出左右侧的宽度*/
$(".lh_pdzuo").css("width", zycwidth);
$(".lh_pdyou").css("width", zycwidth);

/*******************功能条数据绑定***********************/
/********保存成图片(2d渲染)***************/
function lh_baocun() {
    if ($("#lh_pdd1d").hasClass("hide")) {
        alert("您还没有配灯");
    }
    else {
        var canvas = document.getElementById("lh_canvas"); //调取canvas
        var canvaswi = $("#lh_pdd1").width();/*获取div的宽度*/
        var canvashe = $("#lh_pdd1").height();/*获取div的高度*/
        canvas.width = canvaswi; //设置canvas宽
        canvas.height = canvashe; //设置canvas高
        var context = canvas.getContext("2d"); //设置canvas接口
        var image = new Image();//创造img的对象
        image.src = $("#lh_pdd1img").attr("src");//定义图片链接
        image.onload = function () {//保证获取到图片
            context.drawImage(image, 0, 0, canvaswi, canvashe);/*定义渲染图片的开始坐标和大小*/
            xuanran2();
        }
    }
}
function xuanran2() {
    var canvas = document.getElementById("lh_canvas"); //调取canvas
    var context = canvas.getContext("2d"); //设置canvas接口
    var image = new Image();//创造img的对象
    image.src = $("#lh_pdd1d img").attr("src");//定义图片链接
    image.onload = function () {//保证获取到图片
        context.drawImage(image, $("#lh_pdd1d").position().left, $("#lh_pdd1d").position().top, $("#lh_pdd1d").width(), $("#lh_pdd1d").height());//定义渲染图片的开始坐标和大小
        baocuntupian();
    }

}
function baocuntupian() {
    var canvas = document.getElementById("lh_canvas"); //调取canvas
    var context = canvas.getContext("2d"); //设置canvas接口
    /*图片导出为 png 格式 */
    var type = 'png';
    var imgData = canvas.toDataURL(type);
    /*获取mimeType  
      @param  {String} type the old mime-type  
      @return the new mime-type  
    */
    var _fixType = function (type) {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    };
    imgData = imgData.replace(_fixType(type), 'image/octet-stream');/*加工image data，替换mime type  */
    /*在本地进行文件保存  
      @param  {String} data     要保存到本地的图片数据  
      @param  {String} filename 文件名  
    */
    var saveFile = function (data, filename) {
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = data;
        save_link.download = filename;
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
    };

    var filename = '福雷特' + (new Date()).getTime() + '.' + type;/*下载后的图片名 */
    saveFile(imgData, filename);/*download*/

}
/********保存成图片(2d渲染)***************/

/***********全屏封装***************/
(function () {
    var fullScreenApi = {
        supportsFullScreen: false,
        isFullScreen: function () {
            return false;
        },
        requestFullScreen: function () { },
        cancelFullScreen: function () { },
        fullScreenEventName: '',
        prefix: ''
    },
    browserPrefixes = 'webkit moz o ms khtml'.split(' ');
    // check for native support
    if (typeof document.cancelFullScreen != 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        // check for fullscreen support by vendor prefix
        for (var i = 0, il = browserPrefixes.length; i < il; i++) {
            fullScreenApi.prefix = browserPrefixes[i];
            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen'] != 'undefined') {
                fullScreenApi.supportsFullScreen = true;
                break;
            }
        }
    }
    // update methods to do something useful
    if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
        fullScreenApi.isFullScreen = function () {
            switch (this.prefix) {
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        }
        fullScreenApi.requestFullScreen = function (el) {
            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
        }
        fullScreenApi.cancelFullScreen = function (el) {
            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        }

    }
    // jQuery plugin
    if (typeof jQuery != 'undefined') {
        jQuery.fn.requestFullScreen = function () {
            return this.each(function () {
                if (fullScreenApi.supportsFullScreen) {
                    fullScreenApi.requestFullScreen(this);
                }
            });
        };
    }
    // export api
    window.fullScreenApi = fullScreenApi;
})();
$(function () {
    $("#fullScreenBtn").click(function () {
        $("#fullScreen").requestFullScreen();
        /*下面为全屏的自适应效果*/
        $(".lh_pdzuo").css("width", "10%");
        $(".lh_pdyou").css("width", "10%");
        $("#fullScreen").css("padding", "30px 10% 0 10%");
        $(".lh_pdau").css("width", "80%");

        if (window.top != self) {
            $("#tip").text("iframe里面不能演示该功能！请点击右下角的全屏查看！").show();
        }
    });
})
    if (!fullScreenApi.supportsFullScreen) {
        alert("您的浏览器不支持全屏API哦，请换高版本的chrome或者firebox！");
    }

    /***********全屏封装***************/
    /*****可拖动的灯鼠标事件开始*****/
    $("#lh_pdd1d").mouseenter(function () {//停留
        $(this).css("border", "2px solid rgba(239, 151, 103 ,1)");
        $(this).children("div").show();
    })
    $("#lh_pdd1d").mouseleave(function () {//移走
        $(this).css("border", "2px solid rgba(239, 151, 103 ,0)");
        $(this).children("div").hide();
    })
    /*****可拖动的灯鼠标事件结束*****/
    /**双击商品触发事件**/
    $("#lh_pdd1d").dblclick(function () { $(this).addClass("hide"); })
    function lh_chongzhi() {/*重置*/
        $("#lh_pdd1d").attr("class", "hide");/*隐藏灯*/
        $("#lh_pdd1img").attr("src", "images/bpdbbj.jpg");/*恢复第一个背景*/
    }/*重置结束*/
    $("#lh_pdd1 #lh_pdd1img").click(function () {
        //console.log($(".lh_pdd6").hasClass("hide"));
        if ($(".lh_pdd6").hasClass("hide") && $(".lh_pdd4").attr("class") != "lh_pdd4 hide") {
            $('.lh_pdbjxz').animate({ left: "-15.5%" }, 1000);/*滑动隐藏*/
            $("#lh_pdbjyc1").animate({ left: "0" }, 1000);/*滑动*/
            $("#lh_pdbjyc1").text("显示界面");
            $('.lh_pdspxz').animate({ right: "-15.5%" }, 1000);/*滑动隐藏*/
            $("#lh_pdbjyc2").animate({ right: "0" }, 1000);/*滑动*/
            $("#lh_pdbjyc2").text("显示界面");
            $(".lh_pdd4").animate({ opacity: 'hide' }, 1500);
            $(".lh_pdd4").addClass("hide");
        }
        else if ($(".lh_pdd4").attr("class") == "lh_pdd4 hide") {
            $('.lh_pdbjxz').animate({ left: "0%" }, 1000);/*滑动隐藏*/
            $("#lh_pdbjyc1").animate({ left: "15.5%" }, 1000);/*滑动*/
            $("#lh_pdbjyc1").text("隐藏界面");
            $('.lh_pdspxz').animate({ right: "0" }, 1000);/*滑动隐藏*/
            $("#lh_pdbjyc2").animate({ right: "15.5%" }, 1000);/*滑动*/
            $("#lh_pdbjyc2").text("隐藏界面");
            $(".lh_pdd4").animate({ opacity: 'show' }, 1500);
            $(".lh_pdd4").removeClass("hide");
        }

        else {
            $(".lh_pdd6").addClass("hide");
        }
    })
    $(".lh_pdd4 p").children(".lh_pdd4p2").mouseenter(function () {/*功能条数据绑定放图片上面显示内容*/
        $(this).siblings("label").css({ "padding": "5px", "margin": "-5px 0 0 -5px" });//移走外框闪烁定义
        /*子内容上浮开始*/
        $(this).siblings(".lh_pdd4p1").children(".lh_pdd4p11").css({ "z-index": "1", "transform": "translate3d(0px, -70px, 0px)", "transition-duration": "300ms", "transition-timing-function": "cubic-bezier(0.8, 0.84, 0.44, 1.3)" });
        $(this).siblings(".lh_pdd4p1").children(".lh_pdd4p12").css({ "z-index": "1", "transform": "translate3d(0px, -130px, 0px)", "transition-duration": "400ms", "transition-timing-function": "cubic-bezier(0.8, 0.84, 0.44, 1.3)" });
        $(this).siblings(".lh_pdd4p1").children(".lh_pdd4p13").css({ "z-index": "1", "transform": "translate3d(0px, -190px, 0px)", "transition-duration": "500ms", "transition-timing-function": "cubic-bezier(0.8, 0.84, 0.44, 1.3)" });
        /*子内容上浮结束*/

        var lh_d4img = $(this).parent("p").index();/*判断点击的第几个图片*/
        if (lh_d4img == 0) {
            $(this).siblings("img").attr("src", "images/pdgnt1_1.png");
        }
        else if (lh_d4img == 1) {
            $(this).siblings("img").attr("src", "images/pdgnt2_1.png");
        }
        else if (lh_d4img == 2) {
            $(this).siblings("img").attr("src", "images/pdgnt3_1.png");
        }
        else if (lh_d4img == 3) {
            $(this).siblings("img").attr("src", "images/pdgnt4_1.png");
        }
        else if (lh_d4img == 4) {
            $(this).siblings("img").attr("src", "images/pdgnt5_1.png");
        }
        else if (lh_d4img == 5) {
            $(this).siblings("img").attr("src", "images/pdgnt6_1.png");
        }
        else if (lh_d4img == 6) {
            $(this).siblings("img").attr("src", "images/pdgnt7_1.png");
        }
        else if (lh_d4img == 7) {
            $(this).siblings("img").attr("src", "images/pdgnt8_1.png");
        }
    })
    $(".lh_pdd4 p").children(".lh_pdd4p1").mouseenter(function () {/*功能条数据绑定放内容上面显示内容*/
        $(this).children(".lh_pdd4p11").css({ "z-index": "1", "transform": "translate3d(0px, -70px, 0px)" });
        $(this).children(".lh_pdd4p12").css({ "z-index": "1", "transform": "translate3d(0px, -130px, 0px)" });
        $(this).children(".lh_pdd4p13").css({ "z-index": "1", "transform": "translate3d(0px, -190px, 0px)" });

    })
    $(".lh_pdd4 p").children(".lh_pdd4p1").mouseleave(function () {/*功能条数据绑定放内容上面隐藏内容*/
        $(this).children("label").css({ "z-index": "-1", "transform": "translate3d(0px, -0px, 0px)" });
    })
    /*上传绑定开始*/
    $(".upload-bg .lh_pdd4p2").mouseenter(function () {
        $(this).siblings("label").css({ "padding": "5px", "margin": "-5px 0 0 -5px" });//移走外框闪烁定义
        $(this).siblings("img").attr("src", "images/pdgnt9_1.png");
    })
    $(".upload-bg .lh_pdd4p2").mouseleave(function () {
        $(this).siblings("label").show();
        $(this).siblings("label").animate({ margin: '-10 0 0 -10', padding: '10', opacity: 'hide' }, 400);//移走外框闪烁
        $(this).siblings("img").attr("src", "images/pdgnt9.png");
    })
    /*上传绑定结束*/
    $(".lh_pdd4 p").children(".lh_pdd4p2").mouseleave(function () {/*功能条数据绑定移走图片隐藏内容*/
        $(this).siblings("label").show();
        $(this).siblings("label").animate({ margin: '-10 0 0 -10', padding: '10', opacity: 'hide' }, 400);//移走外框闪烁
        /*子内容上浮隐藏开始*/
        $(this).siblings(".lh_pdd4p1").children("label").css({ "z-index": "-1", "transform": "translate3d(0px, 0px, 0px)" });

        /*子内容上浮隐藏结束*/

        var lh_d4img2 = $(this).parent("p").index();/*判断点击的第几个图片*/
        if (lh_d4img2 == 0) {
            $(this).siblings("img").attr("src", "images/pdgnt1.png");
        }
        else if (lh_d4img2 == 1) {
            $(this).siblings("img").attr("src", "images/pdgnt2.png");
        }
        else if (lh_d4img2 == 2) {
            $(this).siblings("img").attr("src", "images/pdgnt3.png");
        }
        else if (lh_d4img2 == 3) {
            $(this).siblings("img").attr("src", "images/pdgnt4.png");
        }
        else if (lh_d4img2 == 4) {
            $(this).siblings("img").attr("src", "images/pdgnt5.png");
        }
        else if (lh_d4img2 == 5) {
            $(this).siblings("img").attr("src", "images/pdgnt6.png");
        }
        else if (lh_d4img2 == 6) {
            $(this).siblings("img").attr("src", "images/pdgnt7.png");
        }
        else if (lh_d4img2 == 7) {
            $(this).siblings("img").attr("src", "images/pdgnt8.png");
        }
    })
    /**加入购物车开始**/
    $(".addCart img").click(function () {
        // $("#lh_jiargwc").
        console.log($("#lh_pdd1d").position.left() + zycwidth);
    })
    /**加入购物车结束**/
    /***************功能条搜索**************/
    /*遮盖层点击事件开始*/
    $(".lh_pdd7").click(function () {
        $(".lh_pdd8").hide(1200);
        $(".lh_pdd9").animate({ width: '0%', opacity: 'hide' }, 1500);
        $(".lh_pdd10").hide(1000);
        $(".lh_pdd11").slideUp("slow");
        $(".lh_pdd7").hide();
    })
    /*遮盖层点击事件结束*/
    function lh_bjss() {/*背景搜索*/
        $(".lh_pdd6").removeClass("hide");
        $(".lh_pdd6 input").attr("name", 1);
        $(".lh_pdd6 input").attr("placeholder", "输入背景风格或场景");
    }
    function lh_spss() {/*商品搜索*/
        $(".lh_pdd6").removeClass("hide");
        $(".lh_pdd6 input").attr("name", 2);
        $(".lh_pdd6 input").attr("placeholder", "输入名称或编号");
    }
    /********购物车开始**********/
    function lh_ckgwc() {/*显示购物车*/
        $(".lh_pdd7").css("width", "100%")
        $(".lh_pdd7").show();
        $(".lh_pdd8").fadeToggle(1200);
        lh_gwcsfwk();//判断购物车是否为空的在执行绑定///////////////////////////////新增
    }
    function lh_ycgwc() {/*隐藏购物车*/
        $(".lh_pdd7").hide();
        $(".lh_pdd8").fadeToggle(1200);
    }
    function shanchuscgwc123() {
        $(".lh_pdgwcsc").click(function () {/**购物车中删除单个产品**/
            var goodsId = $(this).attr('goods-id');
            deleteCollect(goodsId);
            $(this).parent("div").remove();
            lh_gwcsfwk();//判断购物车是否为空的在执行绑定///////////////////////////////新增
            lh_scsfwk();//判断收藏是否为空的在执行绑定///////////////////////////////新增
        })
    }

    /*判断购物车中是否有商品*///////////////////////////////新增
    function lh_gwcsfwk() {
        console.log("购物车" + $(".lh_pdd8 .lh_pdd8d2").find(".lh_pdd8d2n").height());
        if ($(".lh_pdd8 .lh_pdd8d2").find(".lh_pdd8d2n").height() == 0) {
            $(".lh_pdwugwc").show();
            $(".lh_pdd8 .lh_pdd8d2").find(".lh_pdd8d2n").hide();
        }
        else {

            $(".lh_pdd8 .lh_pdd8d2").find(".lh_pdd8d2n").show();
            $(".lh_pdwugwc").hide();
        }
    }
    /********购物车结束**********/
    /********收藏开始**********/
    $('.lh_pdd9d3 p').click(function () {
        clearCollect();
        $('.lh_pdd9 .lh_pdd8d2n').html('');
        $('.lh_pdd9').hide();
        $('.lh_pdd7').hide();
    })
    function lh_xswdsc() {/*显示收藏夹*/
       // showCollect();
        $(".lh_pdd7").show();
        $(".lh_pdd9").animate({ width: '60%', opacity: 'show' }, 2000);
        lh_scsfwk();//判断收藏是否为空的在执行绑定///////////////////////////////新增
        shanchuscgwc123();//删除
    }
    function lh_ycwdsc() {/*显示收藏夹*/
        $(".lh_pdd7").hide();
        $(".lh_pdd9").animate({ width: '0%', opacity: 'hide' }, 1500);
    }
    /*判断收藏中是否有商品*///////////////////////////////新增
    function lh_scsfwk() {
        console.log($(".lh_pdd9 .lh_pdd8d2").find(".lh_pdd8d2n").height());
        if ($(".lh_pdd9 .lh_pdd8d2").find(".lh_pdd8d2n").height() == 0) {
            $(".lh_pdwusc").show();
            $(".lh_pdd9 .lh_pdd8d2").find(".lh_pdd8d2n").hide();
        }
        else {
            $(".lh_pdd9 .lh_pdd8d2").find(".lh_pdd8d2n").show();
            $(".lh_pdwusc").hide();
        }
    }
    /********收藏结束**********/

    /********背景筛选开始**********/
    function lh_xsbjsx() {/*显示背景筛选*/
        $(".lh_pdd7").css("width", "100%");
        $(".lh_pdd7").show();
        $(".lh_pdd10").show(1000);
    }
    function lh_ycbjsx() {/*隐藏背景筛选*/
        $(".lh_pdd7").hide();
        $(".lh_pdd10").hide(1000);
    }

    $(".lh_pdd10d31 p").mouseenter(function () {/*背景切换*/
        $(".lh_pdd10d31 p").removeClass("lh_pdd10d31p");
        $(this).addClass("lh_pdd10d31p");
        var lh_pdbjsx = $(this).index();
        $(".lh_pdd10d32 div").hide();
        $(".lh_pdd10d32 div").eq(lh_pdbjsx).show();
    })
    /*背景赋值到搜索框*/
    $(".lh_pdd10d32 div").children("p").click(function () {/*赋值到搜索栏中判读是否已经加入*/
        var lh_pdbjsxtp = $(this).attr("name");/*获取当前点击的name*/
        var lh_pdbjsxtp2 = $(this).parent("div").attr("class");
        var lh_pdbjsxtp3 = $(this);
        if (lh_pdbjsxtp2 == "") {//判断是否有class属性

            $(this).parent("div").attr("class", lh_pdbjsxtp);//给父标签赋值当前点击的name
            $(this).addClass("lh_pdd10d32dp");//样式
            $(".lh_pdd10d2 p").append("<span name=" + lh_pdbjsxtp + ">" + $(this).text() + "<label>X</label></span>");//添加html
        }
        else {
            if ($(lh_pdbjsxtp3).hasClass("lh_pdd10d32dp")) {//判断点击的是否是已经添加的搜索项
                $(".lh_pdd10d2 p").children("[name=" + (lh_pdbjsxtp) + "]").remove();//删除搜索栏里的搜索项
                $(lh_pdbjsxtp3).removeClass("lh_pdd10d32dp");
                $(lh_pdbjsxtp3).parent("div").attr("class", "");//给父标签去掉class
            }
            else {
                $.each($(".lh_pdd10d2 p").children("span"), function (n, name) {/*each循环*/
                    if ($(".lh_pdd10d2 p").children("span").eq(n).attr("name") == lh_pdbjsxtp2) {//判断有没有相同的
                        $(".lh_pdd10d2 p").children("span").eq(n).remove();
                        $(lh_pdbjsxtp3).parent("div").children("p").removeClass("lh_pdd10d32dp");/*先删除同类的所有class*/
                        $(lh_pdbjsxtp3).addClass("lh_pdd10d32dp");/*赋值给本点击的标签样式*/
                        $(lh_pdbjsxtp3).parent("div").attr("class", lh_pdbjsxtp);//给父标签赋值当前点击的name
                        $(".lh_pdd10d2 p").append("<span name=" + lh_pdbjsxtp + ">" + $(lh_pdbjsxtp3).text() + "<label>X</label></span>");//添加html

                    }
                })
            }

        }

        lh_scbjssxssnr();
    })
    /*****删除要搜索的内容*****/
    function lh_scbjssxssnr() {/*装删除绑定*/
        $(".lh_pdd10d2 p").children("span").click(function () {/*删除要搜索的内容*/
            $(this).remove();/*删除当前标签*/
            $(".lh_pdd10d32 div").children("p[name=" + $(this).attr("name") + "]").removeClass("lh_pdd10d32dp");/*删除下面对应的name的class*/
            $(".lh_pdd10d32 div").children("p[name=" + $(this).attr("name") + "]").parent("div").attr("class", "");/*删除下面对应的name的div的class*/
        })
    }
    /*清空要搜索的内容*/
    $(".lh_pdd10d2qk").click(function () {
        $(".lh_pdd10d2 p").html("");/*清空要搜索的内容*/
        $(".lh_pdd10d32 div").attr("class", "");/*去掉class属性*/
        $(".lh_pdd10d32 div").children("p").removeClass("lh_pdd10d32dp");/*去掉class属性*/

    })
    /********背景筛选结束**********/
    /********商品筛选开始**********/
    function lh_xsspsx() {/*显示商品筛选*/
        $(".lh_pdd7").css("width", "100%");
        $(".lh_pdd7").show();
        $(".lh_pdd11").slideDown("slow");
    }
    function lh_ycspsx() {/*隐藏商品筛选*/
        $(".lh_pdd7").hide();
        $(".lh_pdd11").slideUp("slow");
    }

    $(".lh_pdd11d31 p").mouseenter(function () {/*背景切换*/
        $(".lh_pdd11d31 p").removeClass("lh_pdd11d31p");
        $(this).addClass("lh_pdd11d31p");
        var lh_pdbjsx = $(this).index();
        $(".lh_pdd11d32 div").hide();
        $(".lh_pdd11d32 div").eq(lh_pdbjsx).show();
    })
    /*商品赋值到搜索框*/
    $(".lh_pdd11d32 div").children("p").click(function () {/*赋值到搜索栏中判读是否已经加入*/
        var lh_pdspsxtp = $(this).attr("name");/*获取当前点击的name*/
        var lh_pdspsxtp2 = $(this).parent("div").attr("class");
        var lh_pdspsxtp3 = $(this);
        if (lh_pdspsxtp2 == "") {//判断是否有class属性

            $(this).parent("div").attr("class", lh_pdspsxtp);//给父标签赋值当前点击的name
            $(this).addClass("lh_pdd11d32dp");//样式
            $(".lh_pdd11d2 p").append("<span name=" + lh_pdspsxtp + ">" + $(this).text() + "<label>X</label></span>");//添加html
        }
        else {
            if ($(lh_pdspsxtp3).hasClass("lh_pdd11d32dp")) {//判断点击的是否是已经添加的搜索项
                $(".lh_pdd11d2 p").children("[name=" + lh_pdspsxtp + "]").remove();//删除搜索栏里的搜索项
                $(lh_pdspsxtp3).removeClass("lh_pdd11d32dp");
                $(lh_pdspsxtp3).parent("div").attr("class", "");//给父标签去掉class
            }
            else {
                $.each($(".lh_pdd11d2 p").children("span"), function (n, name) {/*each循环*/
                    if ($(".lh_pdd11d2 p").children("span").eq(n).attr("name") == lh_pdspsxtp2) {//判断有没有相同的
                        $(".lh_pdd11d2 p").children("span").eq(n).remove();
                        $(lh_pdspsxtp3).parent("div").children("p").removeClass("lh_pdd11d32dp");/*先删除同类的所有class*/
                        $(lh_pdspsxtp3).addClass("lh_pdd11d32dp");/*赋值给本点击的标签样式*/
                        $(lh_pdspsxtp3).parent("div").attr("class", lh_pdspsxtp);//给父标签赋值当前点击的name
                        $(".lh_pdd11d2 p").append("<span name=" + lh_pdspsxtp + ">" + $(lh_pdspsxtp3).text() + "<label>X</label></span>");//添加html

                    }
                })
            }
        }

        /*下面注释为单类可多选不可重复选择*/
        //var lh_pdspsxt =true;
        //$.each($(".lh_pdd11d2 p").children("span"),function(n,name){/*each循环*/
        //console.log(n);
        //if ($(".lh_pdd11d2 p").children("span").eq(n).attr("name")==lh_pdspsxtp) {/*判断数组中是否有和当前点击的name匹配*/
        //  lh_pdspsxt=false;/*根据判断，如果有匹配数将赋值lh_pdspsxt为false*/
        //  console.log(lh_pdspsxt);
        //}
        //});
        // if (lh_pdspsxt) {/*接收lh_pdspsxt*/
        //   $(this).addClass("lh_pdd11d32dp");
        // $(".lh_pdd11d2 p").append("<span name="+$(this).attr('name')+">"+$(this).text()+"<label>X</label></span>");
        // }

        lh_scspssxssnr();
    })
    /*****删除要搜索的内容*****/
    function lh_scspssxssnr() {/*装删除绑定*/
        $(".lh_pdd11d2 p").children("span").click(function () {/*删除要搜索的内容*/
            $(this).remove();/*删除当前标签*/
            $(".lh_pdd11d32 div").children("p[name=" + $(this).attr("name") + "]").removeClass("lh_pdd11d32dp");/*删除下面对应的name的class*/
            $(".lh_pdd11d32 div").children("p[name=" + $(this).attr("name") + "]").parent("div").attr("class", "");/*删除下面对应的name的class*/
        })
    }
    /*清空要搜索的内容*/
    $(".lh_pdd11d2qk").click(function () {
        $(".lh_pdd11d2 p").html("");/*清空要搜索的内容*/
        $(".lh_pdd11d32 div").attr("class", "");/*去掉div的class属性*/
        $(".lh_pdd11d32 div").children("p").removeClass("lh_pdd11d32dp");/*去掉class属性*/
    })
    /********商品筛选结束**********/

    /***********背景和商品效果***************/
    /*******背景选择效果*******/
    $("#lh_pdbjyc1").click(function () {
        if ($(this).text() == "隐藏界面") {
            $('.lh_pdbjxz').animate({ left: "-15.5%" }, 1000);/*滑动隐藏*/
            /*$('.lh_pdbjxz').animate({width: '0',opacity: 'hide'},1000);/*滑动隐藏背景选择*/
            $(this).animate({ left: "0" }, 1000);/*滑动*/
            $(this).text("显示界面");
        }
        else {
            /*$('.lh_pdbjxz').animate({width: '15%',opacity: 'show'},1000);/*滑动显示背景选择*/
            $('.lh_pdbjxz').animate({ left: "0%" }, 1000);/*滑动显示*/
            $(this).animate({ left: "15.5%" }, 1000);//滑动
            $(this).text("隐藏界面");
        }
    })
    /*******商品选择效果*******/
    $("#lh_pdbjyc2").click(function () {
        if ($(this).text() == "隐藏界面") {
            /*$('.lh_pdspxz').animate({width: '0',opacity: 'hide'},1000);/*滑动隐藏背景选择*/
            $('.lh_pdspxz').animate({ right: "-15.5%" }, 1000);/*滑动隐藏*/
            $(this).animate({ right: "0" }, 1000);/*滑动*/
            $(this).text("显示界面");
        }
        else {
            /*$('.lh_pdspxz').animate({width: '15%',opacity: 'show'},1000);/*滑动显示背景选择*/
            $('.lh_pdspxz').animate({ right: "0%" }, 1000);/*滑动显示*/
            $(this).animate({ right: "15.5%" }, 1000);/*滑动*/
            $(this).text("隐藏界面");
        }
    })

    /***************************历史记录************************/
    /**新增，背景反向赋值**/
    function lh_bjfxfz() {
        $(".lh_pdd51n1 .lh_pdd51n1d").click(function () {
            $("#lh_pdd1img").attr("src", $(this).children("img").attr("bg-src"));//赋值给上面背景
        })
    }
    /**新增，商品反向赋值**/
    function lh_spfxfz() {
        $(".lh_pdd51n2 .lh_pdd51n2d").find(".lh_pdht2").click(function () {
            $("#lh_pdd1d img").attr("src", $(this).children("img").attr("data-src"));//赋值给上面商品
            $("#lh_pdd1d img").attr("name", $(this).children("img").attr("name"));//赋值给上面商品
            $("#lh_pdd1d img").attr("data-gid", $(this).children("img").attr("data-gid"));//赋值给上面商品
            $("#lh_pdd1d img").attr("data-attr", $(this).children("img").attr("data-attr"));//赋值给上面商品
            $("#lh_pdd1d").removeClass("hide");//显示出来灯
        })
    }
    /****左滑动事件****/
    $(".lh_pdjt2").click(function () {
        var lh_pdsplswi = $(".lh_pdd51n2 .lh_pdd51n2d").length * 144;/*获取商品历史宽度*/
        var lh_pdbjlswi = $(".lh_pdd51n1 .lh_pdd51n1d").length * 201.6;/*获取背景历史宽度*/
        var lh_pdsplsml = $(".lh_pdd51n2").css("margin-left");/*获取商品magin-left的值*/
        var lh_pdsplsmlsz = parseInt(lh_pdsplsml);/*转换成数字*/
        var lh_pdbjlsml = $(".lh_pdd51n1").css("margin-left");/*获取背景magin-left的值*/
        var lh_pdbjlsmlsz = parseInt(lh_pdbjlsml);/*转换成数字*/
        var lh_pdsplszxqkz = (-lh_pdsplsmlsz) % 1008;/*判断商品历史是否执行完毕，被1008整除*/
        var lh_pdbjlszxqkz = (-lh_pdbjlsmlsz) % 1008;/*判断背景历史是否执行完毕，被1008整除*/
        // alert(lh_pdbjspzxqk);
        if ($(".lh_pdd51n1").hasClass("hide")) {/*判断背景历史是否隐藏*/
            if ((-lh_pdsplsmlsz) < lh_pdsplswi - 1008 && lh_pdsplszxqkz == 0) {
                $(".lh_pdd51n2").animate({ marginLeft: lh_pdsplsmlsz - 1008 + "px" }, 2000);
            }
        }
        else {
            if ((-lh_pdbjlsmlsz) < lh_pdbjlswi - 1008 && lh_pdbjlszxqkz == 0) {
                $(".lh_pdd51n1").animate({ marginLeft: lh_pdbjlsmlsz - 1008 + "px" }, 2000);
            }
        }
    })
    /****右滑动事件****/
    $(".lh_pdjt1").click(function () {
        var lh_pdsplsml = $(".lh_pdd51n2").css("margin-left");/*获取商品magin-left的值*/
        var lh_pdsplsmlsz = parseInt(lh_pdsplsml);/*转换成数字*/
        var lh_pdbjlsml = $(".lh_pdd51n1").css("margin-left");/*获取背景magin-left的值*/
        var lh_pdbjlsmlsz = parseInt(lh_pdbjlsml);/*转换成数字*/
        var lh_pdsplszxqky = (-lh_pdsplsmlsz) % 1008;/*判断商品历史是否执行完毕，被1008整除*/
        var lh_pdbjlszxqky = (-lh_pdbjlsmlsz) % 1008;/*判断背景历史是否执行完毕，被1008整除*/
        if ($(".lh_pdd51n1").hasClass("hide")) {/*判断背景历史是否隐藏*/
            if (lh_pdsplsmlsz < 0 && lh_pdsplszxqky == 0) {
                $(".lh_pdd51n2").animate({ marginLeft: lh_pdsplsmlsz + 1008 + "px" }, 2000);
            }
        }
        else {
            // alert(lh_pdbjlsmlsz);alert(lh_pdbjlswi);
            if (lh_pdbjlsmlsz < 0 && lh_pdbjlszxqky == 0) {
                $(".lh_pdd51n1").animate({ marginLeft: lh_pdbjlsmlsz + 1008 + "px" }, 2000);
            }
        }
    })


    function lh_pdspbd() {/***历史记录商品内容的显示隐藏删除数据绑定***/
        $(".lh_pdd51n2d").mouseenter(function () {/*鼠标移到图片处显示*/
            $(this).find(".lh_pdht1").show();
            $(this).find(".lh_pdht1").css("margin-top", -($(this).children(".lh_pdht1").height() - 13) + "px");
        })
        $(".lh_pdd51n2d").mouseleave(function () {/*鼠标移走图片处隐藏*/
            $(this).find(".lh_pdht1").hide();
        })
        $(".lh_pdht1").mouseenter(function () {/*鼠标移到详情处显示*/
            $(this).show();
        })
        $(".lh_pdht1").mouseleave(function () {/*鼠标移走详情处隐藏*/
            $(this).hide();
        })
        $(".lh_x").mouseenter(function () {/*鼠标移到删除图片处显示*/
            $(this).parents(".lh_pdd51n2d").find(".lh_pdht1").show();
        })
        $(".lh_x").mouseleave(function () {/*鼠标移走删除图片处隐藏*/
            $(this).parents(".lh_pdd51n2d").find(".lh_pdht1").hide();
        })
        /****历史记录的标签删除****/
        $(".lh_x").click(function () {
            $(this).parents(".lh_pdd51n2d").remove();
        })
        /**加入购物车*/
    }

    /**商品历史记录的添加**/
    function spjltj123() {

        $(".lh_pdspxz div").find("img").click(function () {
            $(".lh_pdd51n1").attr("class", "lh_pdd51n1 hide");/*隐藏背景历史记录*/
            $(".lh_pdd51n2").attr("class", "lh_pdd51n2");/*显示商品历史记录*/
            $("#lh_pdd1d").removeClass("hide");/*显示出来*/
            $("#lh_pdd1d img").attr("src", $(this).attr("src"));//赋值给拖动的灯
            var lh_spfzsl1 = $(this).attr("name");
            var lh_spfzls2 = true;
            $.each($(".lh_pdd51n2").children(".lh_pdd51n2d"), function (n, name) {/*循环出历史记录的匹配*/
                // alert(lh_spfzsl1);
                // alert($(".lh_pdd51n2 .lh_pdd51n2d").find(".lh_lssp").eq(n).attr("name"));
                if ($(".lh_pdd51n2 .lh_pdd51n2d").find(".lh_lssp").eq(n).attr("name") == lh_spfzsl1) {
                    lh_spfzls2 = false;
                }
            })
            if (lh_spfzls2) {
                if ($(".lh_pdd51n2 .lh_pdd51n2d").length < 20) {/*判断div中是否个数小于20*/
                    /*给商品历史记录添加记录*/
                    $(".lh_pdd51n2").prepend('<div class="lh_pdd51n2d"><div class="lh_pdht1" style="display: none;">'
                            + '<div class="lh_pdht1d"><img src="images/lamp.jpg">'
                            + '<p>品牌/欧普照明</p><p>风格/中式简约</p><p>材质/竹</p><p>规格/650X200厘米</p><p class="lh_pdht1p1">￥550.00</p>'
                            + '<p class="lh_pdht1p2"><a href="">更多信息</a></p><p class="lh_pdht1p3">加入购物车</p></div>'
                            + '<div class="lh_pdht1sj"><span></span></div></div>'
                            + '<div class="lh_pdht2">' + $("<p>").append($(this).clone()).html() + '<img class="lh_x" src="images/x.jpg"></div></div>')
                }
                else {
                    alert("够20了，删除最后一条记录，添加一条新的记录");
                    $(".lh_pdd51n2 .lh_pdd51n2d").last().remove();/*删除最后一个记录*/
                    /*给商品历史记录添加记录*/
                    $(".lh_pdd51n2").prepend('<div class="lh_pdd51n2d"><div class="lh_pdht1" style="display: none;">'
                            + '<div class="lh_pdht1d"><img src="images/lamp.jpg">'
                            + '<p>品牌/欧普照明</p><p>风格/中式简约</p><p>材质/竹</p><p>规格/650X200厘米</p><p class="lh_pdht1p1">￥550.00</p>'
                            + '<p class="lh_pdht1p2"><a href="">更多信息</a></p><p class="lh_pdht1p3">加入购物车</p></div>'
                            + '<div class="lh_pdht1sj"><span></span></div></div>'
                            + '<div class="lh_pdht2">' + $("<p>").append($(this).clone()).html() + '<img class="lh_x" src="images/x.jpg"></div></div>')
                }
            }
            lh_pdspbd();/*执行数据绑定*/
            lh_spfxfz();//商品反向赋值数据绑定/新增
        })
        // alert("xx");
    }

    function lh_pdbjbd() {/***背景删除绑定***/
        $(".lh_bx").click(function () {/**背景历史记录的删除**/
            $(this).parent(".lh_pdd51n1d").remove();
        })
    }
    function bjdjsj123() {
        $(".lh_pdbjxz div").find("img").click(function () {
            $(".lh_pdd51n1").attr("class", "lh_pdd51n1");/*显示背景历史记录*/
            $(".lh_pdd51n2").attr("class", "lh_pdd51n2 hide");/*隐藏商品历史记录*/
            $("#lh_pdd1").children("img").attr("src", $(this).attr("bg-src"));/*赋值给底部*/
            var lh_bjfzsl1 = $(this).attr("name");
            var lh_bjfzls2 = true;
            /**/
            $.each($(".lh_pdd51n1").children(".lh_pdd51n1d"), function (n, name) {/*循环出历史记录的匹配*/
                if ($(".lh_pdd51n1 .lh_pdd51n1d").children("img").eq(n).attr("name") == lh_bjfzsl1) {
                    lh_bjfzls2 = false;
                }
            })
            /**/
            /***/
            if (lh_bjfzls2) {
                if ($(".lh_pdd51n1 .lh_pdd51n1d").length < 20) {/*判断div中是否个数小于20*/
                    /*给背景历史记录添加记录*/
                    $(".lh_pdd51n1").prepend('<p class="lh_pdd51n1d">' + $("<p>").append($(this).clone()).html() + '<img class="lh_bx" src="images/x.jpg"></p>');
                }
                else {
                    alert("够20了，删除最后一条记录，添加一条新的记录");
                    $(".lh_pdd51n1 .lh_pdd51n1d").last().remove();/*删除最后一个记录*/
                    /*给背景历史记录添加记录*/
                    $(".lh_pdd51n1").prepend('<p class="lh_pdd51n1d">' + $("<p>").append($(this).clone()).html() + '<img class="lh_bx" src="images/x.jpg"></p>');
                }
                /***/
            }
            lh_pdbjbd();/*执行数据绑定*/
            lh_bjfxfz();//背景反向赋值数据绑定/新增
        })
    }







    /****上拉加载数据开始*****/
    $('.lh_pdbjxz div').on('scroll', function () {//上拉加载背景监视滚动条，保留原数据，加载新数据
        if ($('.lh_pdbjxz div').scrollTop() >= ($('.lh_pdbjxz div').children('p').height() - 400)) {
            $('.lh_pdbjxz div').children('p').append("<div style='width:100%; float:left;height:30px; line-height:30px;background: #E75735;margin-top:20px;color:#FFF;text-align: center;font-size: 16px;''>背景</div>");//添加
        }
    })
    $('.lh_pdspxz div').on('scroll', function () {//上拉加载商品监视滚动条，保留原数据，加载新数据
        if ($('.lh_pdspxz div').scrollTop() >= ($('.lh_pdspxz div').children('p').height() - 400)) {
            $('.lh_pdspxz div').children('p').append("<div style='width:100%; float:left;height:30px; line-height:30px;background: #E75735;margin-top:20px;color:#FFF;text-align: center;font-size: 16px;''>商品</div>");//添加
        }
    })
    /****上拉加载数据结束*****/