const router = require('express').Router();

router.get('/adaptive', (req, res) => {
  // Initial State
  res.render('adaptive', {});
});

module.exports = router;
