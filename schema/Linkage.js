var mongoose = require('mongoose'),
    mongooseAuth = require('mongoose-auth'),
    conf = require('../conf.js'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;

var LinkAcc = new Schema({
    module: {type:String, default:null},
    linkid: {type:String, default:null}
});


var Linkage = new Schema({
    displayName: {type:String, default: null},
    primaryService: {type:String, default:null},
    linkage: [LinkAcc],
    bio: {type:String, default: null},
    setting: {
        test1: {type:Number, default: 0},
        test2: {type:Number, default: 0}
    }
});

mongoose.model('Linkage', Linkage);
mongoose.connect('mongodb://localhost/nodeboard');

Linkage = module.exports = mongoose.model('Linkage');
