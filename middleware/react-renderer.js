// Load transpiler to support react code
require('babel-core/register')();

const config = require('config');
const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Head = require('react-declarative-head');
const { isDevelopment } = require('../helpers/environmentHelper');
const merge = require('deepmerge');
const DefaultLayout = require('../app/components/Layout');

// Is the app adaptive
const isAdaptive = config.get('adaptive');

const deleteRequireCache = (path) => {
  delete require.cache[require.resolve(path)]
};

module.exports = (opts = {}) => {
  let manifestFile;

  if (!isDevelopment()) {
    if (fs.existsSync(path.join(__dirname, '../bundles/manifest.json'))) {
      manifestFile = JSON.parse(fs.readFileSync(path.join(__dirname, '../bundles/manifest.json')));
    } else {
      throw new Error('Manifest file doesnt exists');
    }
  }

  return (req, res, next) => {
    /**
     * Override render from Express. First render React with Dom Server. Then pass it to Express. And Express run it
     * to its View Engine configured
     * @param pageComponent
     * @param pageProps
     */
    res.render = (pageComponent, pageProps) => {
      const pagePath = `../app/pages/${pageComponent}/index`;
      const ReactComponentPage = require(pagePath);
      const deviceType = req.device.type;

      // Assets names to be imported on the HTML
      let scriptAssetPath = `${pageComponent.toLowerCase()}.js`;
      let styleAssetPath = `${pageComponent.toLowerCase()}.css`;

      // If it is adaptive override the styles depending on the device
      if (isAdaptive) {
        styleAssetPath = (deviceType === 'desktop') ? `${pageComponent.toLowerCase()}.desktop.css` : `${pageComponent.toLowerCase()}.mobile.css`;
      }

      let vendorAssetPath = 'vendor.js';

      if (isDevelopment()) {
        // Remove the cache of all of the pages JS files on app folder (This is to prevent the page and components not being cache on SSR)
        Object.keys(require.cache).forEach(function (id) {
          if (/[\/\\]app[\/\\]/.test(id) && /\.js$/.test(id)) {
            deleteRequireCache(id);
          }
        });
      } else {
        // Get real names from manifest file (files have hash)
        scriptAssetPath = manifestFile[scriptAssetPath] || '';
        styleAssetPath = manifestFile[styleAssetPath] || '';
        vendorAssetPath = manifestFile[vendorAssetPath] || '';
      }

      // Merge the default props for layouts with the ones sended on the route
      const layoutProps = merge({
        userAgent: req.headers['user-agent'],
        device: req.device,
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
            ${vendorAssetPath ? '<script type="application/javascript" src="' + vendorAssetPath + '"></script>' : ''}
            ${Head.rewind()}
          </head>
          <body>
            ${appHtml}
          </body>
          <script type="application/javascript">
              window.__PRELOADED_STATE__ = ${JSON.stringify(pageProps)};
          </script>
          ${scriptAssetPath ? '<script type="application/javascript" src="' + scriptAssetPath + '"></script>' : ''}
        </html>
      `;

      res.send(html);
    };

    next();
  };
};
