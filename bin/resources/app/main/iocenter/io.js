////////////// IO控制模块 /////////////
// mv3c-io version 2.0
// 目前支持一台终端一台控制台，一位当前角色；（手机游客角色此无）
var IO = {};
//记录用户的信息（id:"唯一辨识"，ip："ip地址"，type："角色类型"，
//client:"所属终端屏幕，一般针对user"，name:"终端名即为room名，用户名则可区别样式"）
IO.id = new Array();
IO.nm = new Array();
IO.guide  = "";
IO.user   = new Array();
IO.opt    = new Array();
IO.client = new Array();
//屏幕（终端）的游客使用状态 0.无任何接入状态，1.终端首次接入，2.处于使用状态，3.可以强行插入状态
IO.state = new Array();
//房间以一个屏幕（终端）的名称建立一个房间，client:记录终端的信息，
//user:记录当前登陆的使用者，ids各连接者的信息(ids[] = {})
IO.room = new Array();
//询问函数
IO.Ask = new Array();
//开关
IO.off = new Array();
//支持的类型
IO.hasType  = {"client":true , "guide":true , "user":true, "opt":true};


////////////// IO控制模块-角色注册撤销模块 /////////////
io.on('connection', function(socket){
    //console.log(socket);
    var conn_mk = 0;
    socket.on("conn", function(ids , callback){
        if(conn_mk) return;
        conn_mk = 1;

        //生成id与ip
        var id = socket.id;
        var ip = socket.handshake.address;
        ids.id = id;
        ids.ip = ip;

        //类型容错
        if(!IO.hasType[ids.type]) {
            ids.err = 1;
            callback(ids);
            return;
        }
        IO.nm[ids.name] = id;

        //角色分类注册监听
        switch(ids.type){
            case "client":
                IO.Conn_client(ids, socket , callback);
                break;
            case "opt":
                IO.Conn_opt(ids, socket , callback);
                break;
            case "user":
                IO.Conn_user(ids, socket , callback);
                break;
            case "guide":
                IO.Conn_guide(ids, socket , callback);
                break;
        }

    });


    socket.on("EMIT", function(da){
        if(!da || !da.to || !da.key) {
            IO.Msg("err", "EMIT【监听】：（EMIT参数错误）", da , {level:1});
            return;
        }

        if(!da.debug){
            if(!IO.nm[da.to]){
                IO.Msg("err", "EMIT【监听】：（终端"+da.to+"未连入）", "" , {level:1});
                return;
            }

            IO.Msg("sio", "EMIT【监听】:(终端"+da.to+"接收"+da.key+")", da);
            delete da.sio;
            io.to(IO.nm[da.to]).emit(da.key, da);
        }else{
            IO.Msg("sio", "EMIT【监听】:(终端"+da.to+"接收"+da.key+")", da);
        }
    });

    socket.on("LINK", function(da){

        if(!da || !da.to || !da.key ||!da.from) {
            IO.Msg("err", "LINK【监听】：（LINK参数错误）", da , {level:1});
            return;
        }

        if(!da.debug){
            if(!IO.nm[da.to]){
                IO.Msg("err", "LINK【监听】：（终端"+da.to+"未连入）", "" , {level:1});
                return;
            }

            IO.Msg("sio", "LINK【监听】:(终端"+da.to+"接收"+da.key+")", da);
            io.to(IO.nm[da.to]).emit(da.key, da);
        }else{
            IO.Msg("sio", "LINK【监听】:(终端"+da.to+"接收"+da.key+")", da);
            if(da.debug_re) {
                for(var i in da.debug_re){
                    da[i] = da.debug_re[i];
                }
            }
            io.to(IO.nm[da.from]).emit("LINK"+da.key, da);

        }
    });
    socket.on("LINKBack", function(da){
        IO.Msg("sio", "LINKBack【监听】:(终端"+da.to+"回馈)", da);

        io.to(IO.nm[da.from]).emit("LINK"+da.key, da);
    });

});

IO.Conn_client = function(ids, socket, callback){
    ids.client = ids.name;
    IO.id[ids.id] = ids;

    if(IO.room[ids.name]) {
        IO.Msg("node","client【清理room】:(终端连入，清理老房间的记录)", "", {node:ids.client, type:"msg"});
        IO.ClearRoom(ids.name);
    }
    IO.room[ids.name] = new Array();
    IO.state[ids.name] = 1;

    IO.client[ids.name] = ids.id;

    IO.Msg("node", "client【连入】：（终端"+ids.client+"连入）", ids , {node:ids.client, type:"join"});
    //通报
    //IO.Report_clientJoin(ids);
    callback(ids);

    socket.on('disconnect', function () {
        IO.Msg("node",  "client【退出】：(终端退出"+ids.name+"，id="+ids.id+")" ,"", {node:ids.client, type:"exit"});
        IO.ClearRoom(ids.name);
        //通报
        //IO.Report_clientExit(ids.client);
    });
};

