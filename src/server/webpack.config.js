/* eslint no-var: 0, import/no-extraneous-dependencies: 0 */
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var projectRoot = path.resolve(__dirname, '../../');

module.exports = {
  devtool: '#source-map',
  entry: {
    main: path.join(projectRoot, 'src/app/client/main.js'),
  },
  module: {
    loaders: [
      {
        loader: 'url-loader?limit=100000',
        test: /.(png|woff|woff2|eot|ttf|svg)$/,
      },
      {
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader'),
        test: /.css$/,
      },
      {
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!less-loader'),
        test: /.less$/,
      },
      {
        exclude: [/node_modules/],
        loader: 'babel-loader',
        test: /\.js?$/,
      },
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(projectRoot, './dist'),
  },
  plugins: [
    new ExtractTextPlugin('style.css', {
      allChunks: true,
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ output: { comments: false } }),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    moduleDirectories: ['node_modules'],
    root: [
      path.resolve(projectRoot, './node_modules'),
    ],
  },
};
