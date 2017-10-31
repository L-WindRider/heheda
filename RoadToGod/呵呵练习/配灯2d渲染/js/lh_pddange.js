/***************************加载时执行绑定封装*****************************/
$(function(){/*第一次加载的时候执行下列绑定事件*/
	lh_pdspbd();
  lh_pdbjbd();
  lh_scbjssxssnr();
})
/*获取屏幕宽度*/
var zycwidth = ($("body").width()-$(".lh_pdau").width())/2+"px";/*算出左右侧的宽度*/
$(".lh_pdzuo").css("width",zycwidth);
$(".lh_pdyou").css("width",zycwidth);
/*******************功能条数据绑定***********************/
$(".lh_pdd4 img").mouseenter(function () {/*功能条数据绑定放图片上面显示内容*/
  $(".lh_pdd3").children("div").hide();/*执行显示前先隐藏所有的功能条内容条*/
  var lh_d4img=$(this).index();/*判断点击的第几个图片*/
  if (lh_d4img==0) {$(".lh_pdd31").show();}
  else if (lh_d4img==1) {$(".lh_pdd32").show();}
  else if (lh_d4img==2) {$(".lh_pdd33").show();}
  else if (lh_d4img==4) {$(".lh_pdd34").show();}
  else if (lh_d4img==7) {$(".lh_pdd35").show();}
  else if (lh_d4img==8) {$(".lh_pdd36").show();}
})
$(".lh_pdd4 img").mouseleave(function(){/*功能条数据绑定移走图片隐藏内容*/
  $(".lh_pdd3").children("div").hide();
})

$(".lh_pdd3").children("div").mouseenter(function(){/*功能条数据绑定内容移动到上显示*/
  $(this).show();
})
$(".lh_pdd3").children("div").mouseleave(function(){/*功能条数据绑定内容移走隐藏*/
  $(this).hide();
})
/****功能条搜索*****/
function lh_bjss(){/*背景搜索*/
  $(".lh_pdd6").show();
  $(".lh_pdd6 input").attr("name",1);
  $(".lh_pdd6 input").attr("placeholder","输入背景风格或场景");
}
function lh_spss(){/*商品搜索*/
  $(".lh_pdd6").show();
  $(".lh_pdd6 input").attr("name",2);
  $(".lh_pdd6 input").attr("placeholder","输入名称或编号");
}
/********购物车开始**********/
function lh_ckgwc(){/*显示购物车*/
  $(".lh_pdd7").css("width","100%")
  $(".lh_pdd7").fadeToggle(1200);
  $(".lh_pdd8").fadeToggle(1200);
}
function lh_ycgwc(){/*隐藏购物车*/
  $(".lh_pdd7").slideUp("slow");
  $(".lh_pdd8").slideUp("slow");
}
$(".lh_pdgwcsc").click(function(){/**购物车中删除单个产品**/
  $(this).parent("div").remove();
})
/********购物车结束**********/
/********收藏开始**********/
function lh_xswdsc(){/*显示收藏夹*/
  $(".lh_pdd7").animate({width: '100%',opacity: 'show'},1500);
  $(".lh_pdd9").animate({width: '66%',opacity: 'show'},2000);
}
function lh_ycwdsc(){/*显示收藏夹*/
  $(".lh_pdd7").animate({width: '0%',opacity: 'hide'},1500);
  $(".lh_pdd9").animate({width: '0%',opacity: 'hide'},1500);
}
/********收藏结束**********/


/********背景筛选开始**********/
$(".lh_pdd10d31 p").mouseenter(function(){/*背景切换*/
  $(".lh_pdd10d31 p").removeClass("lh_pdd10d31p");
  $(this).addClass("lh_pdd10d31p");
  var lh_pdbjsx = $(this).index();
  $(".lh_pdd10d32 div").hide();
  $(".lh_pdd10d32 div").eq(lh_pdbjsx).show();
})
/*背景赋值到搜索出*/
$(".lh_pdd10d32 div").children("p").click(function(){/*赋值到搜索栏中判读是否已经加入*/
 var lh_pdbjsxt =true;
 var lh_pdbjsxtp=$(this).attr("name");/*获取当前点击的那么*/
 $.each($(".lh_pdd10d2 p").children("span"),function(n,name){/*each循环*/
  console.log(n);
  if ($(".lh_pdd10d2 p").children("span").eq(n).attr("name")==lh_pdbjsxtp) {/*判断数组中是否有和当前点击的name匹配*/
    lh_pdbjsxt=false;/*根据判断，如果有匹配数将赋值lh_pdbjsxt为false*/
    console.log(lh_pdbjsxt);
  }
});
  if (lh_pdbjsxt) {/*接受lh_pdbjsxt*/
    $(this).addClass("lh_pdd10d32dp");
    $(".lh_pdd10d2 p").append("<span name="+$(this).attr('name')+">"+$(this).text()+"<label>X</label></span>");
  }
  lh_scbjssxssnr();
})
/*****删除要搜索的内容*****/
function lh_scbjssxssnr(){/*装删除绑定*/
  $(".lh_pdd10d2 p").children("span").click(function(){/*删除要搜索的内容*/
    $(this).remove();/*删除当前标签*/
    $(".lh_pdd10d32 div").children("p[name="+$(this).attr("name")+"]").removeClass("lh_pdd10d32dp");/*删除下面对应的name的class*/
  })
}
/*清空要搜索的内容*/
$(".lh_pdd10d2qk").click(function(){
  $(".lh_pdd10d2 p").html("");/*清空要搜索的内容*/
  $(".lh_pdd10d32 div").children("p").removeClass("lh_pdd10d32dp");/*去掉class属性*/
})
/********背景筛选结束**********/


