(function($) {
  $.getQuery = function(name) {
    var r = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
    if (r != null) return unescape(r[2]);
    return null;
  };
  $.goto = function(url, data) {
    window.location.href = url + (data ? "?" + $.param(data) : "");
  };
  $.clipImage = function (Image, ClipWidth, Clipheight, resimg, fun) {
        var canvas = document.createElement('canvas');
        canvas.width = ClipWidth;
        canvas.height = Clipheight;
        var ctx = canvas.getContext('2d');
        Image.onload = function () {
            var clipwid = Image.width, cliphei = Image.width;
            if (Image.width > Image.height) { //当宽度大于高度
                clipwid = Image.height;
                cliphei = Image.height;
            }
            ctx.drawImage(Image, 0, 0, clipwid, cliphei, 0, 0, ClipWidth, ClipWidth);
            resimg.src = canvas.toDataURL("image/png");
            fun && fun();
        };
    };
})($);
window.Game = {
  start: function() {
    start();
    var open = $.getQuery("open");
    if (open) window.callAs("open", open);
  },
  goto: function(url, data) {
    $.goto(url, data);
  },
  exit: function() {},
  home: function() {
    $.goto("../");
  },
  reload: function() {
    window.location.reload();
  },
  pay: function(order) {
    $.goto("pay.html?url=" + base64.encode(order));
  },
  game: function(id) {
    if (id == 1) {
      $.goto(cfg.sgj);
    } else if (id == 2) {
      $.goto(cfg.hlcz);
    } else if (id == 3) {
      $.goto(cfg.brnn);
    } else if (id == 8) {
      $.goto(cfg.sss);
    } else {
      return false;
    }
    return true;
  }
};
var box, bar, loadingId, progress = 0;

function loading(max, step, cb) {
  clearInterval(loadingId);

  function run() {
    progress += step;
    if (progress >= max) {
      progress = max;
      clearInterval(loadingId);
      cb && setTimeout(cb, 500);
    }
    bar.style.width = progress.toFixed(2) + "%";
  }
  loadingId = setInterval(run, 100);
};

function start() {
  loading(100, 100, function() {
    box.style.display = "none";
  });
};

function init(url) {
  bar = document.getElementById("bar");
  box = document.getElementById("loading");
  loading(80, 1);
};