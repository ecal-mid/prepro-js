// This library allows us to combine paths easily
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
module.exports = {
  entry: [
    path.resolve(__dirname, 'src', 'js', 'prepro.js'),
    path.resolve(__dirname, 'src', 'css', 'prepro.css'),
  ],
  output: {path: path.resolve(__dirname, 'build'), filename: 'prepro.min.js'},
  resolve: {extensions: ['.js']},
  module: {
    rules: [
      {
        test: /\.js/,
        use: {
          loader: 'babel-loader',
          options: {presets: ['es2015']},
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{loader: 'css-loader', options: {minimize: true}}],
        }),
      },
      {
        test: /\.ejs/,
        use: {
          loader: 'ejs-loader',
        },
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('prepro.min.css'),
  ],
};
