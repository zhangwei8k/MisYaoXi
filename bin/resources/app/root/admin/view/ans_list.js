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
            url: "/ans_list_get/10/"+page,
            dataType: 'json',
            cache: false,
            success: function (data) {
                if(!data.list.length) return;
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
                    <h3 className="panel-title">排行管理</h3>
                </div>

                <div className="row">
                    <div className="col-sm-12">

                        <table className="table table-model-2 table-hover">
                            <thead>
                            <tr>
                                <th className="nowrap">姓名</th>
                                <th>分数</th>
                                <th className="nowrap">管理</th>
                            </tr>
                            </thead>

                            <ReactList list={this.state.list} rsc={this.state.rsc} update={this.update} onChangeList={this.onChangeList} />

                        </table>

                        <ReactPageNav rsc={this.state.rsc} onChangeList={this.onChangeList} />

                    </div>

                </div>

            </div>

        );
    }


});

var ReactList = React.createClass({


    onDel:function(id, page){

        $.get("/ans_del/"+id, function(re){
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
                    <td className="nowrap">{rs.nm}</td>
                    <td>{rs.score}</td>
                    <td className="nowrap">

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


