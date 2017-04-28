/**
 * Created by arey on 4/28/17.
 */
const ReactRenderer = require('../helpers/ReactRenderer');
const Index = require('../app/pages/Index');

module.exports = (app) => {
  app.get('/', (req, res) => {
    // Initial State
    ReactRenderer.renderPage(req, res, Index, {});
  });
};