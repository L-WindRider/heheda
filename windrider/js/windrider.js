(function(window,undefined) {
    window.windRider = new Object();//声明
    /**获取URL**/
    windRider.getQuery = function(name) {
		var url = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
        if (url != null) return unescape(url[2]);
        return null;
    };
    windRider.clipImage=function(Image,ClipWidth,Clipheight,resimg,fun){
        var canvas = document.createElement('canvas');
        // var canvas = document.getElementById('canvas');
        canvas.width=ClipWidth;
        canvas.height=Clipheight;
        var ctx = canvas.getContext('2d');
        Image.onload=function(){
            var clipwid =Image.width,cliphei =Image.width;
            if(Image.width>Image.height){ //当宽度大于高度
                clipwid=Image.height;
                cliphei=Image.height;
            }
            ctx.drawImage(Image,0,0,clipwid,cliphei,0,0,ClipWidth,ClipWidth);
           resimg.src=canvas.toDataURL("image/png");
           fun&&fun();
        };
    };

})(window);