var ReactMenu = React.createClass({

    componentDidMount:function(){
        var mid = this.getCookie("mid");

        $("#main-menu li").removeClass("active").eq(mid).addClass("active");
    },

    onMenu:function(id, url){

        this.setCookie("mid", id);
        window.location = url;
    },

    onLoginOut : function(){
        this.setCookie("mid", 99999);

        $.get('/loginOut', function(){
            location.href = "/login";
        });
    },

    setCookie:function(c_name,value,expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
    },

    getCookie: function(c_name) {
        if (document.cookie.length>0){
            var c_start=document.cookie.indexOf(c_name + "=");
            if (c_start!=-1){
                c_start = c_start + c_name.length+1;
                var c_end = document.cookie.indexOf(";",c_start);
                if (c_end==-1) c_end=document.cookie.length;
                return unescape(document.cookie.substring(c_start,c_end))
            }
        }
        return ""
    },

    createJson: function(){
        $.get("/createJson", function(re){
            if(re == "fail"){
                alert("更新失败");
            }else{
                alert("更新成功,等待终端重启！");
				setTimeout(function(){
					location.href = "/login";
				} , 3000);
                
            }
        });
    },

    render: function() {
        return (
            <div className="sidebar-menu-inner">

                <header className="logo-env">

                    <div className="logo">
                        <a href="/main" className="logo-expanded">
                            <span className="logo-title">资料管理后台</span>
                        </a>

                        <a href="dashboard-1.html" className="logo-collapsed">
                            <span className="logo-title">资料<br/>管理</span>
                        </a>
                    </div>

                    <div className="mobile-menu-toggle visible-xs">
                        <a href="#" data-toggle="mobile-menu">
                            <i className="fa-bars"></i>
                        </a>
                    </div>

                </header>

                <ul id="main-menu" className="main-menu">
                    <li>
                        <a href="que_add" onClick={this.onMenu.bind(this, 0, "/que_add")}>
                            <i className="fa-pencil"></i>
                            <span className="title">增加题目</span>
                        </a>
                    </li>
                    <li>
                        <a href="que_list" onClick={this.onMenu.bind(this, 1, "/que_list")}>
                            <i className="fa-folder-o"></i>
                            <span className="title">题目管理</span>
                        </a>
                    </li>
                    <li>
                        <a href="/ans_list" onClick={this.onMenu.bind(this, 2, "/ans_list")}>
                            <i className="fa-file-o" ></i>
                            <span className="title">排行版</span>
                        </a>
                    </li>
                    <li>
                        <a href="/psw_edit" onClick={this.onMenu.bind(this, 3, "/psw_edit")}>
                            <i className="fa-lock"></i>
                            <span className="title">密码设置</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={this.createJson}>
                            <i className="fa-spinner"></i>
                            <span className="title">更新终端</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={this.onLoginOut}>
                            <i className="fa-sign-out"></i>
                            <span className="title">退 出</span>
                        </a>
                    </li>

                </ul>

            </div>
        );
    }

});

var ReactMain = React.createClass({
    render: function() {
        return (
            <div className="main-content">

                <ReactBody />

                <footer className="main-footer sticky footer-type-1">

                    <div className="footer-inner">

                        <div className="footer-text">
                            &copy; 2016
                            <strong>Xenon</strong>
                        </div>

                        <div className="go-up">

                            <a href="#" rel="go-top">
                                <i className="fa-angle-up"></i>
                            </a>

                        </div>
                    </div>
                </footer>
            </div>
        );
    }
});

var ReactFrame = React.createClass({
    componentDidMount:function() {
        xenon_toggles_ini();
        xenen_custom_ini();
        xenen_end_js();
    },

    render: function() {
        return (
            <div className="page-container">
                {/*菜单*/}
                <div className="sidebar-menu toggle-others fixed">
                    <ReactMenu />
                </div>
                {/*内容*/}
                <ReactMain/>

            </div>
        );
    }
});

ReactDOM.render(
    <ReactFrame />
    , document.getElementById('CC')
);