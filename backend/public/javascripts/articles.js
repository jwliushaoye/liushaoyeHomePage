var db_articles = require('../../database/db-users').articles;
var db_users = require('../../database/db-users').users;
var transformationTime = require('./commons').transformationTime;
/*
    {id : '' , creater : '' , create_time : '' , title : '' , link : '' , comment : ''}
*/ 

class Artilces {
    constructor(userId){
        this.userId = userId;
    }

    // 获取文章列表
    getArticleList(callback){
        db_articles.find({} , function(err , data){
            if(err) return callback(err);
            try {
                callback(err , data)
            }catch(err){
                callback(err)
            }
        })
    }

    // 添加文章
    async addArticles(obj , callback){
        // 根据用户ID 查找出用户名
        let [user] = await Promise.all([
            (() => {
                return db_users.findOne({_id : this.userId}).exec();
            })()
        ])
        let data_obj = Object.assign({} , {
            creater : user.username ,
            create_time : transformationTime(new Date())
        } , obj);

        new db_articles(data_obj).save(function(err , data){
            if(err) return callback(err);
            callback();
        })
    }

    // 删除一个文章
    deleteAtricle(obj , callback){
        let that = this;
        db_articles.remove({_id : obj.id} , function(err , data){
            if(err) return callback(err)
            that.findArticlesById(obj.id , callback)
        })
    }   

    // 根据id查找指定文章
    findArticlesById(id , callback){
        db_articles.find({id} , function(err , doc){
            if(err) return callback(err);
            callback();
        });
    }

    // 更新
    updateArticles(obj , callback){
        var conditions = {_id: obj.id}
        var updates = {$set: {link: obj.link , comment:obj.comment , title: obj.title}}
        db_articles.update(conditions, updates , function(err , data){
            if(err) callback(err);
            callback()
        })
    }


    
}

module.exports = Artilces;