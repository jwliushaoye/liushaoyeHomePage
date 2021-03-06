var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
    var assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
  }

exports.cssLoaders = function (options) {
    options = options || {}
    
    let cssLoader = {
        loader: 'css-loader',
        options : {
            minimize : process.env.NODE_ENV === 'production',
            sourceMap : options.sourceMap
        }
    };

    function generateLoaders(loader , loaderOptions){
        let loaders = [cssLoader];
        if(loader) {
            loaders.push({
                loader : loader + '-loader',
                options : Object.assign({} , loaderOptions , {
                    sourceMap : options.sourceMap
                })
            })
        };

        if(options.extract){
            return ExtractTextPlugin.extract({
                use : loaders ,
                fallback : 'vue-style-loader'
            })
        }else {
            return ['vue-style-loader'].concat(loaders)
        }
    };

    return {
        css : generateLoaders() ,
        postcss : generateLoaders() ,
        less : generateLoaders('less') ,
        sass : generateLoaders('scss', {indentedSyntax : true}) ,
        scss: generateLoaders('sass') ,
        stylus: generateLoaders('stylus') ,
        styl: generateLoaders('stylus')
    }
};

exports.styleLoaders = function(options) {
    let output = [];
    let loaders = exports.cssLoaders(options);
    for(let extension in loaders){
        let loader = loaders[extension];
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    };
    return output;
}
