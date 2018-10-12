var express = require('express');
var router = express.Router();
var Artilces = require('../public/javascripts/articles');

//获取文章列表
router.post('/show-articles' , function(req , res , next){
    let article = new Artilces(req.session.userId);
    article.getArticleList(function(err , data){
        if(err) return next(err);

        res.json({
            data ,
            error_msg : '',
            ret : 0
        })
    })
});

router.post('/add-articles' , function(req , res , next) {
    let article = new Artilces(req.session.userId);
    article.addArticles(req.body , function(err){
        if(err) return next(err);
        res.json({
            data : '添加成功' ,
            error_msg : '',
            ret : 0
        })
    })
})

router.post('/delete-article' , function(req , res , next){
    let article = new Artilces(req.session.userId);
    article.deleteAtricle(req.body , function(err){
        if(err){
            res.json({
                data : '',
                error_msg : 'delete failed!',
                ret : -1
            })
        }else {
            res.json({
                data : '删除成功',
                error_msg : '',
                ret : 0
            })
        }
    })
})

router.post('/update-articles' , function(req , res , next){
    let article = new Artilces(req.session.userId);
    article.updateArticles(req.body , function(err){
        if(err){
            res.json({
                data : '',
                error_msg : 'update failed!',
                ret : -2
            })
        }else {
            res.json({
                data : '编辑成功！',
                error_msg : '',
                ret : 0
            })
        }
    })
})

module.exports = router;