var mongodb = require("mongodb"),
    options = require("../server-config.js");

var mongo = new mongodb.Server(options["mongo-host"], options["mongo-port"]),
    db = module.exports = exports = new mongodb.Db(options["mongo-database"], mongo);

db.open(function(error) {
    if (error) throw error;
});


/*
 * GET home page.
 */

exports.index = function(req, res){

    // Store

    var data = {
	timestamp: new Date().getTime(),
	headers: req.headers,
	request: {
	    url: req.url,
	    method: req.method,
	    query: req.query,
	    body: req.body
	},
	client: {
	    ip: req.client.remoteAddress,
	    port: req.client.remotePort,
	    type: req.client.type
	}
    };

    db.collection("headers", function(error, collection) {
        collection.insert(data, { safe: true }, function(error) {
            if (error) {
                console.error('somthing wrong: ', error.message);
            } else {
		console.log('success');
            }
        });
    });

    // Say

    res.render('index', {
	title: 'Headmole',
	headers: req.headers,
	ip: req.client.remoteAddress,
	port: req.client.remotePort
    });
};
