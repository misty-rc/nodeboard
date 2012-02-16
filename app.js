var express = require('express'),
    everyauth = require('everyauth'),
    mongooseAuth = require('mongoose-auth'),
    RedisStore = require('connect-redis')(express),
    conf = require('./conf.js'),
    routes = require('./routes');

// Schema
var User = require('./schema/User');

// debug
everyauth.debug = true;
var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
	secret: "it might as well be spring",
	store: new RedisStore()
    }));
    app.use(mongooseAuth.middleware());
    app.use(express.static(__dirname + '/public'));
});

// Environment
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

// test
app.get('/', function(req, res) {
    res.render('index', {title: 'Express'});
});

app.get('/test', function(req, res) {
    res.render('index', {title: 'Test'});
});

app.get('/callback', function(req, res) {
    var https = require('https');
    var options = {
	host: 'api.github.com',
	path: '/users/misty-rc/gists',
	method: 'GET'
    };
    var client = https.request(options, function(res) {
	var body = '';
	res.on('data', function(data) {
	    body += data;
	});
	res.on('end', function() {
	    console.log(body);
	});
    });
    client.end();
    res.render('index');
});

//apply express
mongooseAuth.helpExpress(app);

app.listen(3000, function() {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
