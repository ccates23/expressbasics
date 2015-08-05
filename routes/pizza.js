var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  var obj = {
  	qty: req.query.qty || 1,
  	topping: req.query.topping || 'cheese'
  };


  res.render('templates/pizza', obj);
});

module.exports = router;