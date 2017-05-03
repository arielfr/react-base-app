/**
 * Created by arey on 4/28/17.
 */
// Load transpiler to support react code
require('import-export');
require('babel-core/register')();

const fs = require('fs');
const path = require('path');
const react = require('react');
const reactDomServer = require('react-dom/server');
const renderToString = reactDomServer.renderToString;
const Head = require('react-declarative-head');
const environmentHelper = require('../helpers/EnvironmentHelper');

module.exports = {
  renderPage: function (req, res, page, inheritState) {
    const pagePath = '../app/pages/' + page;
    const ReactComponentPage = require(pagePath).default;
    // Assets names to be imported on the HTML
    let scriptAssetPath = page.toLowerCase() + '.js';
    let styleAssetPath  = page.toLowerCase() + '.css';

    //Remove the require cache to prevent server & client inconsistencies
    if (environmentHelper.isDevelopment()) {
      this.deleteRequireCache(pagePath);
    }else{
      // Get the real asset names
      try{
        const manifestFile = JSON.parse(fs.readFileSync(path.join(__dirname, '../bundles/manifest.json')));
        scriptAssetPath = manifestFile[scriptAssetPath] || scriptAssetPath;
        styleAssetPath = manifestFile[styleAssetPath] || styleAssetPath;
      }catch(e){
        throw new Error('Error reading manifest file: ' + e);
      }
    }

    const state = Object.assign({
      userAgent: req.headers['user-agent']
    }, inheritState);

    const stringApp = renderToString(react.createElement(ReactComponentPage, {
      initialState: state
    }));

    res.renderSync('application', {
      head: Head.rewind(),
      app: stringApp,
      state: state,
      style: styleAssetPath,
      script: scriptAssetPath
    });
  },
  deleteRequireCache: function (path) {
    delete require.cache[require.resolve(path)]
  }
};