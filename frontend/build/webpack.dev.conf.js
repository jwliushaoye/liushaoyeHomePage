'use strict'
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

let env = config.dev.env;

const webpackConfig = merge(baseWebpackConfig , {
    module : {
        rules : utils.styleLoaders({
            sourceMap : config.dev.productionSourceMap,
            extract : true
        })
    },
    devtool : config.dev.productionSourceMap ? '#source-map' : false,
    output : {
        path : config.dev.assetsRoot,
        filename : utils.assetsPath('js/[name].js'),
        chunkFilename : utils.assetsPath('js/[id].js')
    },
    // 启动自动编译及cache
    cache : true ,
    watch : true ,
    plugins : [
        // 编辑时创建环境变量
        new webpack.DefinePlugin({
            'process.env' : env
        }),
        // 提取css
        new ExtractTextPlugin({
            filename : utils.assetsPath('css/[name].css')
        }),
        // 压缩css以及js
        new OptimizeCSSPlugin({
            cssProcessorOptions :{
                safe : true
            }
        }),
        // 生成html文件
        new HtmlWebpackPlugin({
            filename : config.dev.index,
            template : 'index.html',
            inject : true ,
            minify : {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode : 'dependency'
        }),
        // 提取公共代码块  -》 vendor
        new webpack.optimize.CommonsChunkPlugin({
            name : 'vendor',
            minChunks : function(module , count) {
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) && 
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        // 提取公共代码块  -》 manifest
        new webpack.optimize.CommonsChunkPlugin({
            name : 'manifest',
            chunks : ['vendor']
        }),
        // static文件打包时直接拷贝
        new CopyWebpackPlugin ([
            {
                from : path.resolve(__dirname , '../static'),
                to : config.dev.assetsSubDirectory,
                ignore : ['.*']
            }
        ])
    ]
});

if (config.build.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')
  
    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
  }
  
if (config.build.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
};

module.exports = webpackConfig;

