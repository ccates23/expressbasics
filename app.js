//  npm variables

var fs = require('fs');
var express = require('express');
var lessCSS = require('less-middleware');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

//  required routes

var routes = require('./routes/index');
var pizza = require('./routes/pizza');
var chickennuggets = require('./routes/chickennuggets');
var imgur = require('./routes/imgur');
var user = require('./routes/user');

var app = express();

app.set('view engine', 'ejs');
app.set('case sensitive routing', true);

app.locals.title = 'Awesome';

app.use(bodyParser.urlencoded({extended: true}));
app.use(lessCSS('public'));

app.use(session({
  secret: 'mason',
  resave: false,
  saveUninitialized: true
}));

app.use(function (req, res, next) {
 req.session.count = 1;
 console.log('SESSION>>>>>>>>>>>>>>>>>', req.session);
 console.log('SESSION ID>>>>>>>>>>>>', req.sessionID)
 next();
});



var logStream = fs.createWriteStream('access.log', {flags: 'a'});
app.use(morgan('combined', {stream: logStream}));
app.use(morgan('dev'));

app.use(function (req, res, next) {
  var client = require('./lib/loggly')('incoming');

  client.log({
    ip: req.ip,
    date: new Date(),
    url: req.url,
    status: res.statusCode,
    method: req.method
  });
  next();
});

app.use(express.static('public'));

require('./lib/mongodb');


app.use('/', routes);
app.use('/pizza', pizza);
app.use('/chickennuggets', chickennuggets);
app.use('/imgur', imgur);
app.use('/user', user);

app.use(function (req, res) {
  res.status(403).send('Unauthorized!');
});

app.use(function (err, req, res, next) {
  var client = require('./lib/loggly')('error');

  client.log({
    ip: req.ip,
    date: new Date(),
    url: req.url,
    status: res.statusCode,
    method: req.method,
    stackTrace: err.stack
  });

  // pass 4 arguments to create an error handling middleware
  console.log('ERRRRRRRRRR', err.stack);
  res.status(500).send('My Bad');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%d', host, port);
});
