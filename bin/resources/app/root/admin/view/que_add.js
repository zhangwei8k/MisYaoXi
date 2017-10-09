var ReactBody = window.ReactBody = React.createClass({

    componentDidMount:function() {
        $("#queForm").validate({
            rules: {
                title: {
                    required: true,
                    maxlength: 140
                },
                A: {
                    required: true,
                    maxlength: 50
                },
                B: {
                    maxlength: 50
                },
                C: {
                    maxlength: 50
                },
                D: {
                    maxlength: 50
                },
                num: {
                    number:true
                }
            },

            messages: {
                title: {
                    required: "请输入题目",
                    maxlength: "140个字以内"
                },
                A: {
                    required: "请输入A选项",
                    maxlength: "50个字以内"
                },
                B: {
                    maxlength: "50个字以内"
                },
                C: {
                    maxlength: "50个字以内"
                },
                D: {
                    maxlength: "50个字以内"
                },
                num: {
                    number:"必须是数字"
                }
            },

            submitHandler:function(form){
                var num;
                if(!$("#num").val()) num = 0;
                else num = $("#num").val();
                $.post('/que_add_op',
                    {
                        title: $("#title").val(),
                        A: $("#A").val(),
                        B: $("#B").val(),
                        C: $("#C").val(),
                        D: $("#D").val(),
                        ans: $("#ans").val(),
                        num: num
                    },
                    function (re) {
                        if (re == "success") {
                            form.reset();
                        }else{
                            alert("录入失败！");
                        }
                    }
                );
            }
        });
    },


    render : function(){
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">增加题目</h3>
                </div>
                <div className="panel-body">

                    <form role="form" className="form-horizontal" id="queForm">

                        <div className="form-group">
                            <label className="col-sm-2 control-label">题目编号</label>

                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="num" name="num" placeholder="1~1000数字" />
                            </div>
                        </div>

                        <div className="form-group-separator"></div>

                        <div className="form-group">
                            <label className="col-sm-2 control-label">题目</label>

                            <div className="col-sm-10">
                                <textarea className="form-control autogrow" cols="5" id="title" name="title" placeholder="140个字以内"></textarea>
                            </div>
                        </div>

                        <div className="form-group-separator"></div>

                        <div className="form-group">
                            <label className="col-sm-2 control-label">选型A</label>

                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="A" name="A" placeholder="50个字以内" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-sm-2 control-label">选型B</label>

                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="B" name="B" placeholder="50个字以内" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-sm-2 control-label">选型C</label>

                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="C" name="C" placeholder="50个字以内" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-sm-2 control-label">选型D</label>

                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="D" name="D" placeholder="50个字以内" />
                            </div>
                        </div>

                        <div className="form-group-separator"></div>

                        <div className="form-group">
                            <label className="col-sm-2 control-label">正确答案</label>

                            <div className="col-sm-10">
                                <select className="form-control" id="ans" name="ans">
                                    <option>A</option>
                                    <option>B</option>
                                    <option>C</option>
                                    <option>D</option>
                                </select>
                            </div>
                        </div>



                        <div className="form-group-separator"></div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-secondary btn-single pull-right"> 提 交 </button>
                        </div>

                    </form>

                </div>
            </div>
        );
    }
});

