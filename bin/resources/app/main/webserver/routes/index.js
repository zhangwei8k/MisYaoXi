var express = require('express');
var router = express.Router();
var User = require('../models/user');
var navList = require('../settings.js');
/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.ip);
	User.find(function(err, user) {
		res.render('index', {
			title: '欢迎来到imcoCMS!',
			user: user
		});
	});
});
router.get('/reg', function (req, res) {
	res.render('reg', { title: '注册' });
});
router.get('/login', function (req, res) {
	res.render('login',{title: '登陆'});
});
router.post('/regR', function (req, res) {
  var user = req.body.user;
  console.log(user);
  if (!user) {
    console.log(user)
    return
  }
  var users = new User(user);
    //保存数据
  users.save(function(err) {
    if (err) {
      console.log('保存失败')
    }
    console.log('数据保存成功')
    return res.redirect('/login');
  });
});
module.exports = router;
