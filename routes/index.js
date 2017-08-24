const router = require('express').Router();

router.get('/', (req, res) => {
  // Initial State
  res.render('index', {});
});

module.exports = router;
