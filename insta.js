// Find a way to scrape instagram photos based on a hashtag and download them to a folder.

// 'https://api.instagram.com/v1/media/popular?access_token=youraccesstoken'
// 'http://localhost/#access_token=6962099.41a6e79.db75930f284e44c9bd967ae15251bedb'



var main = function(){
	var empty = [];

	function display(arr, div){
		for (var x = 0; x < arr.length; x++){
			var pic = arr[x].profile_picture;
			var user = arr[x].username;
			// $('.cole').append($('<img src=' + list[x].profile_picture + '>'));
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

	// a function that takes two links
	// the first part runs over the data until it gets a full array of usernames
	// the second part takes that array as a parameter as well as the second link
	// the second part runs over the second link until it gets a full list
	// at that point it compares the two arrays and returns two new arrays
	// one array is a list of the people you follow who don't follow you back
	// the other array is a list of people who follow you that you don't follow back


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
				// console.log('first: ', names);
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
				// console.log('second: ', followers);
				compare(following, followers);
			};
		});
	};

	function compare(oneArr, twoArr){
		// console.log('following: ', oneArr);
		// console.log('followers: ', twoArr);
		var notFollowing = [];
		var notFollowed = [];
		for (var x = 0; x < oneArr.length; x++){
			if (twoArr.indexOf(oneArr[x]) === -1){
				notFollowed.push(oneArr[x]);
			}
		}
		for (var i = 0; i < notFollowed.length; i++){
			// $('.info').append($('<p class="notFollowed">').html(notFollowed[i]));
			$('.info').append('<a href="https://instagram.com/' + notFollowed[i] +'/">' + notFollowed[i] + '</a><br>');
		}
		// console.log('Not followed by: ', notFollowed);
		for (var x = 0; x < twoArr.length; x++){
			if (oneArr.indexOf(twoArr[x]) === -1){
				notFollowing.push(twoArr[x]);
			}
		}
		// console.log('Not following: ', notFollowing);
		for (var i = 0; i < notFollowing.length; i++){
			// $('.info').append($('<p class="notFollowing">').html(notFollowing[i]));
			$('.info').append('<a href="https://instagram.com/' + notFollowing[i] +'/">' + notFollowing[i] + '</a><br>');
		}
	};

	function photos(loc, num, div){
		people(loc).done(function(data){
			for (var i = 0; i < num; i++) {
		      $(div).append("<li><a target='_blank' href='" + data.data[i].link + "'><img src='" + data.data[i].images.low_resolution.url +"'></img></a></li>");
		    }
		});
	};


	makeArr("https://api.instagram.com/v1/users/6962099/follows?access_token=6962099.41a6e79.db75930f284e44c9bd967ae15251bedb", empty, '.cole');

	makeArr("https://api.instagram.com/v1/users/6962099/followed-by?access_token=6962099.41a6e79.db75930f284e44c9bd967ae15251bedb", empty, '.followers');

	usernames("https://api.instagram.com/v1/users/6962099/follows?access_token=6962099.41a6e79.db75930f284e44c9bd967ae15251bedb", "https://api.instagram.com/v1/users/6962099/followed-by?access_token=6962099.41a6e79.db75930f284e44c9bd967ae15251bedb", empty)

	// photos("https://api.instagram.com/v1/media/popular?access_token=6962099.41a6e79.db75930f284e44c9bd967ae15251bedb", 10, '.popular');
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
