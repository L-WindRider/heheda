
	 $(window).on("load",function () {
     waterfall();
	var dataInt={"data":[{"src":"3.jpg"},{"src":"4.jpg"},{"src":"5.jpg"},{"src":"6.jpg"},{"src":"7.jpg"}]};
     //模拟json数据;
     $(window).on("scroll",function () {
         if(checkScrollSlide){
             $.each(dataInt.data,function (key,value) {
                 var oBox=$("<div>").addClass("box").appendTo($("#container"));
                 var oPic=$("<div>").addClass('pic').appendTo($(oBox));
                 $("<img>").attr("src","images/"+$(value).attr("src")).appendTo(oPic);
             });
             waterfall();
         }
     })
 });
 //流式布局主函数;
 function waterfall () {
     var $boxs=$("#container>div");
     var w=$boxs.eq(0).outerWidth();
     var cols=Math.floor($(window).width()/w);
     $("#container").width(w*cols).css("margin","0 auto");
     var hArr=[];
     $boxs.each(function (index,value) {
         var h=$boxs.eq(index).outerHeight();
         if (index<cols) {
             hArr[index]=h;
         } else{
             var minH=Math.min.apply(null,hArr);
             var minHIndex=$.inArray(minH,hArr);
             $(value).css({
                 "position":"absolute",
                 "top":minH+"px",
                 "left":minHIndex*w+"px"
             });
             hArr[minHIndex]+=$boxs.eq(index).outerHeight();
         };
     });
     // console.log(hArr);
 };
 function checkScrollSlide () {
     var $lastBox=$("#container>div").last();
     var lastBoxDis=$lastBox.offset().top+Math.floor($lastBox.outerHeight()/2);
     var scrollTop=$(window).scrollTop();
     var documentH=$(window).height();
     return (lastBoxDis<scrollTop+documentH)?true:false;
 }
	

