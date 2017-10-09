
var canvas =[];
var canvas_loaded = [];
//加载
var canvas_loads = function(manifest, fn, src){
    var preload = new createjs.LoadQueue();
    if(fn.Progress) preload.on("progress", fn.Progress);
    if(fn.Complete) preload.on("complete", fn.Complete);
    preload.on("fileload", function(ev){
        var id = ev.item.id;
        canvas_loaded[id] = ev.currentTarget._loadedResults[id];
        if(fn.FileLoad) fn.FileLoad(ev);
    });

    if(!src) src = "src/";
    var loading = new Array();
    for(var i in manifest){
        if(!canvas_loaded[manifest[i].id]){
            loading.push(manifest[i]);
        }
    }

    preload.loadManifest(loading, true, src);
};


function Canvas(id, loaded){

    //已经运行过的view
    this.viewRuned = [];
    //已经加载的图片
    if(!loaded) this.loaded = canvas_loaded;
    else this.loaded = loaded;

    ////图片
    //this.img = [];
    ////视频
    //this.video = [];
    ////精灵图
    //this.sprite = [];
    //其他节点
    this.dom = [];
    //容器
    this.cc = [];

    //画布
    this.canvas = document.getElementById(id);
    //createJs舞台
    this.stage = new createjs.Stage(this.canvas);
    createjs.Touch.enable(this.stage);

}




Canvas.prototype.run = function(fps){
    createjs.Ticker.setFPS(fps);
    createjs.Ticker.addEventListener("tick", this.stage);
};

Canvas.prototype.ccv = function(key, pa){
    if(this.cc[key]) return;

    this.cc[key] = new createjs.Container();

    if(pa) {
        for(var it in pa){
            this.cc[id][it] = pa[it];
        }
    }
};

//画图
//id:加载的id
//pa:配置图片的x,y,透明度等
Canvas.prototype.drawImg = function(cc, id, pa, img){
    if(!this.dom[id]) {
        if(!img) img = this.loaded[id];
        this.dom[id] = new createjs.Bitmap(img);

    }

    if(pa) {
        for(var it in pa){
            this.dom[id][it] = pa[it];
        }
    }

    if(cc) {
        if(cc=="stage") this.stage.addChild(this.dom[id]);
        else this.cc[cc].addChild(this.dom[id]);
    }
};

//视频
//id:加载的id
//pa:配置图片的x,y,透明度等
Canvas.prototype.drawVideo = function(cc, id, pa, video){
    if(!this.dom[id]) {
        if(!video) video = this.loaded[id];
        this.dom[id] = new createjs.Bitmap(video);
    }

    if(pa) {
        for(var it in pa){
            this.dom[id][it] = pa[it];
        }
    }

    if(cc) {
        if(cc=="stage") this.stage.addChild(this.dom[id]);
        else this.cc[cc].addChild(this.dom[id]);
    }
};

//精灵图
//id:加载的id
//pa.json:对应flash-zoe导出的json(width,height,x,y)
//pa.mov:对应sprite的spriteSheet->animations
//pa.conf:配置this.sprite的属性
Canvas.prototype.drawSprite = function(cc, id, pa, img){
    if(!this.dom[id]) {
        if(!pa) pa = {};
        if(!pa.framerate) pa.framerate = 15;

        if(!img) img = [this.loaded[id]];
        var spriteSheet = new createjs.SpriteSheet({
            framerate: pa.framerate,
            "images": img,
            "frames": {width:pa.json[0], height:pa.json[1]},
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
            //pa.mov 格式{"ini":[0,0]}
            "animations": pa.mov
        });

        this.dom[id] = new createjs.Sprite(spriteSheet, "ini");
        this.dom[id].x = pa.json[2];
        this.dom[id].y = pa.json[3];
        if(pa.conf){
            for(var it in pa.conf){
                this.dom[id][it] = pa.conf[it];
            }
        }
    }

    if(cc) {
        if(cc=="stage") this.stage.addChild(this.dom[id]);
        else this.cc[cc].addChild(this.dom[id]);
    }
};

