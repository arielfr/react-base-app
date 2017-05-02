/**
 * Created by arey on 4/28/17.
 */
// Load transpiler to support react code
require('import-export');
require('babel-core/register')({
  "presets": ["es2015", "react"]
});

const react = require('react');
const reactDomServer = require('react-dom/server');
const renderToString = reactDomServer.renderToString;
const Head = require('react-declarative-head');

module.exports = {
  renderPage: (req, res, page, inheritState) => {
    const state = Object.assign({
      userAgent: req.headers['user-agent']
    }, inheritState);

    const stringApp = renderToString(react.createElement(page, {
      initialState: state
    }));

    res.renderSync('index', {
      head: Head.rewind(),
      app: stringApp,
      state: state
    });
  }
};