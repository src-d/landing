"use strict";

let path = require('path');
let webpack = require('webpack');
let merge = require('webpack-merge');
let autoprefixer = require('autoprefixer');
let extractTextPlugin = require('extract-text-webpack-plugin');

let includeCompass = 'includePaths[]=' + path.resolve(__dirname, '../node_modules/compass-mixins/lib');
let IS_PRODUCTION = process.env.npm_lifecycle_event === 'build';

let baseConf = {
    entry: [
        __dirname + '/../src/sass/app.scss',
        __dirname + '/../src/js/index.js',
    ],
    output: {
        path: path.resolve(__dirname, '../static/'),
        filename: 'js/bundle.js',
    },
    module: {
        loaders: [
        {
            test: /.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react']
            }
        }, {
            test: /\.(eot|ttf|woff|svg|png|gif|jpg|jpeg)$/,
            loaders: ['file']
        },
        {
            test: /\.scss$/,
            loader: extractTextPlugin.extract(
                'style-loader',
                'css!sass?' + includeCompass,
                ['css-loader', 'postcss-loader']
            )
        }
        ]
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx']
    },
    postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
}

let productionConf = {
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new extractTextPlugin('css/style.css', { allChunks: true }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}

let developmentConf = {
    devtool: 'source-map',
    devServer: {
        contentBase: 'static/',
    },
    plugins: [
        new extractTextPlugin('css/style.css', { allChunks: true }),
    ],
}

module.exports = merge(baseConf, IS_PRODUCTION ? productionConf : developmentConf);
