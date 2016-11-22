"use strict";

let path = require('path');
let webpack = require('webpack');
let merge = require('webpack-merge');
let autoprefixer = require('autoprefixer');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let includeCompass = 'includePaths[]=' + path.resolve(__dirname, '../node_modules/compass-mixins/lib');
let TARGET_ENV = process.env.npm_lifecycle_event === 'build' ? 'production' : 'development';

let common = {
  entry: [
    __dirname + '/../src/sass/app.scss',
    __dirname + '/../src/js/index.js',
  ],

  output: {
    path: path.resolve(__dirname, '../static/'),
    filename: 'js/bundle.js',
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx']
  },

  postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
}

if (TARGET_ENV === 'production') {
  module.exports = merge(common, {
    devtool: 'source-map',

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
        }, {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style-loader', 'css!sass?' + includeCompass, ['css-loader', 'postcss-loader'])
        }
      ]
    },

    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new ExtractTextPlugin('css/style.css', { allChunks: true }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
} else {
  module.exports = merge(common, {
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
          loader: ExtractTextPlugin.extract('style-loader', 'css!sass?' + includeCompass, ['css-loader', 'postcss-loader'])
        }
      ]
    },

    devtool: 'source-map',
    devServer: {
      contentBase: 'static/',
    },

    plugins: [
      new ExtractTextPlugin('css/style.css', { allChunks: true }),
    ],
  });
}
