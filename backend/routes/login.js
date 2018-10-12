var express = require('express');
var router = express.Router();
var User = require('../public/javascripts/users');

// 用户登录
router.post('/login' , function(req , res , next) {
    let reqData = req.body;
    let user = new User({
        username : reqData.username,
        passward : reqData.passward,
        email : reqData.email
    });
    try {
        user.loginUser(function(err , ret){
            if(err) return next(err);
            if(ret == -2){
                res.json({
                    ret : -2 ,
                    data : '',
                    error_msg : '该用户尚未注册!'
                })
            }else if(ret == -3){
                res.json({
                    ret : -3 ,
                    data : '',
                    error_msg : '密码错误!'
                })
            }else {
                req.session.userId = ret;
                res.json({
                    ret : 0 ,
                    data : '登录成功！',
                    error_msg : ''
                })
            }
        })
    }catch(err){
        res.json({
            ret : -2 ,
            data : '',
            error_msg : '代码处理错误 请联系管理员更改！'
        })
    }
})

// 用户注册  
router.post('/register' , async function(req, res , next){
    let reqData = req.body;
    let user = new User({
        username : reqData.username,
        passward : reqData.passward,
        email : reqData.email
    });
    try {
        user.registerUser(function(err , data){
            if(err) return next(err);
            if(data){
                res.json({
                    ret : -1 ,
                    data : '',
                    error_msg : '该用户名密码组合已存在!'
                })
            }else{
                res.json({
                    ret : 0 ,
                    data : '注册成功!',
                    error_msg : ''
                })
            }
        })
    }catch(err){
        res.json({
            ret : -2 ,
            data : '',
            error_msg : '代码处理错误 请联系管理员更改！'
        })
    }
});

//判断该用户是否已经登录
router.post('/is-login' , function(req , res , next){
    if(req.session.userId){
        res.json({
            ret : 0 ,
            data : true,
            error_msg : ''
        })
    }else {
        res.json({
            // -5 : 未登录
            ret : -5 ,
            data : false,
            error_msg : '该用户尚未登录'
        })
    }
})

module.exports = router;