// Find a way to scrape instagram photos based on a hashtag and download them to a folder.

// 'https://api.instagram.com/v1/media/popular?access_token=youraccesstoken'
// 'http://localhost/#access_token=6962099.41a6e79.db75930f284e44c9bd967ae15251bedb'



var main = function(){
	var empty = [];
	$('.visitor').hide();

	$('.auth').click(function(){
		var handle = $('input[name=handle]').val();
		// window.open("https://instagram.com/oauth/authorize/?client_id=41a6e79d271549738e3294ad7c272bcd&redirect_uri=http://fantasticole.github.io/insta/&response_type=token", '_blank');
		// window.open("https://instagram.com/oauth/authorize/?client_id=41a6e79d271549738e3294ad7c272bcd&redirect_uri=http://fantasticole.github.io/insta/&response_type=code", '_blank');
		console.log('HANDLE: ', handle);
		console.log(window.location.href);
	});

	$('.search').click(function(){
		var handle = $('input[name=handle]').val();
		if (handle.length > 0){
			people('https://api.instagram.com/v1/users/search?access_token=6962099.41a6e79.db75930f284e44c9bd967ae15251bedb&q=' + handle + '&count=1').done(function(data){
				var result = data.data;
				// if (result)
				// console.log('user: ', result[0]);
				// {username: "colemurphy",
				// profile_picture: "https://instagramimages-a.akamaihd.net/profiles/profile_6962099_75sq_1354996876.jpg",
				// id: "6962099",
				// full_name: "Cole Murphy"}
				var pic = result[0].profile_picture;
				var name = result[0].full_name;
				var user = result[0].username;
				// console.log('info: ', pic, name, user);
				$('.visitor').show();
				$('.visitor').append('<br><br><img src=' + pic + '><br><p>' + name + '</p><a href="https://instagram.com/'+ user +'/">' + user + '</a>');
			})
		}
		else{
			console.log('Please type a username.');
		}
	});

	// $('.token').click(function(){
	// 	var here = window.location.href;
	// 	var toke = here.slice(here.indexOf('access_token=')+13);
	// 	console.log(toke);
	// });


	function display(arr, div){
		for (var x = 0; x < arr.length; x++){
			var pic = arr[x].profile_picture;
			var user = arr[x].username;
			// $('.following').append($('<img src=' + list[x].profile_picture + '>'));
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
		$('.info').append('<p class="category">Not Following You:</p>');
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
		$('.info').append('<p class="category">You Don\'t Follow:</p>');
		for (var i = 0; i < notFollowing.length; i++){
			// $('.info').append($('<p class="notFollowing">').html(notFollowing[i]));
			$('.info').append('<a href="https://instagram.com/' + notFollowing[i] +'/">' + notFollowing[i] + '</a><br>');
		}
	};


	makeArr("https://api.instagram.com/v1/users/6962099/follows?access_token=6962099.41a6e79.db75930f284e44c9bd967ae15251bedb", empty, '.following');

	makeArr("https://api.instagram.com/v1/users/6962099/followed-by?access_token=6962099.41a6e79.db75930f284e44c9bd967ae15251bedb", empty, '.followers');

	usernames("https://api.instagram.com/v1/users/6962099/follows?access_token=6962099.41a6e79.db75930f284e44c9bd967ae15251bedb", "https://api.instagram.com/v1/users/6962099/followed-by?access_token=6962099.41a6e79.db75930f284e44c9bd967ae15251bedb", empty)
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
