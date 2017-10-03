 /**
 * Created by arey on 4/28/17.
 */
const config = require('config');
const logger = require('./helpers/logger')('index');
const { isDevelopment } = require('./helpers/environmentHelper');
const express = require('express');
const app = express();

const port = config.get('app.port');

/**
 * App Routes and Middlewares
 */
app.use(
  '/',
  // Before Middlewares
  [
    require('./middleware/device-detection.js'),
    require('./middleware/request-logger.js'),
    require('./middleware/react-renderer.js')(),
  ],
  // Array with hot-reloading middlewares
  require('./middleware/hot-reloading')(),
  [
    // Pages
    require('./app/routes/index'),
    require('./app/routes/adaptive'),
  ],
  require('./middleware/error-handler')
  // After Middlewares
);

/**
 * Api Routes and Middlewares
 */
app.use(
  '/api',
  // Before Middlewares
  [
    // Endpoints
    require('./api/index'),
  ]
  // After Middlewares
);

// Serve static files
app.use(express.static('app/assets'));

// Serve the build bundles on production
if (!isDevelopment()) {
  app.use(express.static('bundles'));
}

app.listen(port, () => {
  logger.info('App working on port: ' + port);
});
