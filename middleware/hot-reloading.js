/**
 * Created by arey on 5/3/17.
 */
const config = require('config');
const environmentHelper = require('../helpers/EnvironmentHelper');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const port = config.get('app.port');

module.exports = (app) => {
  if (environmentHelper.isDevelopment()) {
    const compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
      publicPath: 'http://localhost:' + port,
      stats: {
        colors: true
      }
    }));

    app.use(webpackHotMiddleware(compiler));
  }
};