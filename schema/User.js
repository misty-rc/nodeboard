var mongoose = require('mongoose'),
    mongooseAuth = require('mongoose-auth'),
    conf = require('../conf.js'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;

// define schema
var User,
    UserSchema = new Schema({
        displayName: {type: String, default: null},
        serviceType: {type: String, default: null},
        accessTok: {type: String, default: null},
        accessTokSecret: {type: String, default: null}
    });

// import Linkage schema
var Linkage = require('./Linkage');

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
                var promise = this.Promise(),
                    User = this.User()();
                User.findOne({'fb.id': fbUser.id}, function(err, _foundUser) {
                    if(err) return promise.fail(err);

                    // exist user
                    if(_foundUser) return promise.fulfill(_foundUser);

                    // not exist user
                    console.log('CREATE WITH FACEBOOK -override-');
                    User.createWithFB(fbUser, accessTok, accessTokExtra.expires, function(err, _createUser) {
                        if(err) return promise.fail(err);

                        _createUser.displayName = fbUser.name;
                        _createUser.accessTok = accessTok;
                        _createUser.accessTokExtra = accessTokExtra;
                        _createUser.serviceType = conf.facebook.serviceType;
                        _createUser.save(function(err) {
                            if(err) return promise.fail(err);

                            var _linkage = new Linkage();
                            _linkage.displayName = fbUser.name;
                            _linkage.linkage.push({serviceType: conf.facebook.serviceType, linkid: _createUser._id});

                            _linkage.save(function(err) {
                                if(err) return promise.fail(err);
                                return promise.fulfill(_createUser);
                            });
                            return promise;
                        });
                        return promise;
                    });
                    return promise;
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
                User.findOne({'twit.id': twitterUser.id}, function(err, _foundUser) {
                    if(err) return promise.fail(err);

                    // exist user
                    if(_foundUser) return promise.fulfill(_foundUser);

                    // not exist user
                    console.log('CREATE WITH TWITTER -override-');
                    User.createWithTwitter(twitterUser, accessTok, accessTokSecret, function(err, _createUser) {
                        if(err) return promise.fail(err);

                        _createUser.displayName = twitterUser.name;
                        _createUser.accessTok = accessTok;
                        _createUser.accessTokSecret = accessTokSecret;
                        _createUser.serviceType = conf.twitter.serviceType;
                        _createUser.save(function(err) {
                            if(err) return promise.fail(err);

                            // create linkage
                            var _linkage = new Linkage();
                            _linkage.displayName = twitterUser.name;
                            _linkage.linkage.push({serviceType: conf.twitter.serviceType, linkid: _createUser._id});

                            _linkage.save(function(err) {
                                if(err) return promise.fail(err);
                                return promise.fulfill(_createUser);
                            });
                            return promise;
                        });
                        return promise;
                    });
                    return promise;
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
                
                User.findOne({'github.id': ghUser.id}, function(err, _foundUser) {
                    if(err) return promise.fail(err);

                    console.log('findone');
                    // exist user
                    if(_foundUser) {
                        // find linkage

                        // 1. exist service 
//                        var query = Linkage.find({});
//                        query.where('linkage').elemMatch(function(elem){
//                            elem.where('serviceType', _foundUser.serviceType);
//                            elem.where('linkid', _foundUser._id);
//                        });
//
//                        query.exec(function(err, docs) {
//                            if(!err) {
//                                debugger;
//                                session.linkage.accountId = docs.acountId;
//                            }
//                        });

                        // 2. exist email
                        
                        console.log('exist user');
                        return promise.fulfill(_foundUser);
                    }

                    // not exist user
                    console.log('CREATE WITH GITHUB -override-');
                    User.createWithGithub(ghUser, accessTok, function(err, _createUser) {
                        if(err) return promise.fail(err);

                        _createUser.displayName = ghUser.name;
                        _createUser.accessTok = accessTok;
                        _createUser.accessTokSecret = accessTokExtra;
                        _createUser.serviceType = conf.github.serviceType;
                        _createUser.save(function(err) {
                            if(err) return promise.fail(err);

                            // create linkage
                            var _linkage = new Linkage();
                            _linkage.displayName = ghUser.name;
                            _linkage.linkage.push({serviceType: conf.github.serviceType, linkid: _createUser._id});

                            _linkage.save(function(err) {
                                if(err) return promise.fail(err);
                                return promise.fulfill(_createUser);
                            });
                            return promise;
                        });
                        return promise;
                    });
                    return promise;
                });
                return promise;
            }
        }
    }
});




mongoose.model('User', UserSchema);
mongoose.connect('mongodb://localhost/nodeboard');

User = module.exports = mongoose.model('User');