IO.Conn_guide = function(ids, socket, callback){

    IO.id[ids.id] = ids;
    IO.guide = ids.id;

    IO.Msg("node",  "guide【连入】:(管理员连入，nm:"+ids.name+"，id="+ids.id+")" ,"", {node:"Guide", type:"join"});
    callback(ids);
    //通报
    //IO.Report_guideJoin(ids);

    socket.on('disconnect', function () {
        IO.Msg("node",  "guide【退出】:(管理员退出，nm:"+ids.name+"，id="+ids.id+")" ,"", {node:"Guide", type:"exit"});
        IO.Conn_clearId(ids.name, "Guide");
        //通报
        //IO.Report_guideExit();
    });

};


IO.Conn_opt = function(ids, socket, callback){

    //clearInterval(IO.Ask["conn_opt_clientIfOpen"]);
    //clearTimeout(IO.Ask["conn_opt_wait"]);
    //
    //IO.id[ids.id] = ids;
    //IO.opt[ids.client] = ids.id;
    //
    //socket.join(ids.client);
    //
    ////启动文件（需要配置处）
    //switch(ids.client){
    //    case "T1": if(Model.T1_opt) Model.T1_opt(socket , ids); break;
    //}
    //
    //if(IO.room[ids.client]){
    //    //通报
    //    IO.Report_optJoin(ids.client);
    //    IO.Msg("node" , "opt【连入】:(控制台请求连入终端"+ids.client+"，连入成功)", ids, {node:ids.client, type:"join", state:1});
    //    callback(ids);
    //}else{
    //    //发送状态-终端未连接(通报)
    //    IO.Report_optRefer(socket, ids.client, "cls");
    //
    //    IO.Ask["conn_opt_clientIfOpen"] = setInterval(function(){
    //        if(IO.room[ids.client]){
    //            clearInterval(IO.Ask["conn_opt_clientIfOpen"]);
    //            IO.Msg("node" , "opt【依赖开启】:(控制台终端依赖开启"+ids.client+")", "", {node:ids.client, type:"refer", state:1});
    //            IO.Report_optRefer(socket, ids.client, "open");
    //        }
    //    }, 5000);
    //
    //    socket.on("_state_opt_clientIfOpen", function(){
    //        if(IO.room[ids.client]){
    //            clearInterval(IO.Ask["conn_opt_clientIfOpen"]);
    //            IO.Msg("node" , "opt【依赖开启】:(控制台终端依赖开启"+ids.client+")", "", {node:ids.client, type:"refer", state:1});
    //            IO.Report_optRefer(socket, ids.client, "open");
    //        }
    //    });
    //
    //    IO.Ask["conn_opt_wait"] = setTimeout(function() {
    //        //通报
    //        IO.Report_optJoin(ids.client);
    //        IO.Msg("node" , "opt【连入】:(控制台请求连入终端"+ids.client+"，连入成功但终端依赖为开启)", ids, {node:ids.client, type:"join", state:0});
    //        callback(ids);
    //    }, 2000);
    //}
    //
    //
    //socket.on('disconnect', function () {
    //    IO.Msg("node", "opt【退出】:(控制台退出，room:"+ids.name+"，id="+ids.id+")" ,"", {node:ids.client, type:"exit"});
    //    IO.opt[ids.client] = "";
    //    IO.Conn_clearId(ids.id, ids.client);
    //    IO.nm[ids.name] = "";
    //    //通报
    //    IO.Report_optExit(ids.client);
    //});

};

IO.Conn_user = function(ids, socket, callback){};


//根据房间名清理房间所有内容
IO.ClearRoom = function(nm){
    IO.Msg("node" , "【IO.Conn_clearRoom】退出并清理room:"+nm , "" , {node:nm, type:"clear"});
    var room_id = IO.client[nm];
    if(!room_id)  return;

    IO.client[nm] = "";
    IO.IdRemove(room_id);

    if(io.sockets.connected[room_id]) io.sockets.connected[room_id].disconnect();

    //清理ids
    for(var id in IO.room[nm]){
        IO.Msg("node" , "【IO.Conn_clearRoom】退出并清理room:"+nm+"中的id="+id , "" , {node:nm, type:"clear"});
        if(io.sockets.connected[IO.room[nm][id]]) io.sockets.connected[IO.room[nm][id]].disconnect();
    }
    //清理opt
    if(IO.opt[nm]){
        IO.Msg("node" , "【IO.Conn_clearRoom】退出并清理room:"+nm+"中的opt,id="+id , "" , {node:nm, type:"clear"});
        if(io.sockets.connected[IO.opt[nm]]) io.sockets.connected[IO.opt[nm]].disconnect();
    }

    IO.room[nm] = new Array();
    IO.nm[nm] = "";
    IO.state[nm] = 0;
};
//根据id清理内容
IO.Conn_clearId = function(id, client){
    if(!IO.id[id]) return;
    IO.IdRemove(id);

    if(io.sockets.connected[id]){
        IO.Msg("node" , "【IO.Conn_clearId】清理id:"+id , "" , {node:client, type:"clear"});
        io.sockets.connected[id].disconnect();
    }
};

