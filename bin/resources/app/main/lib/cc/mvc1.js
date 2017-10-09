//Version:1.5
//改动部份：room.ppt支持hide与show,支持fn回调函数
//Version-date:2016-1-13

//////////////////////////////// 基础数据 ////////////////////////////////
var Base;
//程序的数据集（多来自于数据库或json文件）
var Url = {};
var FS,http;
//用于页面其他节点
var Dom = {};
Dom._unable = $("#_unable");
Dom.__unable = $("#sys_unable");
Dom._loader = $("#Loader .word");
var Ask  = {};
var Hand = {};
var Data = {};


///////////////////////////////// Room /////////////////////////////////
//用于Room设置
//Rooms命名与ID命名的区别，ID:Product_* = Rooms:Product
var Room  = {};
var Rooms = {};
Rooms.Loader = {};
////房间函数
Room.nm  = "";//当前的房间的room关键字
Room.id  = "";//当前房间的id
Room.old = "";//离开的房间的id
Room.cc  = {};//所有的场景

Room.ini = function(type){
    for(var id in Rooms) {
        if(Rooms[id].dom) Rooms[id].dom();

        if(type!="act" && Rooms[id].io) Rooms[id].io();
        if(type!="io" && Rooms[id].act) Rooms[id].act();
    }
    setTimeout(function(){
        $("section.cc").each(function(){
            var dom = $(this);
            Room.cc[dom.attr("id")] = dom;
        });
        console.log("建立层",Room.cc);
    }, 500);
};

Room.set = function(id, nm){
    Room.nm  = nm;
    Room.old = Room.id;
    Room.id  = id;
};