Canvas.prototype.drawArea = function(cc, id, rect, color, pa){

    if(!this.dom[id]) {
        var gra = new createjs.Graphics().beginFill(color).drawRect(rect[0],rect[1],rect[2],rect[3]);
        this.dom[id] = new createjs.Shape(gra);
    }

    if(pa){
        for(var it in pa){
            this.dom[id][it] = pa[it];
        }
    }

    if(cc) {
        if(cc=="stage") this.stage.addChild(this.dom[id]);
        else this.cc[cc].addChild(this.dom[id]);
    }

};

Canvas.prototype.draw = function(cc , doms, fn){

    var dom;
    if(cc) dom = this.cc[cc];
    else dom = this.stage;

    for(var i in doms){
        dom.addChild(this.dom[doms[i]]);
    }

    if(fn) fn();
};

//清理
Canvas.prototype.clsDom = function(cc , dom){
    if(!cc) this.stage.removeChild(this.dom[dom]);
    else this.cc[cc].removeChild(this.dom[dom]);
};

//动画
Canvas.prototype.mov = function(dom, pa, time, wait, fn){
    if(!wait) wait = 0;
    var target = createjs.Tween.get(this.dom[dom]).wait(wait).to(pa, time);

    if(fn) target.call(fn);
};


Canvas.prototype.set = function(id, pa){
    for(var it in pa){
        this.cc[id][it] = pa[it];
    }
};
Canvas.prototype.show = function(id, mov, time, fn){

    this.stage.removeChild(this.cc[id]);
    this.stage.addChild(this.cc[id]);

    if(mov){
        var wait;
        if(mov.wait) wait = mov.wait;
        else wait = 0;
        this.mov(this.cc[id], mov, time, wait, fn);
    }

};
Canvas.prototype.hide = function(id, mov, time, fn){

    if(mov){
        var wait;
        if(mov.wait) wait = mov.wait;
        else wait = 0;

        this.mov(this.cc[id], mov, time, wait, function(){
            this.stage.removeChild(this.cc[id]);
            if(fn) fn();
        });
    }else{
        this.stage.removeChild(this.cc[id]);
    }

};


var create_act = {};
//上划
create_act.swipeUp = function(target, fn){
    var stageY;
    target.on("pressmove", function(ev){
        if(!stageY) stageY = ev.stageY;
    });
    target.on("pressup", function(ev){
        //if(!stageY) return;
        var des = stageY-ev.stageY;
        stageY = 0;
        if(des>10){
            if(fn) fn(des, ev);
        }
    });
};

//下划
create_act.swipeDown = function(target, fn){
    var stageY;
    target.on("pressmove", function(ev){
        if(!stageY) stageY = ev.stageY;
    });
    target.on("pressup", function(ev){
        //if(!stageY) return;
        var des = stageY-ev.stageY;
        stageY = 0;
        if(des<-10){
            if(fn) fn(des, ev);
        }
    });
};

//摇动
create_act.shake = function(fn){
    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", deviceMotionHandler, false);
    }

    var SHAKE_THRESHOLD = 3000;
    var last_update = 0;
    var x, y, z, last_x, last_y, last_z;
    function deviceMotionHandler(eventData) {
        var acceleration =eventData.accelerationIncludingGravity;
        var curTime = new Date().getTime();
        if ((curTime-last_update)> 100) {
            var diffTime = curTime -last_update;
            last_update = curTime;
            x = acceleration.x;
            y = acceleration.y;
            z = acceleration.z;
            var speed = Math.abs(x +y + z-last_x-last_y-last_z) / diffTime * 10000;
            if (speed > SHAKE_THRESHOLD) {
                fn();
            }
            last_x = x;
            last_y = y;
            last_z = z;
        }
    }
};