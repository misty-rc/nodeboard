var mongoose = require('mongoose'),
    mongooseAuth = require('mongoose-auth'),
    conf = require('../conf.js'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;

var UserSchema = new Schema({
    displayName: {type:String, default: null}
});
var User;

UserSchema.plugin(mongooseAuth, {
    everymodule: {
        everyauth: {
            User: function() {
                return User;
            },
	        handleLogout: function(req, res) {
		        req.logout();
		        res.writeHead(303, {'Location': this.logoutRedirectPath()});
		        res.end();
	        }
        }
    },
    facebook: {
	    everyauth: {
	        myHostname: conf.myHostname,
	        appId: conf.facebook.oauth.appId,
	        appSecret: conf.facebook.oauth.appSecret,
	        scope: 'email,user_about_me',
	        redirectPath: '/',
            findOrCreateUser: function(session, accessTok, accessTokExtra, fbUser) {
                var promise = this.Promise();
                var User = this.User()();
                User.findOne({'fb.id': fbUser.id}, function(err, foundUser) {
                    if(err) return promise.fail(err);
                    if(foundUser) return promise.fulfill(foundUser);
                    console.log('CREATE WITH FACEBOOK -override-');
                    User.createWithFB(fbUser, accessTok, accessTokExtra.expires, function(err, createUser) {
                        if(err) return promise.fail(err);
                        //TODO: create logici 'account link, schema'
                        return promise.fulfill(createUser);
                    });
                });
                return promise;
            }
	    }
    },
    twitter: {
	    everyauth: {
	        myHostname: conf.myHostname,
	        consumerKey: conf.twitter.oauth.consumerKey,
	        consumerSecret: conf.twitter.oauth.consumerSecret,
	        redirectPath: '/',
            findOrCreateUser: function(session, accessTok, accessTokSecret, twitterUser) {
                var promise = this.Promise(),
                    User = this.User()();
                User.findOne({'twit.id': twitterUser.id}, function(err, foundUser) {
                    if(err) return promise.fail(err);
                    if(foundUser) return promise.fulfill(foundUser);
                    console.log('CREATE WITH TWITTER -override-');
                    User.createWithTwitter(twitterUser, accessTok, accessTokSecret, function(err, createUser) {
                        if(err) return promise.fail(err);
                        //TODO: create logic 'account link, schema'
                        return promise.fulfill(createUser);
                    });
                });
                return promise;
            }
	    }
    },
    github: {
        everyauth: {
	        myHostname: conf.myHostname,
	        appId: conf.github.oauth.appId,
	        appSecret: conf.github.oauth.appSecret,
	        scope: 'user,public_repo,repo,gist',
	        redirectPath: '/',
            findOrCreateUser: function(session, accessTok, accessTokExtra, ghUser) {
                var promise = this.Promise(),
                    User = this.User()();
                User.findOne({'github.id': ghUser.id}, function(err, foundUser) {
                    if(err) return promise.fail(err);
                    if(foundUser) return promise.fulfill(foundUser);
                    console.log('CREATE WITH GITHUB -override-');
                    User.createWithGithub(ghUser, accessTok, function(err, createUser) {
                        if(err) return promise.fail(err);
                        // TEST
                        //   ghUser.name -> schema.displayName -> session.displayName
                        createUser.displayName = ghUser.name;
                        createUser.save(function(err, moduser) {
                            if(err) return promise.fail(err);
                            return promise.fulfill(createUser);
                        });
                    });
                });
                return promise;
            }
        }
    }
});

mongoose.model('User', UserSchema);
mongoose.connect('mongodb://localhost/nodeboard');

User = module.exports = mongoose.model('User');
