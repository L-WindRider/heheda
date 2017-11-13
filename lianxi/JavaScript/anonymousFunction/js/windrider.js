(function(window,undefined) {
    window.windRider = new Object();//声明
    windRider.getQuery = function(name) {
		var url = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
        if (url != null) return unescape(url[2]);
        return null;
	}
	windRider.Alert=function(name){
        alert(name);
    }
})(window);