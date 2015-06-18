// Let a user log into Instagram to get a list of their followers, who they're following and the mismatches.


var main = function(){
	var empty = [];
	$('.visitor').hide();
	$('.container').hide();
	var here = window.location.href;
	// var token = here.slice(here.indexOf('access_token=')+13);
	var token = '6962099.41a6e79.db75930f284e44c9bd967ae15251bedb';


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

						usernames("https://api.instagram.com/v1/users/" + ident + "/follows?access_token=" + token, "https://api.instagram.com/v1/users/" + ident + "/followed-by?access_token=" + token, empty)
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

	function usernames(loc, locTwo, arr){
		people(loc).done(function(data){
			var users = arr.concat(data.data);
			if (data.pagination.next_url){
				var newLoc = data.pagination.next_url;
				usernames(newLoc, locTwo, users)
			}
			else {
				var names = users.map(function(they){
					return they.username;
				});
				bridge(locTwo, names, empty)
			};
		});
	};

	function bridge(loc, following, arr){
		people(loc).done(function(data){
			var users = arr.concat(data.data);
			if (data.pagination.next_url){
				var newLoc = data.pagination.next_url;
				bridge(newLoc, following, users)
			}
			else {
				var followers = users.map(function(they){
					return they.username;
				});
				compare(following, followers);
			};
		});
	};

	function compare(oneArr, twoArr){
		var notFollowing = [];
		var notFollowed = [];
		for (var x = 0; x < oneArr.length; x++){
			if (twoArr.indexOf(oneArr[x]) === -1){
				notFollowed.push(oneArr[x]);
			}
		}
		for (var i = 0; i < notFollowed.length; i++){
			$('.nfb').append('<a href="https://instagram.com/' + notFollowed[i] +'/">' + notFollowed[i] + '</a><br>');
		}
		for (var x = 0; x < twoArr.length; x++){
			if (oneArr.indexOf(twoArr[x]) === -1){
				notFollowing.push(twoArr[x]);
			}
		}
		for (var i = 0; i < notFollowing.length; i++){
			$('.nf').append('<a href="https://instagram.com/' + notFollowing[i] +'/">' + notFollowing[i] + '</a><br>');
		}
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
