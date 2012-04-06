var Entry = require('../schema/Entry.js');

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

// render twitter achivement
exports.twitter = function(req, res) {
    // created at date
    console.log(req.user.twit.createdAt.toString());
    // favourite
    console.log(req.user.twit.favouritesCount.toString());
    // follower
    console.log(req.user.twit.followersCount.toString());
    // follow
    console.log(req.user.twit.friendsCount.toString());
    // status
    console.log(req.user.twit.statusesCount.toString());

    res.render('index', {title: 'twitter'});
//    res.render('twitter', {});
};

// render facebook achivement
exports.facebook = function(req, res) {
    res.render('facebook', {});
};

// render github achivement
exports.github = function(req, res) {
    
    res.render('github', {});
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
