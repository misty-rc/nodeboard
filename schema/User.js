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
            }
        }
    },
    github: {
        everyauth: {
	    myHostname: conf.github.myHostname,
	    appId: conf.github.oauth.appId,
	    appSecret: conf.github.oauth.appSecret,
	    scope: 'user,public_repo,repo,gist',
	    callbackPath: conf.github.oauth.callbackPath,
	    redirectPath: '/'
        }
    }
});

mongoose.model('User', UserSchema);
mongoose.connect('mongodb://localhost/nodeboard');

User = module.exports = mongoose.model('User');
