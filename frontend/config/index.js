'use strict'

const path = require('path');

module.exports = {
    build : {
        // 环境
        env : require('./prod.env'),
        // 打包后index.html文件的目录
        index : path.resolve(__dirname , '../../backend/views/dist/index.html'),
        assetsRoot : path.resolve(__dirname , '../../backend/views/dist'),
        // 将项目中static文件下内容拷贝到配置的问价xia1
        assetsSubDirectory : 'static',
        //资源公共路径
        assetsPublicPath : '/',
        //是否开启sourcemap
        productionSourceMap : false,


        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev : {
        env : require('./dev.env'),
        index : path.resolve(__dirname , '../../backend/views/dist/index.html'),
        assetsRoot : path.resolve(__dirname , '../../backend/views/dist'),
        assetsSubDirectory : 'static',
        assetsPublicPath : '/',

        productionSourceMap : true,

        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    }
}
