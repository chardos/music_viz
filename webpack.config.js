var path = require('path');
module.exports = {
  entry: './js/main.js',
  output: {
       path: __dirname,
       filename: 'dist/js/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a valid name to reference
        query: {
          presets: ['es2015']
        }
      }
    ],
    resolve: {
      extensions: ['', '.js', '.jsx']
    }
  }
};
