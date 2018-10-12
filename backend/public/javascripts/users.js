var db_users = require('../../database/db-users').users;
var bcrypt = require('bcryptjs');
/*
    {id : '' , username : '' , passward : '' , email : ''}
*/

// 初始化用户
function Users(obj){
    // 密码加盐
    for(let key in obj){
        this[key] = obj[key];
    };
};

//用户登录
Users.prototype.loginUser = function(callback){
    // 根据username查找用户
    this.findUserByUsername(callback)
}

// 根据username查找用户
Users.prototype.findUserByUsername = function(callback){
    let that = this;
    db_users.findOne({username : that.username} , function(err , data) {
        if(err) return callback(err);
        if(data == null) {
            // -2  ： 该用户尚未注册
            callback(null , -2);
        }else {
            // 已注册验证密码
            that.verificationPassward(data.passward , callback , data.id)
        }
    })
}

//根据用户名验证密码
Users.prototype.verificationPassward = function(pwd , callback , id){
    let that = this;
    bcrypt.compare(that.passward , pwd , function(err , isMatch){
        if(err) callback(err);
        if(isMatch){
            //密码正确  登录成功
            callback(null , id);
        }else {
            // -3 : 密码错误 
            callback(null , -3);           
        }
    })
}


// 用户注册
Users.prototype.registerUser = async function(callback){
    try{
        let [a , b] = await Promise.all([
            (() => {
                return db_users.find({username : this.username}).exec();
            })(),
            (() => {
                return db_users.find({email : this.email}).exec();
            })(),
        ]);
    
        if(a.length == 0 && b.length == 0){
            this.hashPassward(callback)
        }else {
            // -1  ： 该用户名密码组合已存在!
            callback(null , -1)
        }
    }catch(err){    
        return callback(err);
    }
};

// 密码转hash  加密
Users.prototype.hashPassward = function(callback){
    let that = this;
    bcrypt.genSalt(12 , function(err , salt){
        if(err) return callback(err);
        bcrypt.hash(that.passward , salt  , function(err , hashData){
            if(err) throw callback(err);
            that.passward = hashData;
            that.insertUser(callback)
        })
    });
    
};

// 插入一条数据  
Users.prototype.insertUser = function(callback){
    new db_users({
        username : this.username,
        passward : this.passward,
        email : this.email
    }).save(function(err , data){
        if(err) return callback(err);
        callback();
    })
}


module.exports = Users;