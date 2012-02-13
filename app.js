
/**
 * Module dependencies.
 */

var express = require('express'),
    everyauth = require('everyauth'),
    conf = require('./conf'),
    routes = require('./routes');

//debug
everyauth.debug = true;
var usersById = {};
var usersByGhId = {};
var nextUserId = 0;

function addUser (source, sourceUser) {
    var user;
    if (arguments.length === 1) { // password-based
        user = sourceUser = source;
        user.id = ++nextUserId;
        return usersById[nextUserId] = user;
    } else { // non-password-based
        user = usersById[++nextUserId] = {id: nextUserId};
        user[source] = sourceUser;
    }
    return user;
}

everyauth.everymodule
    .findUserById( function (id, callback) {
        callback(null, usersById[id]);
    });

everyauth.github
    .appId(conf.github.appId)
    .appSecret(conf.github.appSecret)
    .callbackPath(conf.github.callbackPath)
    .findOrCreateUser(function (sess, accessToken, accessTokenExtra, ghUser) {
        return usersByGhId[ghUser.id] || (usersByGhId[ghUser.id] = addUser('github', ghUser));
    })
    .redirectPath('/');

var app = express.createServer(
    express.bodyParser(),
    express.static(__dirname + '/public'),
    express.cookieParser(),
    express.session({secret: 'ronnsummer'}),
    everyauth.middleware()
);

// Configuration

app.configure(function(){
    app.set('view engine', 'jade');
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
    res.render('callback');
});

//apply express
everyauth.helpExpress(app);

app.listen(3000, function() {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
