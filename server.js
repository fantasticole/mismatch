var express = require('express');
var https = require('https');
var querystring = require('querystring');
var crypto = require('crypto');
var cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser());

var clientId = process.env.INSTAGRAM_CLIENT_ID;
var clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
var sessionSecret = process.env.INSTAGRAM_SESSION_SECRET;
var encryptionKey = process.env.INSTAGRAM_ENCRYPTION_KEY;
var port = process.env.PORT;
var url = process.env.BASE_URL;

function encrypt(text){
  var cipher = crypto.createCipher('aes-256-cbc', encryptionKey)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher('aes-256-cbc', encryptionKey)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

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
	var params = {'client_id' : clientId,
		'client_secret' : clientSecret,
		'grant_type' : 'authorization_code',
		'redirect_uri' : url + '/authorize',
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

app.get('/request_authorization', function(req, res){
	res.redirect('https://instagram.com/oauth/authorize/?client_id=' + clientId + '&redirect_uri=' + url + '/authorize&response_type=code');
});

app.get('/authorize', function (req, res) {
	var userCode = req.query.code;
	authorizeWithInstagram(userCode, function(err, token, userData){
		res.cookie('mismatch', encrypt(token));
		res.redirect('app.html?user=' + userData.username);
	});
});

function makeArr(hostname, path, arr, cb){
	getOverHTTPS(hostname, path, function(err, response, body){
		if (err){
			return cb(err);
		}
		var data = JSON.parse(body);
		list = arr.concat(data.data);
		if (data.pagination.next_url){
			var newLoc = data.pagination.next_url.replace('https://api.instagram.com', '');
			makeArr(hostname, newLoc, list, cb)
		}
		else {
			cb(null, list);
		};
	});
};

app.get('/user/:name', function (req, res) {
	var userToken = decrypt(req.cookies.mismatch);
	var name = req.params.name;
	getOverHTTPS('api.instagram.com', '/v1/users/search?access_token=' + userToken + '&q=' + name + '&count=1', function(err, response, body){
		var data = JSON.parse(body);
		var user = data.data[0];
		var cb = function(){
			if (user['follows'] !== undefined && user['followers'] !== undefined){
				res.send(user);
			}
		};
		makeArr('api.instagram.com', '/v1/users/' + user.id + '/follows?access_token=' + userToken, [], function(err, arr){
			user['follows'] = arr;
			cb();
		})
		makeArr('api.instagram.com', '/v1/users/' + user.id + '/followed-by?access_token=' + userToken, [], function(err, arrTwo){
			user['followers'] = arrTwo;
			cb();
		})
	});
});

app.get('/logout', function(req, res){
	console.log('req: ', req.cookies.mismatch);
	res.clearCookie('mismatch');
	res.redirect('/');
	console.log('new req: ', req.cookies.mismatch);
})

var server = app.listen(port, function () {

	var host = server.address().address;
	var port = server.address().port;

});




