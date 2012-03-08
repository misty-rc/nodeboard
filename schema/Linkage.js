var mongoose = require('mongoose'),
    mongooseAuth = require('mongoose-auth'),
    conf = require('../conf.js'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;

var LinkAccountSchema = new Schema({
    serviceType: {type:String, default:null},
    linkid: {type:ObjectId, default:null}
});

var Linkage = new Schema({
    accountId: {type: String, default: null},
    password: {type: String, default: null},
    email: {type: String, default: null},
    displayName: {type:String, default: null},
    primaryService: {type:String, default:null},
    linkage: [LinkAccountSchema],
    bio: {type:String, default: null},
    setting: {
        test1: {type:Number, default: 0},
        test2: {type:Number, default: 0}
    }
});

mongoose.model('Linkage', Linkage);
mongoose.connect('mongodb://localhost/nodeboard');

Linkage = module.exports = mongoose.model('Linkage');
