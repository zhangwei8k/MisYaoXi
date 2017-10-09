Url.fs  = "resources/app/";//fs的时候的相对地址
Url.upload = "../uploads/";
Url.server = "http://10.121.2.117:888/";

var Progress = function(num){
    Log("$$$$【Server.loader】目前完成："+num+"%");
    if(num==100) num=99;
    Dom._loader.html("正在更新资料中，已完成："+num+"%");
};