Room.off = false;//开关程序
Room.wait = 0;
Room.pa  = null;
Room.finish = function(){
    Room.nm = Room.pa.come.room;
    Room.id = Room.pa.come.id;
    Room.old = Room.pa.go.id;

    if(Room.wait){
        setTimeout(function(){
            Dom._unable.hide();
            Room.off = false;
            Room.wait = 0;
        }, Room.wait);
    }else{
        Dom._unable.hide();
        Room.off = false;
    }

};
Room.show = function(id){
    id = id.replace("#","");
    if(!Room.cc[id]){
        alert(id+"的cc层没有设置");
        return;
    }

    Room.cc[id].css("visibility" , "visible");
};
Room.hide = function(id){
    id = id.replace("#","");
    if(!Room.cc[id]){
        alert(id+"的cc层没有设置");
        return;
    }

    Room.cc[id].css("visibility" , "hidden");
};
Room.ppt = function(pa, callback){
    //{id:["go","come"] , mov:["go","come"] , off:"go/come" ， room:["go" , "come"], wait:*}
    //wait：过场后等待多少秒后才能用
    //console.log("out:",pa.id[0]);
    //console.log("in:",pa.id[1]);
    if(pa.id[0]==pa.id[1]) {
        if(callback) callback();
        return;
    }//判断是否自己重复过场
    if(Room.off) {
        if(callback) callback();
        return;
    }//是否可以下一个过场，过场开关状态

    //关闭（遮罩）重新操作或Rooms类的点击等操作
    Room.off = true;
    Dom._unable.show();
    if(pa.wait) Room.wait = pa.wait;

    //容错
    if(!pa.id[0] || !pa.id[1]) {
        console.log("id设置错误", pa);
        return;
    }
    pa.id[0] = pa.id[0].replace("#","");
    pa.id[1] = pa.id[1].replace("#","");
    if(!Room.cc[pa.id[0]]){
        Room.cc[pa.id[0]] = {};
    }
    if(!Room.cc[pa.id[1]]){
        Room.cc[pa.id[1]] = {};
    }
    //获取rooms命名
//    var go_nm = pa.id[0];
//    var go_nms = pa.id[0].split("_");
//    if(go_nms.length == 2) go_nm = go_nms[0];
//    var come_nm = pa.id[1].split("_");
//    var come_nms = pa.id[1].split("_");
//    if(come_nms.length == 2) come_nm = come_nms[1];

    //获取rooms的真正名称
    if(!pa.room){
        pa.room = new Array();
        pa.room[0] = pa.id[0];
        pa.room[1] = pa.id[1];
    }else{
        if(!pa.room[0]) pa.room[0] = pa.id[0];
        if(!pa.room[1]) pa.room[1] = pa.id[1];
    }
    //判断Rooms有没有{}定义
    if(!Rooms[pa.room[0]]){
        //alert("go Rooms."+pa.room[0]+"不存在！");
        //return;
        Rooms[pa.room[0]] = {};
    }
    if(!Rooms[pa.room[1]]){
        //alert("come Rooms."+pa.room[1]+"不存在！");
        //return;
        Rooms[pa.room[1]] = {};
    }

    //设置go与come
    pa.go = {id:pa.id[0] , mov:pa.mov[0], room:pa.room[0]};
    pa.come = {id:pa.id[1] , mov:pa.mov[1], room:pa.room[1]};
    //默认为等come_after运行完毕，而不是go_after
    if(!pa.off) pa.off = "come";

    Room.pa = pa;

    var $go = Room.cc[pa.go.id];
    var $come = Room.cc[pa.come.id];

    //先运行come_before
    if(Rooms[pa.come.room].come_before){
        Rooms[pa.come.room].come_before(go_before);
    }else go_before();
    //再运行go_before
    function go_before(){
        if(Rooms[pa.go.room].go_before) Rooms[pa.go.room].go_before(moving);
        else moving();
    }
    //运行过场动画
    function moving(){

        //通过going或coming返回，重新定义他们的过场动画
        if(Rooms[pa.go.room].going) {
            var go_mov = Rooms[pa.go.room].going();
            if(go_mov) pa.go.mov = go_mov;
        }
        if(Rooms[pa.come.room].coming) {
            var come_mov = Rooms[pa.come.room].coming();
            if(come_mov) pa.come.mov = come_mov;
        }

        var mov0 = $go.attr("mov-room");
        if(mov0) $go.removeClass(mov0);
        $go.css("visibility" , "visible");
        if(pa.go.mov=="hide"){
            Room.hide(pa.go.id);
            go_fn();
        }else{
            $go.addClass(pa.go.mov).attr("mov-room" , pa.go.mov).one(AnimationEndName, function(){
                go_fn();
            });
        }

        function go_fn(){
            if(pa.off=="go"){
                if(Rooms[pa.go.room].go_after) {
                    Rooms[pa.go.room].go_after(function(){
                        Room.finish();
                        Room.hide(pa.go.id);
                        if(fn) fn();
                    });
                }else {
                    Room.finish();
                    Room.hide(pa.go.id);
                    if(fn) fn();
                }
            }else{
                if(Rooms[pa.go.room].go_after) Rooms[pa.go.room].go_after(function(){
                    Room.hide(pa.go.id);
                });
                else Room.hide(pa.go.id);
            }
        }


        var mov1 = $come.attr("mov-room");
        if(mov1) $come.removeClass(mov1);
        $come.css("visibility" , "visible");
        if(pa.come.mov=="show"){
            Room.show(pa.come.id);
            come_fn();
        }else{
            $come.addClass(pa.come.mov).attr("mov-room" , pa.come.mov).one(AnimationEndName, function(){
                Room.show(pa.come.id);
                Room.hide(pa.go.id);
                come_fn();
            });
        }


        function come_fn(){
            if(pa.off=="come"){
                if(Rooms[pa.come.room].come_after) {
                    Rooms[pa.come.room].come_after(function(){
                        Room.finish();
                        if(callback) callback();
                    });
                }else {
                    Room.finish();
                    if(callback) callback();
                }
            }else{
                if(Rooms[pa.come.room].come_after) Rooms[pa.come.room].come_after();
            }
        }
    }
};



