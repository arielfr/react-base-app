/**
 * Created by arey on 4/28/17.
 */
const config = require('config');
const logger = require('winston-this')('index');
const { isDevelopment } = require('./helpers/environmentHelper');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const port = config.get('app.port');

app.use(bodyParser.json());

/**
 * App Routes and Middlewares
 */
app.use(
  config.get('app.basePath'),
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
  config.get('api.basePath'),
  // Before Middlewares
  [
    // Endpoints
    require('./api/index'),
  ]
  // After Middlewares
);

// Serve static files - Set maxAge to 1 hour
app.use(express.static('app/assets', {
  maxAge: isDevelopment() ? '0' : '1h',
}));

// Serve the build bundles on production - Set maxAge to 1 hour
if (!isDevelopment()) {
  app.use(express.static('bundles', {
    maxAge: '1d',
  }));
}

app.listen(port, () => {
  logger.info(`App working on port: ${port}`);
});
