var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var bodyParser = require('body-parser')
var logger = require('morgan');
//favicons
var favicons  = require('connect-favicons')

var fs = require('fs');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser({
    limit: 2000000  //2m
  }));
app.use(bodyParser.urlencoded({extended:false}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    name : 'back',
    secret : 'liushaoye',
    cookie : {maxAge : 1000 * 60 * 60 * 60}  // 保存3天
}))

app.use(favicons(__dirname + '/public'));
app.use(require('connect-history-api-fallback')())
//express 静态文件系统
app.use(express.static(path.join(__dirname, 'views/dist')));
//但页面应用  所以所有请求都走 index.html
app.get('*' , function (req , res , next) {
    const html = fs.readFileSync(path.resolve(__dirname, './views/dist/index.html'), 'utf-8');
	res.writeHead(200, {
		'Content-Type': 'text/html; charset=utf-8'
	});
    res.send(html)
});

// 路由
var routerDummary = require('./routes/index.js');
for (let [key , value] of Object.entries(routerDummary)){
    app.use(key , value)
};


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
