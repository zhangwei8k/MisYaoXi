//////////////////////////// Lock辅助锁函数 ///////////////////////////////
var Lock = {};
//运行锁，加1锁减1锁
Lock.nm  = new Array();
Lock.len = new Array();
Lock.set = function(nm){
    if(!Lock.nm[nm]) {
        Lock.nm[nm]  = 1;
        Lock.len[nm] = 1;
    } else {
        Lock.nm[nm]++;
        Lock.len[nm]++;
    }
};
Lock.cls = function(nm, fn){
    if(Lock.nm[nm]<=0) {
        Lock.nm[nm] = 0;
        //Log("【Lock.cls】=>Bug : Lock"+nm+"为0时还有cls事件");
    }else if(!Lock.nm[nm]){
        Lock.nm[nm] = 0;
        //Log("【Lock.cls】=>Bug : Lock"+nm+"不存在并有cls事件");
    }else {
        //Log("【Lock.cls】:被解锁"+nm);
        Lock.nm[nm] = parseInt(Lock.nm[nm])-1;
        if(fn) fn();
    }
};
Lock.open = function(nm, t, fn){
    var hand_num = 0;
    var hand = setInterval(function(){
        hand_num++;

        //Log("@【Lock.open】:试探"+hand_num+"次，用时"+(hand_num*t/1000)+"秒");

        if(Lock.nm[nm]==0) {
            //Log("@【Lock.open】完成");
            clearInterval(hand);
            setTimeout(function(){ fn(); },3);
        }
        if(hand_num==90) {
            //Log("@【Lock.open】-bug:试探"+hand_num+"次，用时"+(hand_num*t/1000)+"秒，现在要继续运行了");
            clearInterval(hand);
            setTimeout(function(){ fn(); },3);
        }
    }, t);
};
//等待多少时间开始运行下一个程序
Lock.hand = new Array();
Lock.wait = function(pa, fn){
    //pa.nm 关键字
    //pa.time 等待时间
    //pa.fn 等待每1秒的回调函数
    //fn 完成后的回调函数
    //Log("【Lock.wait】("+pa.nm+")：等待"+pa.time+"秒,开始运行程序");

    var time = 0;
    Lock.hand[pa.nm] = setInterval(function(){
        time++;
        //Log("@【Lock.wait】("+pa.nm+")：等待中，运行了"+time+"秒");
        if(pa.fn) pa.fn(time);

        if(time>=pa.time) {
            //Log("@【Lock.wait】("+pa.nm+")：等待完成，运行了"+time+"秒");
            clearInterval(Lock.hand[pa.nm]);

            setTimeout(function(){ if(fn)fn(); },1);
        }
    }, 1000);
};
Lock.wait_cls = function(nm){
    //Log("【Lock.wait_cls】("+nm+")：清理完毕");
    clearInterval(Lock.hand[nm]);
};

//触发后，要等到某一项目完成，才能继续触发
Lock.trap_mk = new Array();
Lock.trap = function(nm){
    //Log("【Lock.trap】("+nm+")：触发后，要等到某一项目完成");

    if(!Lock.trap_mk[nm]) {
        Lock.trap_mk[nm]=1;
        //Log("【Lock.trap】("+nm+")：处于开放状态，开始运行=>之后将被关闭");
        return true;
    }
    if(Lock.trap_mk[nm]==1){
        //Log("【Lock.trap】("+nm+")：处于关闭状态，不允许运行");
        return false;
    }
    if(Lock.trap_mk[nm]==2){
        Lock.trap_mk[nm]=0;
        //Log("【Lock.trap】("+nm+")：处于开放状态，开始运行=>之后将被关闭");
        return true;
    }
};
Lock.trap_cls = function(nm){
    //Log("【Lock.trap_cls】("+nm+")：清理完毕");
    Lock.trap_mk[nm]=2;
};

//开关按钮，点击后默认3秒后才能继续点击
Lock.btn_mk = new Array();
Lock.btn = function(nm, time){
    //Log("【Lock.btn】("+nm+")：开关按钮,点击后默认3秒后才能继续点击("+time+")");

    if(!time) time=3;
    if(!Lock.btn_mk[nm]){
        Lock.btn_mk[nm]=1;
        setTimeout(function(){
            //Log("@【Lock.btn】("+nm+")：处于开放状态间隔"+time+"秒");
            Lock.btn_mk[nm]=0;
        }, time*1000);
        return true;
    }else{
        //Log("【Lock.btn】("+nm+")：处于关闭状态，不能运行");
        return false;
    }
};
