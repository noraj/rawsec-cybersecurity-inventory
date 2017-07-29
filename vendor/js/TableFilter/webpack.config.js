var webpack = require('webpack');
var path = require('path');
var Clean = require('clean-webpack-plugin');
var StringReplacePlugin = require('string-replace-webpack-plugin');
var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

module.exports = {
    cache: true,
    entry: {
        'main': path.join(__dirname, '/src/tablefilter.js')
    },
    output: {
        path: path.join(__dirname, '/dist/tablefilter'),
        filename: 'tablefilter.js',
        chunkFilename: 'tf-[name]-[chunkhash].js',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            sortabletable: '../../../libs/sortabletable.js'
        }
    },
    module: {
        rules: [
            {
                test: path.join(__dirname, 'src'),
                exclude: /tablefilter\/node_modules/,
                options: {
                    compact: false,
                    presets: ['es2015'],
                    plugins: [['transform-es2015-classes', {loose: true}]]
                },
                loader: 'babel-loader'
            }, {
                test: path.join(__dirname, 'src'),
                loader: StringReplacePlugin.replace({
                    replacements: [{
                        pattern: /{VERSION}/ig,
                        replacement: function (/*match, p1, offset, string*/) {
                            return pkg.version;
                        }
                    },{
                        pattern: /{AUTHOR}/ig,
                        replacement: function () {
                            return pkg.author.name;
                        }
                    }]
                })
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new Clean(['dist']),
        new webpack.optimize.AggressiveMergingPlugin(),
        new StringReplacePlugin(),
        new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.BannerPlugin({
            banner: '/** \n' +
            ' *\t '+pkg.name+' v'+pkg.version+' by '+pkg.author.name+'\n' +
            ' *\t build date: '+ new Date().toISOString() +' \n' +
            ' *\t MIT License  \n' +
            ' */ \n',
            raw: true
        })
    ]
};
