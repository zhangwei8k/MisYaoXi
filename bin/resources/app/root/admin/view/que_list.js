var ReactBody = window.ReactBody = React.createClass({

    getInitialState:function(){
        return {
            edit:[],
            list:[],
            rsc:{}
        };
    },

    componentDidMount:function(){
        this.onChangeList(1);
    },

    update : function(data){
        this.setState(data);
    },

    onChangeList : function(page) {
        if (!page) page = 1;
        $.ajax({
            url: "/que_list_get/20/"+page,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({
                    list:data.list,
                    rsc:data.rsc
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(err);
            }.bind(this)
        });
    },

    render : function(){
        return (

            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">题目管理</h3>
                </div>

                <div className="row">
                    <div className="col-sm-12">

                        <table className="table table-model-2 table-hover">
                            <thead>
                            <tr>
                                <th className="nowrap">编号</th>
                                <th>题目</th>
                                <th className="nowrap">管理</th>
                            </tr>
                            </thead>

                            <ReactList list={this.state.list} rsc={this.state.rsc} update={this.update} onChangeList={this.onChangeList} />

                        </table>

                        <ReactPageNav rsc={this.state.rsc} onChangeList={this.onChangeList} />

                    </div>

                </div>


                {/*弹出框*/}
                <ReactModal edit={this.state.edit} onChangeList={this.onChangeList} />

            </div>

        );
    }


});

var ReactList = React.createClass({

    onEdit:function(id, page){

        $.ajax({
            url:"/que_edit/"+id,
            dataType:'json',
            cache:false,
            success:function(data){

                data.pageIndex = page;
                this.props.update({edit:data});
                $('#editBox').modal('show');

            }.bind(this),
            error:function(xhr,status,err){
                console.log(err);
            }.bind(this)
        });
    },

    onDel:function(id, page){

        $.get("/que_del/"+id, function(re){
            if(re == "fail"){
                alert("删除失败");
                return;
            }

            this.props.onChangeList(page);

        }.bind(this));
    },



    render: function() {
        var _this = this;
        var Lists = this.props.list.map(function (rs, key) {
            return (
                <tr key={rs._id}>
                    <td className="nowrap">{rs.num}</td>
                    <td>{rs.title}</td>
                    <td className="nowrap">
                        <a onClick={_this.onEdit.bind(_this, rs._id, _this.props.rsc.pageIndex)} className="btn btn-secondary btn-xs"><i className="fa-pencil"></i></a>

                        <div className="btn-group">
                            <button type="button" className="btn btn-danger dropdown-toggle btn-xs" data-toggle="dropdown">
                                <i className="fa-remove"></i>
                            </button>

                            <ul className="dropdown-menu dropdown-danger" role="menu">
                                <li>
                                    <a onClick={_this.onDel.bind(_this, rs._id, _this.props.rsc.pageIndex)}>
                                        确定删除
                                    </a>
                                </li>
                            </ul>
                        </div>


                    </td>
                </tr>
            );
        });
        return (
            <tbody>
                {Lists}
            </tbody>

        );
    }
});

var ReactPageNav = React.createClass({

    createLis: function(key, act){
        return (
            <li key={key} onClick={this.onPage.bind(this, key, act)}><a href="#" className={act}>{key}</a></li>
        );
    },

    onPage:function(i, act){
        if(act) return;
        this.props.onChangeList(i);
    },


    onPrev:function(){
        var i = parseInt(this.props.rsc.pageIndex)-1;
        if(i<=0) return;
        this.props.onChangeList(i);
    },

    onNext:function(){
        var i = parseInt(this.props.rsc.pageIndex)+1;
        if(i>parseInt(this.props.rsc.pageNum)) return;
        this.props.onChangeList(i);
    },

    render: function() {

        var rsc = this.props.rsc;
        var Lis = [];
        for(var i=1; i<=rsc.pageNum; i++){
            var act = "";
            if(i==rsc.pageIndex) act = "current";
            Lis.push(this.createLis(i , act));
        }
        var pre = "";
        var next = "";
        if(rsc.pageIndex==1) pre = "disabled";
        if(rsc.pageIndex==rsc.pageNum) next = "disabled";

        return (
            <div className="navigation">
                <ul className="cd-pagination no-space">
                    <li className="button" onClick={this.onPrev}><a className={pre} href="#">Prev</a></li>
                    {Lis}
                    <li className="button" onClick={this.onNext}><a className={next} href="#">Next</a></li>
                </ul>
            </div>
        );
    }
});


var ReactModal = React.createClass({

    getInitialState:function(){
        return {edit:[]};
    },

    handleChange: function(e) {
        var data = this.props.edit;
        data[e.target.id] = e.target.value;
        data.update = 1;
        this.setState({edit: data});
    },

    componentDidUpdate: function(){
        var _this = this;

        $("form#modalForm").validate({
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
                    number: "必须是数字"
                }
            },

            submitHandler:function(form){

                if(!_this.props.edit.update) {
                    $('#editBox').modal('hide');
                    return;
                }

                var num;
                if(!$("#num").val()) num = 0;
                else num = $("#num").val();

                _this.props.edit.num = num;

                $.post('/que_edit_op',
                    _this.props.edit,
                    function (re) {
                        if (re == "fail") {
                            alert("录入失败！");
                        }else{
                            _this.props.onChangeList(_this.props.edit.pageIndex);
                            $('#editBox').modal('hide');
                        }
                    }
                );
            }
        });

    },

    render : function(){
        return (

            <div className="modal fade" id="editBox">
                <form id="modalForm" role="form" >
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                <h4 className="modal-title">题目修改</h4>
                            </div>

                            <div className="modal-body">

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="control-label">题目编号</label>

                                            <input type="text" className="form-control" id="num" name="num" value={this.props.edit.num} onChange={this.handleChange} />

                                        </div>
                                    </div>
                                </div>

                                <div className="form-group-separator"></div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="control-label">题目</label>

                                            <textarea className="form-control autogrow" cols="5" id="title" name="title" value={this.props.edit.title} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group-separator"></div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="control-label">选型A</label>

                                            <input type="text" className="form-control" id="A" name="A" value={this.props.edit.A} onChange={this.handleChange} />

                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="control-label">选型B</label>

                                            <input type="text" className="form-control" id="B" name="B" value={this.props.edit.B} onChange={this.handleChange} />

                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="control-label">选型C</label>

                                            <input type="text" className="form-control" id="C" name="C" value={this.props.edit.C} onChange={this.handleChange} />

                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="control-label">选型D</label>

                                            <input type="text" className="form-control" id="D" name="D" value={this.props.edit.D} onChange={this.handleChange} />

                                        </div>
                                    </div>
                                </div>

                                <div className="form-group-separator"></div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="control-label">正确答案</label>

                                            <select value={this.props.edit.ans} onChange={this.handleChange} className="form-control" id="ans" name="ans">
                                                <option>A</option>
                                                <option>B</option>
                                                <option>C</option>
                                                <option>D</option>
                                            </select>

                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="modal-footer">
                                <div className="form-group">
                                    <input type="hidden" id="id" value={this.props.edit._id} />
                                    <button type="button" className="btn btn-white" data-dismiss="modal">关闭</button>
                                    <button type="submit" className="btn btn-secondary">修改</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        );
    }


});

