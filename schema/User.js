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
            myHostname: 'http://182.48.60.151:3000',
	    appId: conf.github.appId,
	    appSecret: conf.github.appSecret,
	    callbackPath: conf.github.callbackPath,
	    redirectPath: '/'
        }
    }
});

mongoose.model('User', UserSchema);
mongoose.connect('mongodb://localhost/nodeboard');

User = module.exports = mongoose.model('User');
