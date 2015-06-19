// Let a user log into Instagram to get a list of their followers, who they're following and the mismatches.


var main = function(){
	var empty = [];
	$('.visitor').hide();
	$('.container').hide();
	var here = window.location.href;
	var token = here.slice(here.indexOf('access_token=')+13);
	if (here.indexOf('redirect=true') > -1){
		window.location.href = 'http://fantasticole.github.io/insta/app.html#';
	};


	if (here.indexOf('app') > 0 && token === undefined){
		interface.logIn();
	};

	$('.search').click(function(){
		interface.newSearch();
		$('.instruct').hide();
		var handle = $('input[name=handle]').val();
		if (handle.length > 0){
			searchUser(handle);
			// Seems to search for users with similar names in your followers/following, rather than a use with that exact username.
			// 'pier' returned pierlikeadock rathen than user 'pier.'
		}
		else{
			interface.noHandle();
		}
	});


	function getUsernames(loc, arr, cb){
		people(loc).done(function(data){
			arr = arr.concat(data.data);
			if (data.pagination.next_url){
				var newLoc = data.pagination.next_url;
				getUsernames(newLoc, arr, cb)
			}
			else {
				var names = arr.map(function(they){
					return they.username;
				});
				cb(names);
			};
		});
	}

	function follows(userData, taskDone){
		var loc = "https://api.instagram.com/v1/users/" + userData.ident + "/follows?access_token=" + userData.token;
		getUsernames(loc, [], function(names){
			taskDone(userData.key, names);
		});
	};


	function followedBy(userData, taskDone){
		var loc = "https://api.instagram.com/v1/users/" + userData.ident + "/followed-by?access_token=" + userData.token;
		getUsernames(loc, [], function(names){
			taskDone(userData.key, names);
		});
	};

	function searchUser(name){
		people('https://api.instagram.com/v1/users/search?access_token=' + token + '&q=' + name + '&count=1').done(function(data){
					var result = data.data;
					if (result[0]){
						var pic = result[0].profile_picture;
						var name = result[0].full_name;
						var user = result[0].username;
						var ident = result[0].id;
						interface.displayUser(pic, name, user);
						makeArr("https://api.instagram.com/v1/users/" + ident + "/follows?access_token=" + token, empty, '.following');

						makeArr("https://api.instagram.com/v1/users/" + ident + "/followed-by?access_token=" + token, empty, '.followers');

						dataFile.worker([{fn: follows, data: {ident: ident, token: token, key: "follows"}}, {fn: followedBy, data: {ident: ident, token: token, key: "followedBy"}}], function(results){
							dataFile.compare(results.follows, results.followedBy);
							interface.mismatch(dataFile.compare(results.follows, results.followedBy), '.nfb');
							interface.mismatch(dataFile.compare(results.followedBy, results.follows), '.nf');
						});
					}
					else{
						interface.noUser();
					}
				})
	};


	function display(arr, div){
		for (var x = 0; x < arr.length; x++){
			var pic = arr[x].profile_picture;
			var user = arr[x].username;
			$(div).append($('<div class="person">').html('<img src=' + pic + '><br><a href="https://instagram.com/'+ user +'/">' + user + '</a>'));
		}
	};

	function people(loc){
		return $.ajax({
			type: "GET",
			dataType: "jsonp",
			cache: false,
			url: loc,
		})
	};

	function makeArr(loc, arr, div){
		people(loc).done(function(data){
			list = arr.concat(data.data);
			if (data.pagination.next_url){
				var newLoc = data.pagination.next_url;
				makeArr(newLoc, list, div)
			}
			else {
				var final = list;
				display(final, div);
			};
		});
	};

	
};




$(document).ready(main);








// // HTTP Codes:
// // 	GET: retrieves information from the specified source (you just saw this one!)
// // 	POST: sends new information to the specified source.
// // 	PUT: updates existing information of the specified source.
// // 	DELETE: removes existing information from the specified source.

// var http = require('http');
// var args = process.argv;
// var url = args[2];

// // console.log(url);

// function works(site){
// 	http.get(site, function(res){
// 		res.setEncoding('utf8');
// 		res.on('data', function(){
// 			console.log('erger!!!!');
// 		});
// 		// res.on('data', console.log('erger!!!!')); DOES NOT WORK
// 		}).on('error', console.error);
// };

// if(url.indexOf('http') < 0){
// 	url = 'http://' + url;
// 	works(url);
// }
// else {
// 	works(url);
// };

// // http.get(url, function(res){
// // 	res.setEncoding('utf8');
// // 	res.on('data', console.log);
// // 	}).on('error', console.error);
