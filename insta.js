// Let a user log into Instagram to get a list of their followers, who they're following and the mismatches.


var main = function(){
	var empty = [];
	var handle;
	$('.visitor').hide();
	$('.container').hide();
	$('.options').hide();
	var here = window.location.href;
	// var token = here.slice(here.indexOf('access_token=')+13);
	var token = '6962099.41a6e79.db75930f284e44c9bd967ae15251bedb';
	if (here.indexOf('redirect=true') > -1){
		window.location.href = here.slice(0, here.indexOf('#')+1);
	};


	if (here.indexOf('app') > 0 && token === undefined){
		interface.logIn();
	};

	$('.search').click(function(){
		interface.newSearch();
		$('.instruct').hide();
		handle = $('input[name=handle]').val();
		if (handle.length > 0){
			searchUser(handle);
			// Seems to search for users with similar names in your followers/following, rather than a use with that exact username.
			// 'pier' returned pierlikeadock rathen than user 'pier.'
		}
		else{
			interface.noHandle();
		}
	});

	// $('.compare').click(function(){
	// 	interface.showComparison();
	// });

	$('.uf').click(function(){
		interface.userFollows();
	});

	$('.ufb').click(function(){
		interface.userFollowedBy();
	});

	$(window).resize(function(){
		if ($(window).width() > 800){
			$('.options').hide();
			if (handle.length > 0){
				interface.resize();
			}
		}
		else {
			$('.container').hide();
			if (handle.length > 0){
				$('.options').show();
			}
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
				var users = [];
				arr.forEach(function(they){
					var person = {};
					person[they.username] = they.profile_picture;
					users.push(JSON.stringify(person));
				});
				cb(users);
			};
		});
	}

	function follows(userData, taskDone){
		var loc = "https://api.instagram.com/v1/users/" + userData.ident + "/follows?access_token=" + userData.token;
		getUsernames(loc, [], function(users){
			taskDone(userData.key, users);
		});
	};


	function followedBy(userData, taskDone){
		var loc = "https://api.instagram.com/v1/users/" + userData.ident + "/followed-by?access_token=" + userData.token;
		getUsernames(loc, [], function(users){
			taskDone(userData.key, users);
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

						dataFile.worker([{fn: follows, data: {ident: ident, token: token, key: "follows"}}, {fn: followedBy, data: {ident: ident, token: token, key: "followedBy"}}], function(results){
							var nf = dataFile.compare(results.followedBy, results.follows)
							var nfb = dataFile.compare(results.follows, results.followedBy)
							// console.log('Not following: ', nf);
							// console.log('Not followed by: ', nfb);
							display(results.follows, nfb, '.following');
							display(results.followedBy, nf, '.followers');
							// interface.mismatch(dataFile.compare(results.follows, results.followedBy), '.nfb');
							// interface.mismatch(dataFile.compare(results.followedBy, results.follows), '.nf');
						});
					}
					else{
						interface.noUser();
					}
				})
	};


	function display(arr, arrTwo, div){
		// arr is an array of strings.
		// arrTwo is an array of objects.
		var newArr = arrTwo.map(function(obj){
			return JSON.stringify(obj);
		});
		// console.log('new Arr: ', newArr);
		for (var x = 0; x < arr.length; x++){
			var current = JSON.parse(arr[x]);
			var user = Object.keys(current);
			var pic = current[user];
			if (newArr.indexOf(arr[x]) < 0){
				$(div).append($('<div class="person">').html('<img src=' + pic + '><br><a href="https://instagram.com/'+ user +'/" target="_blank">' + user + '</a>'));
			}
			else{
				$(div).prepend($('<div class="personMM">').html('<img src=' + pic + '><br><a href="https://instagram.com/'+ user +'/" target="_blank">' + user + '</a>'));
			}
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
