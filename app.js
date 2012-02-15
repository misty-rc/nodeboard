
/**
 * Module dependencies.
 */

var express = require('express'),
    everyauth = require('everyauth'),
    mongooseAuth = require('mongoose-auth'),
    conf = require('./conf.js'),
    routes = require('./routes');

var User = require('./schema/User');

//debug
everyauth.debug = true;

var app = module.exports = express.createServer(
    express.bodyParser(),
    express.static(__dirname + '/public'),
    express.cookieParser(),
    express.session({secret: 'ronnsummer'}),
    mongooseAuth.middleware()
);

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes
/**
 * 
 * /entry/ => post
 * /entry/:id
 * /entry/:id/edit => get
 * /entry/:id/edit => post
 * /admin
 * /admin/setting
 * 
 */

//トップ画面
//app.get('/', routes.index);
//
////記事
//app.get('/entry/:id', routes.view);
//app.get('/entry/:id/edit', routes.edit);
//app.put('/entry/:id/edit', routes.update);
//
////投稿（いらんかな）
//app.get('/entry/new', routes.newpost);
//app.post('/entry/new', routes.post);
//
////OAuth callback
//app.get('callback', routes.callback);

app.get('/', function(req, res) {
    res.render('index', {title: 'Express'});
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
