/**
 * Created by arey on 4/28/17.
 */
const environmentHelper = require('./helpers/EnvironmentHelper');
const config = require('config');
const webpack = require('webpack');
const path = require('path');
const baseDirectory = __dirname;

const port = config.get('app.port');

module.exports = {
  entry: entryPoint({
    index: path.join(baseDirectory, '/app/client/index.js')
  }),
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
        loader: 'babel-loader'
      }
    ]
  },
  plugins: pluginsToLoad(),
  target: 'web'
};

/**
 * Add modules to entry point only when its development
 * @param entry
 * @returns {*}
 */
function entryPoint(entry) {
  const devEntries = ['react-hot-loader/patch', 'webpack-hot-middleware/client'];

  if (Array.isArray(entry)) {
    return {
      main: (environmentHelper.isDevelopment()) ? devEntries.concat(entry) : entry
    }
  } else if (typeof entry === 'string') {
    return {
      main: (environmentHelper.isDevelopment()) ? devEntries.concat([entry]) : [entry]
    }
  } else if (typeof entry === 'object') {
    Object.keys(entry).forEach((entryName) => {
      if (!Array.isArray(entry[entryName])) {
        entry[entryName] = (environmentHelper.isDevelopment()) ? devEntries.concat([entry[entryName]]) : [entry[entryName]]
      } else {
        entry[entryName] = (environmentHelper.isDevelopment()) ? devEntries.concat(entry[entryName]) : entry[entryName]
      }
    });
    return entry;
  } else {
    throw new Error(`Expected entry point to be object, array or string. Instead got: ${entry}`);
  }
}

function pluginsToLoad() {
  let plugins = [];

  if(environmentHelper.isDevelopment()){
    plugins = plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ]);
  }

  return plugins;
}