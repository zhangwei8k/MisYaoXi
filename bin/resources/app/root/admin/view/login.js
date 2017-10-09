var LoginForm = React.createClass({
  render: function() {
    return (
        <form method="post" role="form" id="login" className="login-form" action="loginIn">

            <div className="login-header">
                <a href="#" className="logo">
                    <img src="admin/assets/images/logo@2x.png" alt="" width="80" />
                    <span>login</span>
                </a>

                <p>尊敬的用户，欢迎使用思珀多媒体资料管理系统！</p>
            </div>

            <div className="form-group">
                <input type="text" className="form-control input-dark" name="username" id="username" placeholder="帐号" />
            </div>

            <div className="form-group">
                <input type="password" className="form-control input-dark" name="passwd" id="passwd" placeholder="密码" />
            </div>

            <div className="form-group">
                <button type="submit" className="btn btn-dark  btn-block text-left">
                    <i className="fa-lock"></i>
                    登 陆
                </button>
            </div>

            <div className="login-footer">
                <a href="#">忘记密码?</a>
            </div>

        </form>
    );
  }
});

ReactDOM.render(
    <div className="login-container">
        <div className="row">
            <div className="col-sm-6">
                <div className="errors-container"></div>
                <LoginForm />
            </div>
        </div>
    </div>
    , document.getElementById('CC')
);