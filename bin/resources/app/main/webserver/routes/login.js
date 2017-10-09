var Admin = require('../db/admin')();

module.exports = function(app) {

    app.get('/login', function(req, res){
        res.render('admin_login', {});
    });

    app.post('/loginIn', function(req, res){
        var username = req.body.username;
        var password = req.body.password;
        Admin.findOne({ username: username}, function (err, doc){
            if(err) {
                res.end("fail");
            }else{
                if(doc.password==password) {
                    req.session.login = 1;
                    res.end("success");
                }else res.end("fail");
            }
        });
    });

    app.get('/loginOut', function(req, res){
        req.session.login = 0;
        res.end("success");
    });

    app.get('/psw_edit', function(req, res){
        if(!req.session.login) res.end("Login Out");
        else res.render('admin_psw_edit', {});
    });

    app.post('/psw_edit_op', function(req, res){
        if(!req.session.login) {
            res.end("Login Out");
            return;
        }

        var password_old = req.body.password_old;
        var password = req.body.password;
        var password1 = req.body.password1;

        if(password!=password1) {
            res.end("fail");
            return;
        }

        Admin.findOne({ username: "admin"}, function (err, doc){
            if(err) {
                res.end("fail");
            }else{
                if(doc.password==password_old) {

                    Admin.edit({ username: "admin"}, { password : password }, function(err){
                        if(err) {
                            res.end("fail");
                        }else{
                            res.end("success");
                        }
                    });

                }else res.end("fail");
            }
        });

    });

};