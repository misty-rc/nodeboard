var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;

//comment schema
var Comment = new Schema({
    body: String,
    created_at: Date
});

//Entry schema
var Entry = new Schema({
    name: {type: String, index: true},
    doctype: Number,
    body: String,
    comments: [Comment],
    created_at: Date
});

mongoose.model('Entry', Entry);
mongoose.connect('mongodb://localhost/nodeboard');

Entry = module.exports = mongoose.model('Entry');
