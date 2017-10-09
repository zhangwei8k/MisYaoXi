var mongoose = require("mongoose");
var db = require("./db")(mongoose);
module.exports = function() {
    var Schema = new mongoose.Schema({
        username : {type : String},
        password : {type : String}
    });
    // model
    var Model = db.model('admin', Schema);

    //账号初始化
    var ini = function(){
        var doc = {username : 'admin', password : '111111'};
        var mongooseEntity = new Model(doc);
        mongooseEntity.save(function(error) {
            if(error) {
                console.log(error);
            } else {
                console.log('saved OK!');
            }
        });
    };

    var findOne = function(find, callback){
        Model.findOne(find , function(err,doc){
            if(err){
                callback(err,null);
            }else{
                callback(null,doc);
            }
        })
    };

    var edit = function(find, pa, callback){
        findOne(find, function(err , doc){
            if(err){
                callback(err);
            }else{
                for(var i in pa){
                    doc[i] = pa[i];
                }
                doc.save(function(err){
                    if(err){
                        callback(err);
                    }else{
                        callback(null);
                    }
                })
            }
        })
    };


    return {
        m:Model,
        ini:ini,
        edit:edit,
        findOne:findOne
    };
};