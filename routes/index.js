var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/welcome/:name', function (req, res, next) {
  let exclamation = (req.query.e == 'true' ? '!' : '.')
  res.send('bonjour ' + req.params.name + exclamation);
});

module.exports = router;
