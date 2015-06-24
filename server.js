var express = require('express');
var app = express();
var https = require('https');
var querystring = require('querystring');
var config = require('./config');

function getOverHTTPS(hostname, path, cb){
	var options = {
		hostname: hostname,
		port: 443,
		path: path,
		method: 'GET'
	};

	var req = https.request(options, function(res) {
		var body = '';

		res.on('data', function(d) {
			body += d;
		});

		res.on('end', function() {
			// Pass information about the response.
			// Can't call return, need to pass a function.
			cb(null, res, body);
		});
	});

	req.end();

	req.on('error', function(e) {
		cb(e)
	});
};

function postOverHTTPS(hostname, path, params, cb){
	var postData = querystring.stringify(params);

	var options = {
		hostname: hostname,
		port: 443,
		path: path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		}
	};

	var req = https.request(options, function(res) {
		var body = '';

		res.on('data', function(d) {
			body += d;
		});

		res.on('end', function() {
			// Pass information about the response.
			// Can't call return, need to pass a function.
			cb(null, res, body);
		});
	});

	req.write(postData);
	req.end();

	req.on('error', function(e) {
		cb(e)
	});
};

function authorizeWithInstagram(userCode, cb){
	var params = {'client_id' : config.instagram.client_id,
		'client_secret' : config.instagram.client_secret,
		'grant_type' : 'authorization_code',
		'redirect_uri' : 'http://localhost:3000/authorize',
		'code' : userCode
	};

	postOverHTTPS('api.instagram.com', '/oauth/access_token', params, function(err, res, body){
		if (err){
			return cb(err);
		}
		var data = JSON.parse(body);
		var token = data.access_token;
		cb(null, token, data.user);
	});
};

app.use(express.static('public'));

var user;
var userToken;

app.get('/authorize', function (req, res) {
	var userCode = req.query.code;
	authorizeWithInstagram(userCode, function(err, token, userData){
		user = userData;
		userToken = token;
		console.log(err, token, userData);
		res.redirect('app.html');
		// res.send('Hello World!');
	});
});

app.get('/user/:name', function (req, res) {
	var name = req.params.name;
	console.log('name: ', name);
	getOverHTTPS('api.instagram.com', '/v1/users/search?access_token=' + userToken + '&q=' + name + '&count=1', function(err, response, body){
		var data = JSON.parse(body);
		console.log('getting HTTP!!');
		console.log(data);
		res.send(data.data[0]);
	});
});

var server = app.listen(3000, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});

console.log('Hello from the server!!');





