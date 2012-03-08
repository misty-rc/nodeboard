var mongoose = require('mongoose'),
    mongooseAuth = require('mongoose-auth'),
    conf = require('../conf.js'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;


var Achievement = new Schema({
    
});

mongoose.model('Achievement', Achievement);
mongoose.connect('mongodb://localhost/nodeboard');

Achievement = module.exports = mongoose.model('Achievement');