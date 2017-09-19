/**
 * Created by arey on 5/3/17.
 */
const config = require('config');
const { isDevelopment } = require('../helpers/environmentHelper');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const port = config.get('app.port');

module.exports = () => {
  const hotReloadingMiddlewares = [];

  if (isDevelopment()) {
    const compiler = webpack(webpackConfig);

    hotReloadingMiddlewares.push(webpackDevMiddleware(compiler, {
      publicPath: 'http://127.0.0.1:' + port,
      stats: {
        colors: true
      }
    }));

    hotReloadingMiddlewares.push(webpackHotMiddleware(compiler));
  }

  return hotReloadingMiddlewares;
};