/***********背景和商品效果***************/
/*******背景选择效果*******/
$("#lh_pdbjyc1").click(function(){
  if ($(this).text()=="隐藏界面") {
  	$('.lh_pdbjxz').animate({left:"-15.5%"},1000);/*滑动隐藏*/
    /*$('.lh_pdbjxz').animate({width: '0',opacity: 'hide'},1000);/*滑动隐藏背景选择*/
    $(this).animate({left:"0"},1000);/*滑动*/
    $(this).text("显示界面");
  }
  else{
  	 /*$('.lh_pdbjxz').animate({width: '15%',opacity: 'show'},1000);/*滑动显示背景选择*/
  	 $('.lh_pdbjxz').animate({left:"0%"},1000);/*滑动显示*/
    $(this).animate({left:"15.5%"},1000);//滑动
  	$(this).text("隐藏界面");
  }
})
/*******商品选择效果*******/
$("#lh_pdbjyc2").click(function(){
  if ($(this).text()=="隐藏界面") {
    /*$('.lh_pdspxz').animate({width: '0',opacity: 'hide'},1000);/*滑动隐藏背景选择*/
    $('.lh_pdspxz').animate({right:"-15.5%"},1000);/*滑动隐藏*/
    $(this).animate({right:"0"},1000);/*滑动*/
    $(this).text("显示界面");
  }
  else{
  	/*$('.lh_pdspxz').animate({width: '15%',opacity: 'show'},1000);/*滑动显示背景选择*/
  	 $('.lh_pdspxz').animate({right:"0%"},1000);/*滑动显示*/
    $(this).animate({right:"15.5%"},1000);/*滑动*/
  	$(this).text("隐藏界面");
  }
})

/***************************历史记录************************/
/****左滑动事件****/
$(".lh_pdjt2").click(function(){
  var lh_pdsplswi = $(".lh_pdd51n2 .lh_pdd51n2d").length*144;/*获取商品历史宽度*/
  var lh_pdbjlswi = $(".lh_pdd51n1 .lh_pdd51n1d").length*201.6;/*获取背景历史宽度*/
  var lh_pdsplsml = $(".lh_pdd51n2").css("margin-left");/*获取商品magin-left的值*/
  var lh_pdsplsmlsz = parseInt(lh_pdsplsml);/*转换成数字*/
  var lh_pdbjlsml = $(".lh_pdd51n1").css("margin-left");/*获取背景magin-left的值*/
  var lh_pdbjlsmlsz = parseInt(lh_pdbjlsml);/*转换成数字*/
  if ($(".lh_pdd51n1").hasClass("hide")) {/*判断背景历史是否隐藏*/
    if ((-lh_pdsplsmlsz)<lh_pdsplswi-1008) {
      $(".lh_pdd51n2").animate({marginLeft:lh_pdsplsmlsz-1008+"px"},2000);
    }
  }
  else{
    if ((-lh_pdbjlsmlsz)<lh_pdbjlswi-1008) {
      $(".lh_pdd51n1").animate({marginLeft:lh_pdbjlsmlsz-1008+"px"},2000);
    }
  }
})
/****右滑动事件****/
$(".lh_pdjt1").click(function(){
  var lh_pdsplsml = $(".lh_pdd51n2").css("margin-left");/*获取商品magin-left的值*/
  var lh_pdsplsmlsz = parseInt(lh_pdsplsml);/*转换成数字*/
  var lh_pdbjlsml = $(".lh_pdd51n1").css("margin-left");/*获取背景magin-left的值*/
  var lh_pdbjlsmlsz = parseInt(lh_pdbjlsml);/*转换成数字*/
  if ($(".lh_pdd51n1").hasClass("hide")) {/*判断背景历史是否隐藏*/
    if (lh_pdsplsmlsz<0) {
      $(".lh_pdd51n2").animate({marginLeft:lh_pdsplsmlsz+1008+"px"},2000);
    }
  }
  else{
   // alert(lh_pdbjlsmlsz);alert(lh_pdbjlswi);
    if (lh_pdbjlsmlsz<0) {
      $(".lh_pdd51n1").animate({marginLeft:lh_pdbjlsmlsz+1008+"px"},2000);
    }
  }
})


