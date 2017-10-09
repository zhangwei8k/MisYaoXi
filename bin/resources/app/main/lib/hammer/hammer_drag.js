function HammerDrag(pa) {

    //////////////
    //1.1运用于终端的拖动（修改原来HammerScroll）
    //1.1版只支持竖着拉,横竖拉，reset有大量未完成，position有大量未完成
    //1.2版：加入scroll的支持（仅支持Y轴）
    //1.2.1:改进了pa.id可以支持DOM
    this.version = "1.2.1";
    this.version_update = "2015-11-7";
    //参数及结构说明
    //结构:<div id="ID"><div class="_box"></div></div>
    //id:拖动框的id或class
    //tp:x,y,all 拖动的类型左右或上下或全部
    //overstop 超出区域是否马上停止，默认false
    //scroll
    //scroll结构：<div id="ID"><div class="_box"></div></div>
    //scrollY id:拖动框的scroll的id或class
    //scrollX 同上

    if(!(this  instanceof HammerDrag)) return new HammerDrag(pa);

    var animEndEventNames = {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
    };
    this.AnimationEndName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];

    var dom;
    (typeof pa.id=='string') ? dom = $(pa.id) : dom = pa.id;
    this.$dom  = dom;
    this.body = this.$dom[0];

    this.height = this.$dom.height();
    this.width = this.$dom.width();
    if(!this.height || !this.width) alert("HammerDrag配置错误");

    this.$box = this.$dom.find("._box");
    this.box  = this.$box[0];
    this.$box.css({"overflow":"hidden"});
    this.boxW = this.$box.width();
    this.boxH = this.$box.height();
    this.px = parseInt(this.boxW)/10;
    this.py = parseInt(this.boxH)/10;

    this.tp = pa.tp;

    //目前box框处于的位置情况
    this.x = 0;
    this.y = 0;

    //超出区域是否马上停止，默认false
    this.overstop = pa.overstop;

    //scroll滚动条
    if(pa.scrollY) {
        this.scrollY = true;
        this.$scrollYBox = $(pa.scrollY);
        this.$scrollYBar = $(pa.scrollY+" ._box");
        this.scrollYBar = this.$scrollYBar[0];

        //bar修正
        if(parseInt(this.boxH)<=parseInt(this.height)){
            this.scrollY = false;
            this.$scrollYBox.hide();
        }else{
            var BarH = (this.height*this.$scrollYBox.height())/this.boxH;
            this.$scrollYBar.height(BarH);
        }

        this.scrollYHeight = this.$scrollYBox.height()-this.$scrollYBar.height();
    }

    //建立$hammer类
    this.hammer = new Hammer.Manager(this.body);

    if(pa.tp=="all"){

        alert("HammerDrag 1.1版不支持全位置拖动");
        return;

    }else if(pa.tp=="y"){

        //可移动的最大区域
        if(parseInt(this.boxH)>parseInt(this.height))
            this.h = parseInt(this.boxH)-parseInt(this.height);
        else this.h = 0;

        this.direction = Hammer.DIRECTION_VERTICAL;
        this.hammer.add(new Hammer.Pan({ direction: this.direction, threshold: 10 }));
        this.hammer.on("panstart", Hammer.bindFn(this.onPanStartY, this));
        this.hammer.on("panmove", Hammer.bindFn(this.onPanMoveY, this));
        this.hammer.on("panend", Hammer.bindFn(this.onPanEndY, this));

    }else if(pa.tp=="x"){

        //可移动的最大区域
        if(parseInt(this.boxW)>parseInt(this.width))
            this.w = parseInt(this.boxW)-parseInt(this.width);
        else this.w = 0;

        this.direction = Hammer.DIRECTION_HORIZONTAL;
        this.hammer.add(new Hammer.Pan({ direction: this.direction, threshold: 10 }));
        this.hammer.on("panstart", Hammer.bindFn(this.onPanStartX, this));
        this.hammer.on("panmove", Hammer.bindFn(this.onPanMoveX, this));
        this.hammer.on("panend", Hammer.bindFn(this.onPanEndX, this));

    }else{

        alert("HammerDrag tp参数设置错误");
        return;

    }

}

//竖向Pan
HammerDrag.prototype.onPanStartY = function(){

    this.box.style.transition = "";
    this.box.style.webkitTransition = "";

    if(this.scrollY){
        this.scrollYBar.style.transition = "";
        this.scrollYBar.style.webkitTransition = "";
    }

};
HammerDrag.prototype.onPanMoveY = function(ev){

    var y = parseInt(ev.deltaY)+parseInt(this.y);

    if(this.overstop){
        if(y>0 || y<-this.y) return;
    }

    var translate = 'translate(0, ' + y + 'px)';
    this.box.style.transform = translate;
    this.box.style.webkitTransform = translate;

    if(this.scrollY){
        var BarY = -(y*this.scrollYHeight)/(this.boxH-this.height);
        if(BarY<0) BarY=0;
        if(BarY>this.scrollYHeight) BarY = this.scrollYHeight;

        var BarTranslate = 'translate(0, ' + BarY + 'px)';
        this.scrollYBar.style.transform = BarTranslate;
        this.scrollYBar.style.webkitTransform = BarTranslate;
    }

};
HammerDrag.prototype.onPanEndY = function(ev){

    var y , p;
    //计算缓动距离
    p = parseInt(this.py)*(Math.abs(parseInt(ev.velocity))+1);

    if(parseInt(ev.deltaY)<0) y = parseInt(this.y) + parseInt(ev.deltaY)-p;
    else if(parseInt(ev.deltaY)>0) y = parseInt(this.y)+ parseInt(ev.deltaY)+p;

    if(!y) return;

    if(y>0) {
        y = 0;
        this.y = 0;
    }else if(y<-this.h) {
        y=-this.h;
        this.y = y;
    }else{
        this.y = y;
    }

    this.box.style.transition = "transform .4s ease-out";
    this.box.style.webkitTransition = "transform .4s ease-out";
    var translate = 'translate(0, ' + y + 'px)';
    this.box.style.transform = translate;
    this.box.style.webkitTransform = translate;

    if(this.scrollY){
        var BarY = -(y*this.scrollYHeight)/(this.boxH-this.height);
        if(BarY<0) BarY=0;
        if(BarY>this.scrollYHeight) BarY = this.scrollYHeight;

        this.scrollYBar.style.transition = "transform .4s ease-out";
        this.scrollYBar.style.webkitTransition = "transform .4s ease-out";
        var BarTranslate = 'translate(0, ' + BarY + 'px)';
        this.scrollYBar.style.transform = BarTranslate;
        this.scrollYBar.style.webkitTransform = BarTranslate;
    }

};

