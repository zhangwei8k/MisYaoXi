var Ans  = require('../db/ans')();

module.exports = function(app) {


    app.get('/ans_list', function(req, res){
        if(!req.session.login) res.end("Login Out");
        else res.render('admin_ans_list', {});

    });

    app.get('/ans_list_get/:pageSize/:page', function(req, res){

        var page = req.params.page;
        var pageSize = req.params.pageSize;

        Ans.page(page, pageSize, function (err, doc, rsc){
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


    app.get('/ans_del/:id', function(req, res){

        var id = req.params.id;
        if(!id) {
            res.end("fail");
            return;
        }

        Ans.del(id, function(err){
            if(err){
                res.end("fail")
            }else{
                res.end("success");
            }
        })

    });

};
