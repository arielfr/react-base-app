const router = require('express').Router();

router.get('/', (req, res) => {
  res.send({
    response: true,
  });
});

module.exports = router;
