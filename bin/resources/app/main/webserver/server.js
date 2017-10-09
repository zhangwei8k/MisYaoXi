var express = require('express'),
    app     = express(),
    http    = require('http'),
    server  = http.Server(app),
    io      = require('socket.io')(server),
    path    = require('path'),
    ejs     = require('ejs'),
    fs      = require('fs'),
    $       = require('jquery');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

////////////// 服务器模块 /////////////
var port = 3000;
var uri  = "bin/resources/app/";

app.set('views', uri+'root');
app.use(express.static(uri+'root'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: "Server",
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 10},//10 days
    resave: false,
    saveUninitialized: true
}));

////////////// 路由文件 /////////////
setTimeout(function(){
    require('./webserver/routes/login')(app);
    require('./webserver/routes/main')(app);
    require('./webserver/routes/que')(app);
    require('./webserver/routes/ans')(app);
}, 2000);

app.get('/getIP', function(req, res){
	var ip = getIPAdress();
	 res.end(ip);
	

});
function getIPAdress(){  
    var interfaces = require('os').networkInterfaces();  
    for(var devName in interfaces){  
          var iface = interfaces[devName];  
          for(var i=0;i<iface.length;i++){  
               var alias = iface[i];  
               if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
                     return alias.address;  
               }  
          }  
    }  
}  

server.listen(port, function() {
    console.log('正泰ReactTestServer端系统(端口：'+port+')');
});