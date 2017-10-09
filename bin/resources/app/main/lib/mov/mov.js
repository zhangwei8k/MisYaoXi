function Mov(){
    //////////////
    //2.0 不需要支持mov_config,做了大量改动
    this.version = "1.2.0";
    this.version_update = "2015-12-19";

    this.cls = function(id){
        var dom;
        (typeof id=='string') ? dom = $(id) : dom = id;

        //清理
        var movCls = dom.attr("data-mov");
        if(movCls) dom.removeClass(movCls);
    };
}

Mov.prototype.turn = function(pa , fn){
    //可用参数 id , mov , wait , fn , fn_before
    var _unable = Dom._unable;
    if(pa.unable) _unable = null;
    if(_unable) _unable.show();

    //----------------------
    var dom = new Array;
    (typeof pa.id[0]=='string') ? dom[0] = $(pa.id[0]) : dom[0] = pa.id[0];
    (typeof pa.id[1]=='string') ? dom[1] = $(pa.id[1]) : dom[1] = pa.id[1];
    if(dom[0][0].innerHTML == dom[1][0].innerHTML) {
        return false;
    }

    if(fn && !fn.length) pa.come_after = fn;
    if(fn && fn.length){
        if(fn["fn_before"]) pa.fn_before = fn["fn_before"];
        if(fn["come_after"]) pa.come_after = fn["come_after"];
        if(fn["go_after"]) pa.go_after = fn["go_after"];
    }

    //清理
    var mov0 = dom[0].attr("data-mov");
    if(mov0) dom[0].removeClass(mov0);
    var mov1 = dom[1].attr("data-mov");
    if(mov1) dom[1].removeClass(mov1);

    var z0 = dom[0].css("z-index");
    var z1 = dom[1].css("z-index");
    if(!z0) z0 = 0;
    dom[0].css("z-index", z0+98);
    dom[1].css("z-index", z0+99);

    //wait
    if(pa.wait){
        setTimeout(function(){
            $animation();
        }, pa.wait);
    }else $animation();

    function $animation(){

        if(pa.fn_before) pa.fn_before();

        dom[0].show();
        dom[1].show();
        dom[0].addClass(pa.mov[0]).attr("data-mov" , pa.mov[0]).one(AnimationEndName, function(){
            if(pa.go_after) pa.go_after();
            return false;
        });
        dom[1].addClass(pa.mov[1]).attr("data-mov" , pa.mov[1]).one(AnimationEndName, function(){

            dom[0].css("z-index", z0);
            dom[1].css("z-index", z1);

            if(_unable) _unable.hide();
            if(pa.come_after) pa.come_after();
            return false;
        });

    }

};

Mov.prototype.mov = function(pa , fn){
    //可用参数 id , mov, cls, hide, zIndex, visible, wait , fn , (show替换cls)
    var _unable = Dom._unable;
    if(pa.unable) _unable = null;
    if(_unable) _unable.show();

    if(fn) pa.fn = fn;

    var dom;
    (typeof pa.id=='string') ? dom = $(pa.id) : dom = pa.id;

    var movCls = dom.attr("data-mov");
    if(movCls) dom.removeClass(movCls);

    if(pa.wait) setTimeout($mov_run, pa.wait);
    else $mov_run();

    function $mov_run(){
        dom.show();
        dom.addClass(pa.mov).attr("data-mov" , pa.mov).one(AnimationEndName, function(){

            if(pa.hide) {
                dom.hide();
                dom.removeClass(pa.mov);
            }
            if(!pa.show) {
                dom.removeClass(pa.mov);
            }
            if(_unable) _unable.hide();

            if(pa.fn) pa.fn();

            return false;

        });

    }

};


//动画函数
var cc  = new Mov();