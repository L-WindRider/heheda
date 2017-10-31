;
(function ($) {
    $.fn.jimiScrollFixed = function (json) {
        var that = this;
        var fixedMarginTop = json.fixedMarginTop || 15; //当我fixed的时候
        var $html = $('html');
        var $body = $('body');

        //获得当前元素距离 顶部和左侧的距离
        //因为当元素基于窗口fixed的时候 top值已知是15 left就是一开始的元素基于左侧的距离
        var fixedTop = $(this[0]).offset().top;
        var fixedLeft = $(this[0]).offset().left;

        //保存需要fixed的元素的本来是哪种文档流
        var oriPos = that.css('position');

        $(window).scroll(function () {
            //不断获得当前body滚上去多少

            //window上滚的值 IE和谷歌分别只有body或html有值
            var winScrollTop = $body.scrollTop() || $html.scrollTop();

            //滚动值+15
            if (winScrollTop + fixedMarginTop >= fixedTop) {
                that.css({
                    'position': 'fixed',
                    top: fixedMarginTop,
					left:($(window).width()-that.width())/2,
                })
            }
            else {
                if (oriPos == 'absolute') {
                    that.css({
                        'position': oriPos,
                        top: fixedTop
                    })
                }
                else if (oriPos == 'static') {
                    that.css({
                        'position': oriPos
                    })
                }

            }
        })
		
		$(window).resize(function(){
			that.css({left:($(window).width()-that.width())/2});
			})
        return this;
    }
})(jQuery);