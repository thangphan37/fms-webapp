var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    './app/app.jsx'
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  resolve: {
    root: __dirname,
    modulesDirectories: [
      'node_modules',
      './app/components',
      './app/api',
      './app/pages',
      './app/pages/pages',
      './app/pages/dashboard',
      './app/pages/posts'
    ],
    alias: {
      applicationStyles: 'app/styles/app.scss'
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        },
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/
      },
      { test: /\.(png|jpg)$/, loader: 'file-loader?limit=8192' }
    ]
  },
  devtool: 'cheap-module-eval-source-map'
};
