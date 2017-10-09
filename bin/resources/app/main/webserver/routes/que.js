var Que = require('../db/que')();

module.exports = function(app) {

    app.get('/que_add', function(req, res){
        if(!req.session.login) res.end("Login Out");
        else res.render('admin_que_add', {});
    });

    app.post('/que_add_op', function(req, res){
        if(!req.session.login) {
            res.end("Login Out");
            return;
        }

        Que.add(req.body, function (err){
            if(err) {
                res.end("fail");
            }else{
                res.end("success");
            }
        });

    });

    app.get('/que_list', function(req, res){
        if(!req.session.login) res.end("Login Out");
        else res.render('admin_que_list', {});

    });

    app.get('/que_list_get/:pageSize/:page', function(req, res){

        var page = req.params.page;
        var pageSize = req.params.pageSize;

        Que.page(page, pageSize, function (err, doc, rsc){
            if(err) {
                res.end("fail");
            }else{
                var json = {};
                json.list = doc;
                json.rsc = rsc;
                res.json(json);
            }
        });

    });

    app.get('/que_edit/:id', function(req, res){

        var id = req.params.id;
        if(!id) {
            res.end("fail");
            return;
        }

        Que.findOne({_id:id}, function(err, doc){
            if(err){
                res.end("fail")
            }else{
                res.json(doc);
            }
        })

    });

    app.post('/que_edit_op', function(req, res){

        var rs = req.body;
        Que.edit(
            {_id:rs._id},
            {
                title:rs.title,
                A:rs.A,
                B:rs.B,
                C:rs.C,
                D:rs.D,
                ans:rs.ans,
                num:rs.num
            },
            function (err){
            if(err) {
                res.end("fail");
            }else{
                res.end("success");
            }
        });

    });

    app.get('/que_del/:id', function(req, res){

        var id = req.params.id;
        if(!id) {
            res.end("fail");
            return;
        }

        Que.del(id, function(err){
            if(err){
                res.end("fail")
            }else{
                res.end("success");
            }
        })

    });

};
