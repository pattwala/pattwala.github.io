var path = require('path');
var webpack = require('webpack');

// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './js/index.js',
  output: {
    path: path.join(__dirname),
    filename: 'js/bundle.js',
    publicPath: '/js/'
  },
  mode: 'development'
  // plugins: [
  //   new UglifyJSPlugin({
  //     mangle  : true,
  //     comments: false,
  //     compress: {
  //       warnings: false
  //     }
  //   }),
  //   new webpack.DefinePlugin({
  //     'process.env': {
  //       NODE_ENV: JSON.stringify('production')
  //     }
  //   }),
  //   new webpack.optimize.UglifyJsPlugin()
  // ],

  // module: {
  //   loaders: [
  //     {
  //       test: /.jsx?$/,
  //       loader: 'babel-loader',
  //       include: path.join(__dirname),
  //       exclude: /node_modules/,
  //       query: {
  //         presets: ['es2015', 'react']
  //       }
  //     },
  //     {
  //       test: /\.scss$/,
  //       loaders: ['style-loader', 'css-loader', 'sass-loader']
  //     }
  //   ]
  // },
};