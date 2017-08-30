// Load transpiler to support react code
require('babel-core/register')();

const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Head = require('react-declarative-head');
const { isDevelopment } = require('../helpers/environmentHelper');
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
      let styleAssetPath = pageComponent.toLowerCase() + '.css';

      if (isDevelopment()) {
        // Remove the cache of all of the pages JS files on app folder (This is to prevent the page and components not being cache on SSR)
        Object.keys(require.cache).forEach(function (id) {
          if (/[\/\\]app[\/\\]/.test(id) && /\.js$/.test(id)) {
            deleteRequireCache(id);
          }
        });
      } else {
        // Get the real asset names
        try {
          const manifestFile = JSON.parse(fs.readFileSync(path.join(__dirname, '../bundles/manifest.json')));
          scriptAssetPath = manifestFile[scriptAssetPath] || '';
          styleAssetPath = manifestFile[styleAssetPath] || '';
        } catch (e) {
          throw new Error('Error reading manifest file: ' + e);
        }
      }

      // Merge the default props for layouts with the ones sended on the route
      const layoutProps = merge({
        userAgent: req.headers['user-agent']
      }, (pageProps.layout || {}));

      // Remove it from the props, so its not going to be added on the pageScript
      if (pageProps.layout) {
        delete pageProps.layout;
      }

      const LayoutElement = React.createElement(DefaultLayout, layoutProps);
      const LayoutHTML = ReactDOMServer.renderToStaticMarkup(LayoutElement);
      const stringApp = ReactDOMServer.renderToString(React.createElement(ReactComponentPage, pageProps));
      // Replace where the Application is going to be and render the App
      const appHtml = LayoutHTML.replace('{{children}}', stringApp);

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            ${styleAssetPath ? '<link rel="stylesheet" href="' + styleAssetPath + '">' : ''}
            ${Head.rewind()}
          </head>
          <body>
            ${appHtml}
          </body>
          <script type="application/javascript">
              window.__PRELOADED_STATE__ = ${JSON.stringify(pageProps)};
          </script>
          ${scriptAssetPath ? '<script src="' + scriptAssetPath + '"></script>' : ''}
        </html>
      `;

      res.send(html);
    };

    next();
  });
};
