function HammerSlider(pa) {

    if(!(this  instanceof HammerSlider)) return new HammerSlider(pa);

    //////////////
    //1.1修改支持jq
    //1.1只支持横向拖动
    //1.1.1去掉了外围css的animate
    this.version = "1.1.1";
    this.version_update = "2015-11-9";
    //结构:<div id="ID"><div class="_box"><div class="_item"></div></div></div>
    //id:dom
    //group:多少个模块_itme为一个组
    //width：插件的宽度
    //page:{now:dom, max:dom} : 制作1/3这样的分页效果
    //point:dom 点的框

    var animEndEventNames = {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
    };
    this.AnimationEndName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];

    this.$dom  = $(pa.id);
    this.body = this.$dom[0];
    this.$box = this.$dom.find("._box");
    this.box = this.$box[0];

    this.hammer = new Hammer.Manager(this.body);

    this.direction = Hammer.DIRECTION_HORIZONTAL;
    this.panes = this.$dom.find("._box")[0];
    this.length = this.panes.children.length;
    if (pa.group) this.length = Math.ceil(this.length / pa.group);

    this.width = pa.width;
    this.index = 0;

    this.panes.style.width = (this.length*pa.width+100)+"px";

    this.$page_now = false;
    if(pa.page){
        this.$page_now = $(pa.page.now);
        this.$page_max = $(pa.page.max);
        if(this.$page_now.length) this.$page_now.html('1');
        if(this.$page_max.length) this.$page_max.html(this.length);
    }

    this.$point = false;
    if(pa.point){
        this.$point = $(pa.point);
        if(parseInt(this.length)<=1) {
            this.$point = false;
            return;
        }

        if(this.$point.length){
            var point_html = "<ul>";
            for(var i=0; i<this.length; i++){
                point_html+= '<li></li>';
            }
            point_html+= "</ul>";
            this.$point.html(point_html);
            this.$point.find("li:first").addClass("act");

            var pw = this.$point.width();
            this.$point.css("margin-left", -(pw/2));
        }

    }

    this.onPan = function (ev) {
        //拖过的方向确定返回deltaX / deltaY
        var delta = ev.deltaX;
        //这是移动的一个比例
        var percent = (100 / this.width) * delta;
        var animate = false;

        //放开鼠标后,把animate设置成true，让层自动靠边
        if (ev.type == 'panend' || ev.type == 'pancancel') {
            if (Math.abs(percent) > 2 && ev.type == 'panend') {
                this.index += (percent < 0) ? 1 : -1;
            }
            percent = 0;
            animate = true;
        }

        this.onShow(this.index, percent, animate);
    };

    this.hammer.add(new Hammer.Pan({ direction: this.direction, threshold: 10 }));
    this.hammer.on("panstart panmove panend pancancel", Hammer.bindFn(this.onPan, this));
    this.onShow(this.index);
}

//主体框显示及动画
HammerSlider.prototype.onShow = function(showIndex, percent, animate){
    showIndex = Math.max(0, Math.min(showIndex, this.length - 1));
    percent = percent || 0;

    if(animate) {
        var transition = 'all .7s';
        this.box.style.transition = transition;
        this.box.style.webkitTransition = transition;
    } else {
        this.box.style.transition = "";
        this.box.style.webkitTransition = "";
    }

    var pos, translate;
    pos = (this.width / 100) * ((-showIndex * 100) + percent);
    translate = 'translate3d(' + pos + 'px, 0, 0)';
    this.panes.style.webkitTransform = translate;

    this.index = showIndex;

    if(this.$page_now) this.$page_now.html(showIndex+1);
    if(this.$point) {
        this.$point.find("li").removeClass("act");
        this.$point.find("li:eq("+showIndex+")").addClass("act");
    }

};

HammerSlider.prototype.onPre = function(){
    var percent = 0;
    if(this.index == 0){
        percent = 13;

        var _this = this;
        setTimeout(function(){
            _this.onShow(_this.index, 0, true);
        }, 500)
    }
    this.onShow(this.index-1, percent, true);
};

HammerSlider.prototype.onNext = function(){
    var percent = 0;
    if(this.index == this.length-1){
        percent = -13;

        var _this = this;
        setTimeout(function(){
            _this.onShow(_this.index, 0, true);
        }, 500)
    }
    this.onShow(this.index+1, percent, true);
};