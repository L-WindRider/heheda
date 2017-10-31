$(function(){
	waterfall();
	var dataInt={"data":[{"src":"3.jpg"},{"src":"4.jpg"},{"src":"5.jpg"},{"src":"6.jpg"},{"src":"7.jpg"}]};
	$(window).on("scroll",function () {
         if(checkScrollSlide){
             $.each(dataInt.data,function (key,value) {
                 var oBox=$("<div>").addClass("box").appendTo($("#container"));
                 //jQuery支持连缀,隐式迭代;
                 var oPic=$("<div>").addClass('pic').appendTo($(oBox));
                 $("<img>").attr("src","images/"+$(value).attr("src")).appendTo(oPic);
             });
             waterfall();
         }
     });
});
// 实现图片瀑布流布局
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
 };
// 实现滚动加载图片
function checkScrollSlide(){
//	var $lastBox=$("#container").childern('div').last();
	var $lastBox=$("#container").last();
	var lastBoxDis=$lastBox.offset().top+Math.floor($lastBox.outerHeight()/2);
    var scrollTop=$(window).scrollTop();
    var documentH=$(window).height();
    return (lastBoxDis<scrollTop+documentH)?true:false;
}