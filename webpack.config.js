/**
 * Created by arey on 4/28/17.
 */
const path = require('path');

module.exports = {
  // the entry file for the bundle
  entry: path.join(__dirname, '/app/client/index.js'),
  // the bundle file we will get in the result
  output: {
    path: path.join(__dirname, 'bundles'),
    filename: 'app.js',
  },
  module: {
    // apply loaders to files that meet given conditions
    loaders: [{
      test: /\.js?$/,
      include: path.join(__dirname, '/app'),
      loader: 'babel-loader',
      query: {
        presets: ["react", "es2015"],
        plugins: [
          'transform-react-constant-elements',
          'transform-react-inline-elements'
        ]
      }
    }]
  }
};