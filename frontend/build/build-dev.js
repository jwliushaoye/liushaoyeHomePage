// require('./check-version')()

process.env.NODE_ENV = 'production';

const path = require('path');
const ora = require('ora');
const rm = require('rimraf');  //rm- rf  命令  以包的形式包装rm -rf命令 用来删除文件和文件
const config = require('../config');
const webpack = require('webpack');
const webpackDevConfig = require('./webpack.dev.conf');
const chalk = require('chalk');


let spinner = ora('building for production...');
spinner.start();

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory) , function(err) {
    if(err) throw err;
    webpack(webpackDevConfig , function(err , stats){
        spinner.stop();
        if (err) throw err;

        process.stdout.write(stats.toString({
            colors : true,
            modules : false,
            children : false,
            chunks : false,
            chunkModules : false
        }) + '\n\n');

        console.log(chalk.cyan('  Build complete.\n'));
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
})