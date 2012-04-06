var mongoose = require('mongoose'),
    mongooseAuth = require('mongoose-auth'),
    conf = require('../conf.js'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;


var Achievement = new Schema({
    no: {type: Number, default: 0},
    summary: {type: String, default: null},
    description: {type: String, default: null},
    count: {type: Number, default: 0}
});

mongoose.model('Achievement', Achievement);
mongoose.connect('mongodb://localhost/nodeboard');

Achievement = module.exports = mongoose.model('Achievement');