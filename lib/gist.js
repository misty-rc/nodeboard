

function Gist() {
};

/**
 * --list gists
 * GET /users/:user/gists
 * 
 * GET /gists
 * GET /gists/public
 * GET /gists/starred
 * --get a single gist
 * GET /gists/:id
 * --check if a gist starred
 * GET /gist/:id/star
 * 
 * --create a gist
 * POST /gists
 * --fork a gist
 * POST /gists/:id/fork
 * 
 * --edit a gist
 * PATCH /gists/:id
 * 
 * --start a gist
 * PUT /gists/:id/star
 * 
 * --unstart a gist
 * DELETE /gists/:id/star
 * --delete a gist
 * DELETE /gists/:id
 */

//Gist.getGist(id, callback);
//Gist.getUserGists(username, callback);

Gist.getGist = function(id, callback) {
    githubapi.get(
	'/gists/' + id,
	null,
	this.requestOptions
    );
};

Gist.getUserGists = function(user, callback) {
};


Gist.get = function(call, callback) {
    var https = require('https');
    if('user' == call) {
    } else if ('id' == call) {
    } else if ('' == call) {
    } else {
    }
};


Gist.get = function(call, args) {
};

Gist.findById = function(id) {
    this.get('id,', id);
};

Gist.post = function(user) {
};

module.exports = Gist;