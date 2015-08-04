var fs = require('fs');
var express = require('express');
var morgan = require('morgan');
var loggly = require('loggly');
var routes = require('./routes/index');
var pizza = require('./routes/pizza');

var app = express();

app.set('view engine', 'ejs');
app.set('case sensitive routing', true);

app.locals.title = 'aweso.me';

app.use(function (req, res, next) {
  // logging at the top
  console.log('Request at ' + new Date().toISOString());
  next();
});
var logStream = fs.createWriteStream('access.log', {flags: 'a'});
app.use(morgan('combined', {stream: logStream}));
app.use(morgan('dev'));

 var client = loggly.createClient({
    token: "fe19754b-ea8c-44bc-a1b3-f26896e81cba",
    subdomain: "chadcates",
    tags: ["NodeJS"],
    json:true
});


app.use(function (req, res, next) {
  client.log({
    ip: req.ip,
    date: new Date(),
    url: req.url,
    status: req.statusCode,
    method: req.method
  });
  next();
});


app.use(express.static('public'));

app.use('/', routes);
app.use('/pizza', pizza);

app.use(function (req, res) {
  res.status(403).send('Unauthorized!');
});

app.use(function (err, req, res, next) {
  // pass 4 arguments to create an error handling middleware
  console.log('ERRRRRRRRRR', err.stack);
  res.status(500).send('My Bad');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%d', host, port);
});