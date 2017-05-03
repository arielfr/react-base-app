/**
 * Created by arey on 4/28/17.
 */
const config = require('config');
const environmentHelper = require('./helpers/EnvironmentHelper');
const fs = require('fs');
const express = require('express');
const app = express();

const port = config.get('app.port');
const baseDirectory = __dirname;
const startUpTimeStamp = new Date().getTime();

require('./middleware/promisify')(app);
require('./middleware/request-logger.js')(app);
require('./middleware/view-engine')(app, baseDirectory);
require('./middleware/custom-renderer.js')(app, startUpTimeStamp);
require('./middleware/hot-reloading')(app);

require('./routes/index')(app);

// Serve static files
app.use(express.static('public'));

if (!environmentHelper.isDevelopment()) {
  app.use(express.static('bundles'));
}

app.listen(port, () => {
  console.log('App working on port: ' + port);
});
