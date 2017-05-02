/**
 * Created by arey on 4/28/17.
 */
const config = require('config');
const webpack = require('webpack');
const path = require('path');
const baseDirectory = __dirname;

const port = config.get('app.port');

module.exports = {
  // the entry file for the bundle
  entry: {
    'index': [path.join(baseDirectory, '/app/client/index.js'), 'webpack-hot-middleware/client', 'react-hot-loader/patch']
  },
  // the bundle file we will get in the result
  output: {
    publicPath: 'http://localhost:' + port + '/',
    path: path.join(baseDirectory, 'bundles'),
    //path: '/',
    filename: '[name].js',
  },
  module: {
    // apply loaders to files that meet given conditions
    loaders: [
      {
        test: /\.js?$/,
        include: path.join(baseDirectory, '/app'),
        loader: 'babel-loader',
        query: {
          presets: ["react", ["es2015", {modules: false}]],
          plugins: [
            'react-hot-loader/babel',
            'transform-react-constant-elements',
            'transform-react-inline-elements',
          ]
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  target: 'web'
};