//横向Pan
HammerDrag.prototype.onPanStartX = function(){

    this.box.style.transition = "";
    this.box.style.webkitTransition = "";

};
HammerDrag.prototype.onPanMoveX = function(ev){

    var x = parseInt(ev.deltaX)+parseInt(this.x);

    if(this.overstop){
        if(x>0 || x<-this.w) return;
    }

    var translate = 'translate(' + x + 'px , 0)';
    this.box.style.transform = translate;
    this.box.style.webkitTransform = translate;

};
HammerDrag.prototype.onPanEndX = function(ev){

    var x , p;
    p = parseInt(this.px)*(Math.abs(parseInt(ev.velocity))+1);

    if(parseInt(ev.deltaX)<0) x = parseInt(this.x) + parseInt(ev.deltaX)-p;
    else if(parseInt(ev.deltaX)>0) x = parseInt(this.x)+ parseInt(ev.deltaX)+p;

    if(!x) return;

    if(x>0) {
        x = 0;
        this.x = 0;
    }else if(x<-this.w) {
        x=-this.w;
        this.x = x;
    }else{
        this.x = x;
    }

    this.box.style.transition = "transform .4s ease-out";
    this.box.style.webkitTransition = "transform .4s ease-out";
    var translate = 'translate(' + x + 'px , 0)';
    this.box.style.transform = translate;
    this.box.style.webkitTransform = translate;

};


//重新设置HammerDrag
HammerDrag.prototype.reset = function(pa){

    if(pa.width) {
        this.$dom.css("width", pa.width + "px");
        this.width = pa.width;

        if(parseInt(this.boxW)>parseInt(this.width))
            this.w = parseInt(this.boxW)-parseInt(this.width);
        else this.w = 0;
    }
    if(pa.height) {
        this.$dom.css("height", pa.height+"px");
        this.height = pa.height;

        if(parseInt(this.boxH)>parseInt(this.height))
            this.h = parseInt(this.boxH)-parseInt(this.height);
        else this.h = 0;
    }

};

HammerDrag.prototype.box_reset = function(){

    this.boxW = this.$box.width();
    this.boxH = this.$box.height();

    if(parseInt(this.boxW)>parseInt(this.width))
        this.w = parseInt(this.boxW)-parseInt(this.width);
    else this.w = 0;

    if(parseInt(this.boxH)>parseInt(this.height))
        this.h = parseInt(this.boxH)-parseInt(this.height);
    else this.h = 0;


};

//设置拖动框的相对位置
HammerDrag.prototype.position = function(pa){

    if(!pa){
        return {x:this.x , y:this.y}
    }else{

        pa.x = parseInt(pa.x);
        pa.y = parseInt(pa.y);

        if(pa.x || pa.x===0){
            if(!pa.no_mov){
                this.box.style.transition = "transform .4s ease-out";
                this.box.style.webkitTransition = "transform .4s ease-out";
            }
            var translate = 'translate(' + pa.x + 'px , 0)';
            this.box.style.transform = translate;
            this.box.style.webkitTransform = translate;
            this.x = pa.x;
        }

        if(pa.y || pa.y===0){
            if(!pa.no_mov){
                this.box.style.transition = "transform .4s ease-out";
                this.box.style.webkitTransition = "transform .4s ease-out";
            }
            var translate = 'translate(0 , ' + pa.y + 'px)';
            this.box.style.transform = translate;
            this.box.style.webkitTransform = translate;
            this.y = pa.y;
        }
    }

};

//拖动层到最下
HammerDrag.prototype.toEndY = function(){

    this.box.style.transition = "transform .4s ease-out";
    this.box.style.webkitTransition = "transform .4s ease-out";
    var translate = 'translate(0, ' + (this.height-this.boxH) + 'px)';
    this.box.style.transform = translate;
    this.box.style.webkitTransform = translate;

};
//拖动层到最上
HammerDrag.prototype.toTopY = function(){

    this.box.style.transition = "transform .4s ease-out";
    this.box.style.webkitTransition = "transform .4s ease-out";
    var translate = 'translate(0, ' + 0 + 'px)';
    this.box.style.transform = translate;
    this.box.style.webkitTransform = translate;
};