function lh_pdspbd(){/***历史记录商品内容的显示隐藏删除数据绑定***/
  $(".lh_pdd51n2d").mouseenter(function(){/*鼠标移到图片处显示*/
    $(this).find(".lh_pdht1").show();
  })
  $(".lh_pdd51n2d").mouseleave(function(){/*鼠标移走图片处隐藏*/
    $(this).find(".lh_pdht1").hide();
  })
  $(".lh_pdht1").mouseenter(function(){/*鼠标移到详情处显示*/
    $(this).show();
  })
  $(".lh_pdht1").mouseleave(function(){/*鼠标移走详情处隐藏*/
    $(this).hide();
  })
  $(".lh_x").mouseenter(function(){/*鼠标移到删除图片处显示*/
    $(this).parents(".lh_pdd51n2d").find(".lh_pdht1").show();
  })
  $(".lh_x").mouseleave(function(){/*鼠标移走删除图片处隐藏*/
    $(this).parents(".lh_pdd51n2d").find(".lh_pdht1").hide();
  })
  /****历史记录的标签删除****/
  $(".lh_x").click(function(){
    $(this).parents(".lh_pdd51n2d").remove();
  })
}

/**商品历史记录的添加**/
$(".lh_pdspxz div").find("img").click(function(){
  $(".lh_pdd51n1").attr("class","lh_pdd51n1 hide");/*隐藏背景历史记录*/
  $(".lh_pdd51n2").attr("class","lh_pdd51n2");/*显示商品历史记录*/
	if($(".lh_pdd51n2 .lh_pdd51n2d").length<20){/*判断div中是否个数小于20*/
    /*给商品历史记录添加记录*/
    $(".lh_pdd51n2").prepend('<div class="lh_pdd51n2d"><div class="lh_pdht1" style="display: none;">'
            +'<div class="lh_pdht1d"><img src="images/lamp.jpg">'
            +'<p>品牌/欧普照明</p><p>风格/中式简约</p><p>材质/竹</p><p>规格/650X200厘米</p><p class="lh_pdht1p1">￥550.00</p>'
            +'<p class="lh_pdht1p2"><a href="">更多信息</a></p><p class="lh_pdht1p3">加入购物车</p></div>'
            +'<div class="lh_pdht1sj"><span></span></div></div>'
            +'<div class="lh_pdht2">'+$("<p>").append($(this).clone()).html()+'<img class="lh_x" src="images/x.jpg"></div></div>')
	}
  else{
    alert("够20了，删除最后一条记录，添加一条新的记录");
    $(".lh_pdd51n2 .lh_pdd51n2d").last().remove();/*删除最后一个记录*/
    /*给商品历史记录添加记录*/
    $(".lh_pdd51n2").prepend('<div class="lh_pdd51n2d"><div class="lh_pdht1" style="display: none;">'
            +'<div class="lh_pdht1d"><img src="images/lamp.jpg">'
            +'<p>品牌/欧普照明</p><p>风格/中式简约</p><p>材质/竹</p><p>规格/650X200厘米</p><p class="lh_pdht1p1">￥550.00</p>'
            +'<p class="lh_pdht1p2"><a href="">更多信息</a></p><p class="lh_pdht1p3">加入购物车</p></div>'
            +'<div class="lh_pdht1sj"><span></span></div></div>'
            +'<div class="lh_pdht2">'+$("<p>").append($(this).clone()).html()+'<img class="lh_x" src="images/x.jpg"></div></div>')
  }
  lh_pdspbd();/*执行数据绑定*/
})

function lh_pdbjbd(){/***背景删除绑定***/
  $(".lh_bx").click(function(){/**背景历史记录的删除**/
    $(this).parent(".lh_pdd51n1d").remove();
  })
}

$(".lh_pdbjxz div").children("img").click(function(){
  $(".lh_pdd51n1").attr("class","lh_pdd51n1");/*显示背景历史记录*/
  $(".lh_pdd51n2").attr("class","lh_pdd51n2 hide");/*隐藏商品历史记录*/
  if ($(".lh_pdd51n1 .lh_pdd51n1d").length<20) {/*判断div中是否个数小于20*/
    /*给背景历史记录添加记录*/
    $(".lh_pdd51n1").prepend('<p class="lh_pdd51n1d">'+$("<p>").append($(this).clone()).html()+'<img class="lh_bx" src="images/x.jpg"></p>');
  }
  else{
    alert("够20了，删除最后一条记录，添加一条新的记录");
    $(".lh_pdd51n1 .lh_pdd51n1d").last().remove();/*删除最后一个记录*/
     /*给背景历史记录添加记录*/
    $(".lh_pdd51n1").prepend('<p class="lh_pdd51n1d">'+$("<p>").append($(this).clone()).html()+'<img class="lh_bx" src="images/x.jpg"></p>');
  }
  lh_pdbjbd();/*执行数据绑定*/
})

/*网页离开事件*/
window.onbeforeunload = function(event){
	//return confirm("确定离开此页面吗?");
}
