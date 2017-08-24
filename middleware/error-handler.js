module.exports = function (app) {
  app.use(errorHandler);
};

function errorHandler(err, req, res, next) {
  res.render('error', {});
}