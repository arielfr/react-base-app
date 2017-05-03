/**
 * Created by arey on 4/28/17.
 */
// Load transpiler to support react code
require('import-export');
require('babel-core/register')();

const react = require('react');
const reactDomServer = require('react-dom/server');
const renderToString = reactDomServer.renderToString;
const Head = require('react-declarative-head');
const environmentHelper = require('../helpers/EnvironmentHelper');

module.exports = {
  renderPage: function (req, res, page, inheritState) {
    const pagePath = '../app/pages/' + page;
    const ReactComponentPage = require(pagePath).default;

    //Remove the require cache to prevent server & client inconsistencies
    if (environmentHelper.isDevelopment()) {
      this.deleteRequireCache(pagePath);
    }

    const state = Object.assign({
      userAgent: req.headers['user-agent']
    }, inheritState);

    const stringApp = renderToString(react.createElement(ReactComponentPage, {
      initialState: state
    }));

    res.renderSync('index', {
      head: Head.rewind(),
      app: stringApp,
      state: state
    });
  },
  deleteRequireCache: function (path) {
    delete require.cache[require.resolve(path)]
  }
};