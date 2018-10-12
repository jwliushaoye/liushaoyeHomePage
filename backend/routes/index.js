//首 页
const HomePage = require('./home.js');
// 登录
const LoginPage = require('./login');
//文章列表
const ArticlePage = require('./articles');
// 文件上传
const FileUpload = require('./articles');

module.exports = {
    '/api/home' : HomePage,
    '/api' : LoginPage,
    '/api/article' : ArticlePage,
    '/api/uplad': FileUpload
}