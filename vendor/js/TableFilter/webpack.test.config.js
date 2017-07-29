var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var path = require('path');
var Clean = require('clean-webpack-plugin');

module.exports = {
    cache: true,
    entry: webpackConfig.entry,
    output: webpackConfig.output,
    resolve: webpackConfig.resolve,
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                exclude: /tablefilter\/node_modules/,
                loader: 'isparta-loader'
            }
        ]
        // TODO: re-instate StringReplacePlugin, currently failing
        // in conjunction with 'isparta-loader'
    },
    devtool: 'source-map',
    plugins: [
        new Clean(['dist']),
        new webpack.LoaderOptionsPlugin({
            debug: true,
            options: {
                isparta: {
                    embedSource: true,
                    noAutoWrap: true,
                    babel: {
                        compact: false,
                        presets: ['es2015'],
                        plugins: [['transform-es2015-classes', {loose: true}]]
                    }
                }
            }
        })
    ]
};