///////////////////////////////// View /////////////////////////////////
//用于样式生成
var View = {};
var Views = {};
///// View 页面预定义 /////
//para.top顶部，left左边,ss比例,sx X比例,sy Y比例
var ViewSize = function(my_w, my_h, para){

    var CC= $("#CC");

    if(!my_w) my_w = CC.width();
    else CC.width(my_w);
    if(!my_h) my_h = CC.height();
    else CC.height(my_h);

    var ww = $(window).width();
    var wh = $(window).height();
    var wr = ww/wh;
    var my_r = my_w/my_h;
    //实际内容大小
    var nw,nh;

    if(wr>my_r){//宽一点
        nh = wh;
        nw = nh*my_r;

    }else{//窄一点
        nw = ww;
        nh = nw/my_r;
    }
    var ss = nw/my_w;
    var sw = (ww-nw)/2;
    var sh = (wh-nh)/2;
    //ss = parseFloat(ss.toFixed(4));

    View.w = nw;
    View.h = nh;

    if(para){
        if(para.top || para.top===0) sh = para.top;
        if(para.left || para.left===0) sw = para.left;

        if(para.ss) ss = para.ss;

        if(para.sx || para.sy){
            CC.css({"transform":"scaleX("+para.sx+") scaleY("+para.sy+")" , "transform-origin":"top left" , "margin-top":sh+"px" , "margin-left":sw+"px"});
            return;
        }
    }

    CC.css({"transform":"scale("+ss+")" , "transform-origin":"top left" , "margin-top":sh+"px" , "margin-left":sw+"px"});


};
View.ini = function(){
    //加载其他样式
    for(var i in Views) {
        if(i!="ini") Views[i]();
    }
};

/////////////////////////////// Action /////////////////////////////////
//用于程序运行
var Action = {};

///////////////////////////////// IO /////////////////////////////////
var IO = {};
var socket;
//服务器io连接
IO.connect_run = 0;
Ask.reconnect = "";
Ask.server_con="";
IO.connect = function(url, fn){
    IO.unable = $("._IO_unable");
    //连接io
    socket = io.connect(url);
    console.log("准备连接"+url, socket);

    Ask.server_con= setTimeout(function(){
        if(fn) fn();
    }, 10000);

    socket.on("disconnect", function(){

        console.log("连接断开");
        if(IO.Exit) IO.Exit();

        clearInterval(Ask.reconnect);
        Ask.reconnect = setInterval(function(){
            socket.io.reconnect();
            if(socket.connected){
                clearInterval(Ask.reconnect);
            }
        }, 3000);

    });

    socket.on("connect", function(){
        clearInterval(Ask.reconnect);
        clearTimeout(Ask.server_con);
        console.log("连接成功" , socket);

        //发送注册连接事件
        socket.emit("conn", {type:IO.Type , name:IO.Name , client:IO.Client} , function(data){

            if(!data) {
                console.log("连接注册失败，网络或服务器有问题, callback没有返回！");
                return;
            }
            if(data.err==1){
                console.log("连接失败，参数有问题, type可能写错了！");
                return;
            }

            if(fn && !IO.connect_run) fn();
            IO.connect_run = 1;

        });

    });

    socket.on("Report" , function(pa){
        console.log("接收Report", pa);
        IO.Report(pa);
    });

};

IO.emit = function(para){
    if(!para) {
        console.log("IO.emit，para错误",para);
        return;
    }
    if(!para.to || !para.key) {
        console.log("IO.emit，para参数错误", para);
        return;
    }

    if(Url.debug) para.debug = 1;

    console.log("EMIT", para);
    socket.emit("EMIT", para);
};

IO.link_isFinish = {};
IO.link = function(para, fn){
    if(!para) {
        console.log("IO.link，para错误",para);
        return;
    }
    if(!para.to || !para.key) {
        console.log("IO.link，para参数错误", para);
        return;
    }

    if(IO.link_isFinish[para.key]) return;
    IO.link_isFinish[para.key] = 1;

    IO.unable.show();

    para.from = IO.Name;

    if(Url.debug) para.debug = 1;

    console.log("LINK", para);
    socket.emit("LINK", para);


    if(!socket.hasListeners("LINK"+para.key)){
        socket.on("LINK"+para.key, function(re){
            console.log("IO.link"+para.key+"，监听到回馈", re);
            IO.unable.hide();
            clearTimeout(Ask["LINK"+para.key]);

            IO.link_isFinish[para.key] = 0;
            if(fn) fn(re);
        });
    }


    clearTimeout(Ask["LINK"+para.key]);
    Ask["LINK"+para.key] = setTimeout(function(){
        console.log("LINK"+para.key+"回馈错误，5秒后被恢复！", para);
        IO.unable.hide();

        IO.link_isFinish[para.key] = 0;
        if(fn) fn();
    }, 3000);
};

