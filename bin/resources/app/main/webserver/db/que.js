var mongoose = require("mongoose");
var db = require("./db")(mongoose);
var result;
module.exports = function() {

    if(result) return result;

    var Schema = new mongoose.Schema({
        title : {type : String},
        A : {type : String},
        B : {type : String},
        C : {type : String},
        D : {type : String},
        ans : {type : String},
        num: {type : Number}
    });

    // model
    var Model = db.model('question', Schema);

    var add = function(doc, callback){
        var mongooseEntity = new Model(doc);
        mongooseEntity.save(function(err) {
            if(err) {
                callback(err);
            } else {
                callback(null);
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

    var page = function(pageIndex, pageSize, callback){

        if(!pageSize) pageSize = 25;
        if(!pageIndex || pageIndex<0) pageIndex = 1;

        var rsc = {};
        Model.find(function(err,result){
            if(!err) {
                rsc.all = parseInt(result.length);
                rsc.pageSize = parseInt(pageSize);
                rsc.pageNum = Math.ceil(rsc.all/rsc.pageSize);
                if(parseInt(pageIndex)>=rsc.pageNum) {
                    pageIndex = rsc.pageNum;
                    pageSize = rsc.all-((parseInt(pageIndex)-1)*rsc.pageSize)
                }
                rsc.pageIndex = parseInt(pageIndex);

                run();

            }else callback(err);
        });

        function run(){

            var m = Model.find({});

            var start = (pageIndex-1)*rsc.pageSize;
            m.skip(start);
            m.limit(pageSize);


            //自定义排序和查询
            m.sort({num:1}); //排序
            //根据关键字查询后分页
            //m.where('title','XXX');
            //.where('name.last').equals('Ghost').where('age').gt(17).lt(66).where('likes').in(['vaporizing', 'talking'])

            //自定义排序和查询 END

            //执行分页查询
            m.exec(function(err,rs){
                //分页后的结果
                if(err){
                    callback(err);
                }else{
                    callback(null, rs, rsc);
                }
            })

        }



    };

    var list = function(callback){

        var m = Model.find({});

        //自定义排序和查询
        m.sort({num:1}); //排序
        //根据关键字查询后分页
        //m.where('title','XXX');
        //.where('name.last').equals('Ghost').where('age').gt(17).lt(66).where('likes').in(['vaporizing', 'talking'])

        //自定义排序和查询 END

        //执行分页查询
        m.exec(function(err,rs){
            //分页后的结果
            if(err){
                callback(err);
            }else{
                callback(null, rs);
            }
        });

    };

    var del = function(id, callback){

        findOne({_id:id},function(err,doc){
            if(err){
                callback(err);
            }else{
                doc.remove();
                callback(null);
            }
        })
    };

    result = {
        m:Model,
        add:add,
        edit:edit,
        del:del,
        findOne:findOne,
        page:page,
        list:list
    };

    return result;
};