(function(windrider) {
    windrider.wr = new Object();//声明
    wr.getQuery = function(name) {
		var url = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
        if (url != null) return unescape(url[2]);
        return null;
	};
}(this));