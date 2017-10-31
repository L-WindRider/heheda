// 简单TAB效果

function setTab(name,cursel,n){
for(i=1;i<=n;i++){
var menu=document.getElementById(name+i);
var con=document.getElementById("con_"+name+"_"+i);
menu.className=i==cursel?"hover":"";
con.style.display=i==cursel?"block":"none";
}
}

// 带箭头左右滚动TAB效果
 $(function () {

        //init...................................
        function getRandomColor() {
        }
        zenjialunboxiaoguo($('#tab_01'))
		zenjialunboxiaoguo($('#tab_02'))
		zenjialunboxiaoguo($('#tab_03'))
		zenjialunboxiaoguo($('#mdcdc_01'))
		zenjialunboxiaoguo($('#mdcdc_02'))
		zenjialunboxiaoguo($('#mdcdc_03'))
		zenjialunboxiaoguo($('#mdcdc_04'))
		zenjialunboxiaoguo($('#mdcdc_05'))
        function zenjialunboxiaoguo($c){

            $c.find('.tab_cnt li').each(function (i, e) {
                $(e).css({background: getRandomColor()});
            })

            $c.find('.tab_cnt li').eq(0).css({left: 0});
            $c.find('.tab_btn li').eq(0).addClass('cur').siblings().removeClass('cur');

            //paras......................................
            var index = 0;
            var indexNext = 1;
			var indexBefore;
         
            var width = $c.width();
		
            var len = $c.find('.tab_cnt li').length;//5

            $c.find('.tab_aleft').click(function () {
                //验收左边的图片是否需要在这一步归零
                indexBefore = index - 1;
                if (indexBefore == -1) {
                    indexBefore = len-1;
                }

                //移动
                $c.find('.tab_cnt li').eq(index).animate({left: width});
                $c.find('.tab_cnt li').eq(indexBefore).css({left: -width}).stop().animate({left: 0});


                //修改索引值
                index = indexBefore;

                //修改原点
                $c.find('.tab_btn li').eq(index).addClass('cur').siblings().removeClass('cur');
            })


            $c.find('.tab_aright').click(function () {
                //验收右边的图片是否需要在这一步归零
                indexNext = index + 1;
                if (index == len - 1) {
                    indexNext = 0;
                }

                //移动
                $c.find('.tab_cnt li').eq(index).animate({left: -width});
                $c.find('.tab_cnt li').eq(indexNext).css({left: width}).stop().animate({left: 0});


                //修改索引值
                index = indexNext;

                //修改原点
                $c.find('.tab_btn li').eq(index).addClass('cur').siblings().removeClass('cur');
            })

            $c.find('.tab_btn li').click(function () {
                var cirIndex = $(this).index();
                if (cirIndex == index) {
                    return;
                }

                $c.find('.tab_cnt li').eq(index).animate({left: -width});
                $c.find('.tab_cnt li').eq(cirIndex).css({left: width}).stop().animate({left: 0});

                //修改索引值
                index = cirIndex;

                //修改原点
                $c.find('.tab_btn li').eq(index).addClass('cur').siblings().removeClass('cur');
            })
        }
    })