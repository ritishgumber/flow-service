var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 4000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var database = require('./config/database');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cors = require('cors');
var env = process.env.isHosted || false;
//============= app level middlewares ================ //
mongoose.connect(env
	? database.remoteUrl
	: database.localUrl);

app.use(cors()); //Access-Control-Allow-Origin header
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ 'extended': true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(express.static('public'));

//============ session ============//
app.use(session({ secret: 'flowuisecret', resave: true, saveUninitialized: true })); // session secret

// ============ Add Routes =========== //
app.use('/api', require('./api/graph')())
app.use('/api', require('./api/test')())
app.use('/api', require('./api/package')())
app.use('/api', require('./api/edge')())
app.use('/api', require('./api/api')())
app.use('/api', require('./api/component')())
app.use('/api', require('./api/node')())

app.get('/status', function (req, res) {

	res.status(200).send({ message: 'OK' })
})

server.listen(port, function () {
	console.log("CloudBoost Flow running on :" + port)
});