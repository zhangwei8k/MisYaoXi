var ReactBody = window.ReactBody = React.createClass({

    componentDidMount:function() {
        $("#queForm").validate({
            rules: {
                password_old: {
                    required: true,
                    maxlength: 13
                },
                password: {
                    required: true,
                    maxlength: 13
                },
                password1: {
                    required: true,
                    maxlength: 13
                }
            },

            messages: {
                password_old: {
                    required: "密码必须输入",
                    maxlength: "13个字以内"
                },
                password: {
                    required: "密码必须输入",
                    maxlength: "13个字以内"
                },
                password1: {
                    required: "密码必须输入",
                    maxlength: "13个字以内"
                }
            },

            submitHandler:function(form){
                $.post('/psw_edit_op',
                    {
                        password_old: $("#password_old").val(),
                        password: $("#password").val(),
                        password1: $("#password1").val()
                    },
                    function (re) {
                        if (re == "success") {
                            alert("更新成功！");
                        }else{
                            alert("更新失败！");
                        }
                        form.reset();
                    }
                );
            }
        });
    },


    render : function(){
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">密码设置</h3>
                </div>
                <div className="panel-body">

                    <form role="form" className="form-horizontal" id="queForm">

                        <div className="form-group">
                            <label className="col-sm-2 control-label">旧密码</label>

                            <div className="col-sm-10">
                                <input type="password" className="form-control" id="password_old" />
                            </div>
                        </div>

                        <div className="form-group-separator"></div>

                        <div className="form-group">
                            <label className="col-sm-2 control-label">新密码</label>

                            <div className="col-sm-10">
                                <input type="password" className="form-control" id="password" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-sm-2 control-label">密码重复</label>

                            <div className="col-sm-10">
                                <input type="password" className="form-control" id="password1"/>
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
