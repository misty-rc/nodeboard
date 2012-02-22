var mongoose = require('mongoose'),
    mongooseAuth = require('mongoose-auth'),
    conf = require('../conf.js'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;

var UserSchema = new Schema({}),
    User;

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
	    redirectPath: '/'
	}
    },
    twitter: {
	everyauth: {
	    myHostname: conf.myHostname,
	    consumerKey: conf.twitter.oauth.consumerKey,
	    consumerSecret: conf.twitter.oauth.consumerSecret,
	    redirectPath: '/'
	}
    },
    github: {
        everyauth: {
	    myHostname: conf.myHostname,
	    appId: conf.github.oauth.appId,
	    appSecret: conf.github.oauth.appSecret,
	    scope: 'user,public_repo,repo,gist',
	    redirectPath: '/'
        }
    }
});

mongoose.model('User', UserSchema);
mongoose.connect('mongodb://localhost/nodeboard');

User = module.exports = mongoose.model('User');
