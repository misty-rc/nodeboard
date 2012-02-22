var Entry = require('../schema/entry.js');

exports.index = function(req, res) {
    res.render('index', { title: 'Express' });
};

exports.view = function(req, res) {
    Entry.find({}, function(err, entries) {
	res.render('index', {
	    entries: entries
	});
    });
};

exports.edit = function(req, res) {
    
};

exports.update = function(req, res) {
    //TODO: findById -> modified -> save
};

exports.post = function(req, res) {
    
};

exports.insert = function(req, res) {

};
