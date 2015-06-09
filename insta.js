// Find a way to scrape instagram photos based on a hashtag and download them to a folder.

// HTTP Codes:
// 	GET: retrieves information from the specified source (you just saw this one!)
// 	POST: sends new information to the specified source.
// 	PUT: updates existing information of the specified source.
// 	DELETE: removes existing information from the specified source.

var http = require('http');
var args = process.argv;
var url = args[2];

// console.log(url);

function works(site){
	http.get(site, function(res){
		res.setEncoding('utf8');
		res.on('data', function(){
			console.log('erger!!!!');
		});
		// res.on('data', console.log('erger!!!!')); DOES NOT WORK
		}).on('error', console.error);
};

if(url.indexOf('http') < 0){
	url = 'http://' + url;
	works(url);
}
else {
	works(url);
};

// http.get(url, function(res){
// 	res.setEncoding('utf8');
// 	res.on('data', console.log);
// 	}).on('error', console.error);