IO.on = function(key, fn){
    socket.on(key, function(da){
        if(!da || !da.from) {
            console.log("IO.on , da.form没有", da);
            return;
        }
        console.log("IO.on，监听到LINK的消息"+key, da);
        if(fn) fn(da, function(re){
            if(!re) re = {};
            re.to   = da.to;
            re.from = da.from;
            re.key  = da.key;

            console.log("IO.on，LINKBack回馈信息", re);
            socket.emit("LINKBack", re);
        })
    });
};

/////////////////////////////////////////////////////////////////////////
/////////////////////////////// 服务器连接 ///////////////////////////////
////////////////////////////////////////////////////////////////////////
//获取本地数据
var Json = {};
Json.getData = function(fn){
    if(!Url.web){
        Log("【Json.getData】：开始获取本机数据");
        FS.readFile(Url.fs+"uploads/json.txt","utf-8",function(err,data){
            if(err){
                Logwt("【Json.getData】出现err错误", err);
            }else{

                try{
                    var json = eval("("+data+")");
                    Log("【Json.getData】：本机数据", Base);
                }catch (e){
                    Logwt("【Json.getData】 eval转换出现错误");

                    return false;
                }
                fn(json);
            }
        });
    }else{
        Log("【Json.getData】：开始获取服务器的json,未实现");
    }
};
var Server = {};
var Download = {};
//服务器连接 / 模式确定
Server.connect = function(url, fn, download){

    if(!Url.web) {
        FS = require('fs');
        http = require('http');
    }//文档处理

    $.getJSON("../uploads/base.json", function(data) {

        if(download===0){
            Base = data;
            console.log("Base准备完毕" , Base);
            fn();
        }else{
            console.log(url);
            $.ajax({
                url: url,
                cache:false,
                success: function(json){
                    console.log("数据服务器连接成功！获取数据：1" , json);
                    //是否更新判断
                    Server.sync(json, data, fn);
                },
                error:function(){
                    console.log("数据服务器连接失败！", url);
                    Base = data;
                    console.log("Base准备完毕" , Base);
                    fn();
                },
                dataType: "json"
            });
        }

    });

};


//资料下载前判断
Server.sync = function(web, local, fn){

    Log("【Server.sync】：开始进入同步判断");
    if(!web.date) alert("【Server.sync】：没有取到date");

    if(web.date == local.date && local.download_finish) {
        Log("【Server.sync】 无需更新：json的date一样，开始运行");
        Base = local;
        console.log("Base准备完毕" , Base);
        fn();
    }else{
        Log("【Server.sync】 需要更新：json的date不一样,开始更新数据", web);
        Base = web;
        Server.update(fn);
    }


};

//下载资源,更新
Server.update = function(fn){
    Log("【Server.update】 ：更新数据");
    Server.download();
    Lock.open("update", 3000, function(){
        Log("【Server.update】 下载全部完成，验证下载文件");
        Progress(99, "验证下载文件: ");
        Server.update_check(fn);
    });
};

//从服务器获取资源
Server.download = function(){

    Log("【Server.download】： 从服务器获取资源");

    Base.download_finish = 0;
    Server.download_list = [];
    //生成base.json
    FS.writeFile(Url.fs+'uploads/base.json', JSON.stringify(Base, null, 4) , function (err) {
        if (err) {
            Logwt("【Server.download】 FS.writeFile写json： 出现错误");
        }
    });

    Lock.set("update");
    for(var nm in Download){
        Download[nm]();
    }
    setTimeout(function(){
        Lock.cls("update", function(){
            Progress(parseInt(100-(Lock.nm["update"]*100/Lock.len["update"])));
        });
    },3000);
};

