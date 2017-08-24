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

const deleteRequireCache = (path) => {
  delete require.cache[require.resolve(path)]
};

module.exports = (app, opts = {}) => {
  app.use((req, res, next) => {
    /**
     * Override render from Express. First render React with Dom Server. Then pass it to Express. And Express run it
     * to its View Engine configured
     * @param page
     * @param inheritState
     */
    res.render = (page, inheritState) => {
      const pagePath = '../app/pages/' + page + '/index';
      const ReactComponentPage = require(pagePath).default;
      // Assets names to be imported on the HTML
      let scriptAssetPath = page.toLowerCase() + '.js';
      let styleAssetPath  = page.toLowerCase() + '.css';

      //Remove the require cache to prevent server & client inconsistencies
      if (environmentHelper.isDevelopment()) {
        deleteRequireCache(pagePath);
      }else{
        // Get the real asset names
        try{
          const manifestFile = JSON.parse(fs.readFileSync(path.join(__dirname, '../bundles/manifest.json')));
          scriptAssetPath = manifestFile[scriptAssetPath] || '';
          styleAssetPath = manifestFile[styleAssetPath] || '';
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

      app.render('application', {
        head: Head.rewind(),
        app: stringApp,
        state: state,
        style: styleAssetPath,
        script: scriptAssetPath
      }, function (error, response) {
        if (error) {
          return next(error);
        }
        return res.send(response);
      });
    };

    next();
  });
};
