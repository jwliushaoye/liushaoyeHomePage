const mongoose = require('mongoose');
let db = mongoose.connect('mongodb://127.0.0.1:27017/back');

mongoose.connection.on('error' , function(err) {
	console.log('链接数据库失败 :' + err)
});

mongoose.connection.on('open' , function() {
	console.log('----------链接数据库成功！----------')
});

// 保存用户信息
var userScheMa = new mongoose.Schema({
	username: {type : String , required : true},
	passward: {type : String , required : true},
	email : String
});
exports.users = mongoose.model('users' , userScheMa);

// 文章列表
var articleScheMa = new mongoose.Schema({
	creater : {type : String , required : true}, // 创建者
	create_time : {type : String , required :true},  // 创建时间
	title : {type : String ,required : true},  // 标题
	link : {type : String , required : true}, //链接
	comment : {type : String}
});
exports.articles = mongoose.model('articles' , articleScheMa);