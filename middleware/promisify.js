const Promise = require('bluebird');

module.exports = function (app) {
  //Promisify render method
  app.use(function (req, res, next) {
    res.renderAsyc = Promise.promisify(res.render);
    next();
  });
};
