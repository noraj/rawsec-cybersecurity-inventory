var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');
var StringReplacePlugin = require('string-replace-webpack-plugin');

module.exports = {
    cache: true,
    entry: webpackConfig.entry,
    output: webpackConfig.output,
    resolve: webpackConfig.resolve,
    module: webpackConfig.module,
    devtool: 'source-map',
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new StringReplacePlugin()
    ]
};
