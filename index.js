/**
 * Created by arey on 4/28/17.
 */
const config = require('config');
const logger = require('./helpers/logger')('index');
const environmentHelper = require('./helpers/environmentHelper');
const express = require('express');
const app = express();


const port = config.get('app.port');
const baseDirectory = __dirname;

require('./middleware/request-logger.js')(app);
require('./middleware/view-engine')(app, baseDirectory);
require('./middleware/react-renderer.js')(app);
require('./middleware/hot-reloading')(app);

app.use(require('./routes/index'));

// Serve static files
app.use(express.static('app/assets'));

if (!environmentHelper.isDevelopment()) {
  app.use(express.static('bundles'));
}

app.listen(port, () => {
  logger.info('App working on port: ' + port);
});
