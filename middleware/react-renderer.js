// Load transpiler to support react code
require('babel-core/register')();

const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Head = require('react-declarative-head');
const environmentHelper = require('../helpers/environmentHelper');
const merge = require('deepmerge');
const DefaultLayout = require('./Layout');

const deleteRequireCache = (path) => {
  delete require.cache[require.resolve(path)]
};

module.exports = (app, opts = {}) => {
  app.use((req, res, next) => {
    /**
     * Override render from Express. First render React with Dom Server. Then pass it to Express. And Express run it
     * to its View Engine configured
     * @param pageComponent
     * @param pageProps
     */
    res.render = (pageComponent, pageProps) => {
      const pagePath = '../app/pages/' + pageComponent + '/index';
      const ReactComponentPage = require(pagePath);
      // Assets names to be imported on the HTML
      let scriptAssetPath = pageComponent.toLowerCase() + '.js';
      let styleAssetPath  = pageComponent.toLowerCase() + '.css';

      // TODO: Need to remove the cache of the requires inside page, or when you refresh you will see a flash
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

      // Merge the default props for layouts with the ones sended on the route
      const layoutProps = merge({
        userAgent: req.headers['user-agent']
      }, (pageProps.layout || {}));

      // Remove it from the props, so its not going to be added on the pageScript
      if ( pageProps.layout ) {
        delete pageProps.layout;
      }

      const LayoutElement = React.createElement(DefaultLayout, layoutProps);
      const LayoutHTML = ReactDOMServer.renderToStaticMarkup(LayoutElement);
      const stringApp = ReactDOMServer.renderToString(React.createElement(ReactComponentPage, pageProps));
      // Replace where the Application is going to be and render the App
      const output = LayoutHTML.replace('{{children}}', stringApp);

      app.render('application', {
        head: Head.rewind(),
        app: output,
        state: pageProps, // Only send the props required by the page component
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
