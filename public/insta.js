// Let a user log into Instagram to get a list of their followers, who they're following and the mismatches.


var main = function(){
	var empty = [];
	interface.pageLoading();
	var here = window.location.href;
	var handle = here.slice(here.indexOf('=')+1);
	$(searchUser(handle));


	if (here.indexOf('app') > 0 && handle === undefined){
		interface.logIn();
	};

	$('.search').click(function(){
		interface.newSearch();
		handle = $('input[name=handle]').val();
		if (handle.length > 0){
			searchUser(handle);
			// Seems to search for users with similar names in your followers/following, rather than a use with that exact username.
			// 'pier' returned pierlikeadock rather than user 'pier.'
		}
		else{
			interface.noHandle();
		}
	});

	$('.logout').click(function(){
		people('/logout');
	})

	$('input').keyup(function(event){
	 	if(event.keyCode == 13){
	    	$('.search').click();
		}
	});

	function sortByUsername(a, b){
		if (a.username < b.username)
			return -1;
		if (a.username > b.username)
			return 1;
		return 0;
	}

	function oneOrderedArray(arr, arrTwo){
		for (var x = 0; x < arrTwo.length; x++){
			if (arrTwo[x].reciprocate === false){
				arr.push(arrTwo[x]);
			}
		}
		return arr.sort(sortByUsername);
	};

	function searchUser(name){
		people('/user/' + name).done(function(data){
			if (data){
				var pic = data.profile_picture;
				var name = data.full_name;
				var user = data.username;
				var ident = data.id;
				interface.displayUser(pic, name, user);

				dataFile.setReciprocation(data.follows, data.followers);

				var all = oneOrderedArray(data.follows, data.followers);

				console.log(all);
				display(all, '.friends');
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
			if (arr[x].reciprocate === true){
				$(div).append($('<div class="person">').html('<img src=' + pic + '><a href="https://instagram.com/'+ user +'/" target="_blank">' + user + '</a>'));
			}
			else{
				$(div).prepend($('<div class="personMM">').html('<img src=' + pic + '><a href="https://instagram.com/'+ user +'/" target="_blank">' + user + '</a>'));
			}
		}
	};

	function people(loc){
		return $.ajax({
			type: "GET",
			dataType: "json",
			cache: false,
			url: loc,
		})
	};
	
};




$(document).ready(main);



