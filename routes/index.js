var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.send('Hello World!');
});

router.get(/hello/, function (req, res) {
  res.send('Hello!');
});

router.get('/awesomethings', function (req, res) {
  setTimeout(function () {
    var awesomeThings = [
      'Pizza',
      'Bacon',
      '2nd Ammendment',
      'Pluto',
      'Space Jam'
    ];

    res.render('templates/world',
      {
        welcome: 'Thanks for coming!',
        awesomeThings: awesomeThings
      }
    );
  }, 5000);
});

router.get('/test', function (req, res, next) {
  res.write('Test1!');
  next();
});

router.get('/test', function (req, res) {
  res.end('Test2!');
});

router.get('/json', function (req, res) {
  res.send({an: 'object'});
});

router.get('/thisshoulderror', function (req, res) {
  res.send(badVariable);
});

module.exports = router;