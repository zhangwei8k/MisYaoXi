var Que = require('../db/que')();
var Ans = require('../db/ans')();
var FST = require('fs');

module.exports = function(app) {

    app.get('/main', function(req, res){
        if(!req.session.login) res.end("Login Out");
        else res.render('admin_main', {});
    });

    app.get('/createJson', function(req, res){

        Json(req, res, function(){
            setTimeout(function(){
                electron.ipcRenderer.send("pc-reset");
            },500);
        })

    });

    function Json(req, res, fn){
        var json = {
            date:new Date()
        };

        Que.list(function(err, rs){
            if(err){
                res.end("fail");
            }else{
                json.subject = rs;
                ansGet()
            }
        });

        function ansGet(){
            Ans.page(1, 10, function(err, rs){
                if(err){
                    res.end("fail")
                }else{
                    json.ans = rs;

                    FST.writeFile('bin/resources/app/uploads/base.json', JSON.stringify(json, null, 4) , function (err) {
                        if (err) {
                            console.log("xx");
                            res.end("fail1");
                        }else{
                            res.end("success");

                            if(fn) fn();
                        }
                    });
                }
            });
        }
    }

    app.post('/ans_add_op', function(req, res){

        Ans.add(req.body, function (err){
            if(err) {
                res.end("fail");
            }else{

                Ans.page(1, 10, function (err, doc, rsc){
                    if(err) {
                        res.end("fail");
                    }else{
                        res.json(doc);
                        Json(req, res);
                    }
                });

            }
        });

    });

};
