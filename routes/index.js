/**
 * Created by arey on 4/28/17.
 */
module.exports = (app) => {
  app.get('/', (req, res) => {
    // Initial State
    res.render('index', {});
  });
};