// 公共函数
IO.IdRemove = function(id){
    var index = IO.id.indexOf(id);
    if (index > -1) {
        IO.id.splice(index, 1);
    }
};

////////////// IO控制模块-角色注册撤销模块 End /////////////


////////////// IO控制模块-状态通报模块 /////////////
//guide组
//退出
IO.Report_guideJoin = function(){

};
IO.Report_guideExit = function(){
    io.emit("Report", {type:"g", key:"guideExit"});
};
//client组
//退出
IO.Report_clientExit = function(room_nm){
    if(IO.opt[room_nm])
        io.to(IO.opt[room_nm]).emit("Report", {type:"c", key:"clientExit", client:room_nm});
    if(IO.guide)
        io.to(IO.guide).emit("Report", {type:"c", key:"clientExit", client:room_nm});
};
//进入
IO.Report_clientJoin = function(room_nm){
    if(IO.guide)
        io.to(IO.guide).emit("Report", {type:"c", key:"clientJoin", client:room_nm});
};
//opt组
//退出
IO.Report_optExit = function(room_nm){
    if(IO.client[room_nm])
        io.to(IO.client[room_nm]).emit("Report", {type:"o", key:"optExit", client:room_nm});
    if(IO.guide)
        io.to(IO.guide).emit("Report", {type:"o", key:"optExit", client:room_nm});
};
//进入
IO.Report_optJoin = function(room_nm){
    if(IO.client[room_nm])
        io.to(IO.client[room_nm]).emit("Report", {type:"o", key:"optJoin", client:room_nm});
    if(IO.guide)
        io.to(IO.guide).emit("Report", {type:"o", key:"optJoin", client:room_nm});
};
//依赖通报
IO.Report_optRefer = function(socket, room_nm, mk){
    if(mk=="cls"){
        socket.emit("Report", {type:"o", key:"optRefer", client:room_nm , mk:"cls"});
    }else if(mk=="open"){
        socket.emit("Report", {type:"o", key:"optRefer", client:room_nm , mk:"open"});
    }
};

////////////// IO控制模块-状态通报模块 End /////////////


////////////// IO控制模块-消息记录模块 /////////////
IO.Msg = function(type, msg, obj, pa){
    switch(type){
        case "node":
            console.log("设备消息："+msg);
            if(obj) console.log("相关OBJ：",obj);
            break;
        case "io":
            console.log("websocket消息："+msg);
            if(obj) console.log("相关OBJ：",obj);
            break;
        case "sio":
            console.log("系统定义消息："+msg);
            if(obj) console.log("相关OBJ：",obj);
            break;
        case "err":
            //grade等级，1为提示，2为错误，3为严重错误
            console.log("error消息：("+pa.level+"G)"+msg);
            if(obj) console.log("相关OBJ：",obj);
            break;
    }
};
////////////// IO控制模块-消息记录模块 End /////////////

//其他
IO._room = function(id){
    //根据user的id，返回room的名字和对应的client的id

    if(!IO.id[id]) return false;
    if(!IO.id[id].client) return false;
    if(!IO.room[IO.id[id].client]) return false;

    return {nm:IO.id[id].client, id:IO.room[IO.id[id].client].client};
};

IO._grant = function(id, emit, key){
    var room = IO.id[id].client;
    if(!IO.state[room] || IO.room[room].user!=id){
        emit(0);
        console.log(room+"房间有一个请求，id:"+id+",权限错误！");
        if(key) console.log("请求关键字:"+key);
        return false;
    }else{
        console.log(room+"房间有一个请求，id:"+id+",权限正确！");
        if(key) console.log("请求关键字:"+key);
        return true;
    }

};
IO._off = function(key){
    if(IO.off[key]) {
        console.log("IO.off："+key+", 被锁");
        return false;
    }
    else{
        IO.off[key] = true;
        return true;
    }
};