Server.save = function(webUrl, fileUrl, rs, filesize, lock){

    if(!lock) lock="update";
    Lock.set(lock);

    var webFile = webUrl+rs;
    var localFile = fileUrl+rs;

    Log("【Server.save】： 正在获取"+webFile+"文件");

    FS.exists(localFile, function(exists) {
        if (exists) {
            Log("【Server.save】："+localFile+":文件已经存在！！判断文件是否完整...");

            var fileSync = FS.statSync(localFile);

            if (filesize != fileSync.size) {
                Log("【Server.save】：" + filesize + "===" + fileSync.size + "(" + (filesize == fileSync.size)+")");
                _save(webFile, localFile, filesize, fileSync.size, lock);

            }
            else {
                Log("【Server.save】：" + localFile+":文件完整,跳过！");
                Lock.cls(lock, function(){
                    Progress(parseInt(100-(Lock.nm[lock]*100/Lock.len[lock])));
                });
            }

        } else {
            Log("【Base._save_file】： 正在获取"+webFile+'--'+localFile+"文件");
            //_save(webFile, localFile, filesize, fileSync.size, lock);
            _save(webFile, localFile, filesize, 0, lock);
        }
    });

    //保存到本地
    function _save(url, file, size, mysize, lock){
        Server.download_list.push({file:localFile, size:size, mysize:mysize});
        http.get(url, function(res){
            var imgData = "";

            res.setEncoding("binary");

            res.on("data", function(chunk){
                imgData+=chunk;
            });

            res.on("end", function(){
                FS.writeFile(file, imgData, "binary", function(err){
                    if(err){
                        Logwt("【Server.save】 失败!： 获取"+url+"文件", err);
                        Lock.cls(lock, function(){
                            Progress(parseInt(100-(Lock.nm[lock]*100/Lock.len[lock])));
                        });
                    }else{
                        Log("【Server.save】 成功： 获取"+url+"文件");
                        //Logs("【Server._save_file】 成功： 获取"+url+file+"文件");
                        Lock.cls(lock, function(){
                            Progress(parseInt(100-(Lock.nm[lock]*100/Lock.len[lock])));
                        });
                    }
                });
            });
        });
    }
};


//保存资源(旧版)
Server._save = function(url, file, lock){

    Log("【Server._save_file】： 正在获取"+url+file+"文件");

    if(!lock) lock="update";
    Lock.set(lock);

    http.get(url, function(res){
        var imgData = "";

        res.setEncoding("binary");

        res.on("data", function(chunk){
            imgData+=chunk;
        });

        res.on("end", function(){
            FS.writeFile(file, imgData, "binary", function(err){
                if(err){
                    Logwt("【Server._save_file】 失败!： 获取"+url+file+"文件", err);
                    Lock.cls(lock, function(){
                        Progress(parseInt(100-(Lock.nm[lock]*100/Lock.len[lock])));
                    });
                }else{
                    Log("【Server._save_file】 成功： 获取"+url+file+"文件");
                    //Logs("【Server._save_file】 成功： 获取"+url+file+"文件");
                    Lock.cls(lock, function(){
                        Progress(parseInt(100-(Lock.nm[lock]*100/Lock.len[lock])));
                    });
                }
            });
        });
    });
};

//下载资源,更新后验证
Server.update_check_num = 0;
Server.update_check = function(fn){
    if(!Server.download_list.length){
        Log("【Server.update_check】 下载全部完成",Base);

        Base.download_finish = 1;
        FS.writeFile(Url.fs+'uploads/base.json', JSON.stringify(Base, null, 4) , function (err) {
            if (err) {
                Logwt("【Server.update_check】 FS.writeFile写json： 出现错误");
            }
        });

        fn();
        return;
    }

    if(Server.update_check_num){
        Log("【Server.update_check】 下载存在问题，先执行程序");

        var err = {};
        err.list = Server.download_list;
        err.date = new Date();
        FS.writeFile(Url.fs+'uploads/err.json', JSON.stringify(err, null, 4) , function (err) {
            if (err) {
                Logwt("【Server.update_check】 FS.writeFile写json： 出现错误");
            }
        });
        fn();
        return;
    }

    Server.update_check_num++;
    Server.update(fn);
};

//////////////////////////////// 调试函数 ////////////////////////////////
//////////////////////////////// 浏览器兼容 ////////////////////////////////
//浏览器兼容
var animEndEventNames = {
    'WebkitAnimation' : 'webkitAnimationEnd',
    'OAnimation' : 'oAnimationEnd',
    'msAnimation' : 'MSAnimationEnd',
    'animation' : 'animationend'
};
var AnimationEndName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];

//用于输出测试，正式运行时可以注释下面程序
var Log = function(w , obj){
    console.log(w);
    if(obj) console.log(obj);
};

//保存错误记录
var Logwt = function (w , obj) {
    console.log(w);
    if(obj) console.log(obj);

    if(!Url.web){
        var d = new Date();
        FS.appendFile(Url.fs+'uploads/log.txt', w+'['+d+']'+"\n\t");
    }

};