// This library allows us to combine paths easily
const path = require('path');
module.exports = {
  entry: path.resolve(__dirname, 'src', 'js', 'prepro.js'),
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
        test: /\.ejs/,
        use: {
          loader: 'ejs-loader',
        },
      }
    ]
  }
};
