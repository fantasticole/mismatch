// Let a user log into Instagram to get a list of their followers, who they're following and the mismatches.


var main = function(){
	var empty = [];
	$('.visitor').hide();
	$('.container').hide();
	$('.options').hide();
	var here = window.location.href;
	var handle = here.slice(here.indexOf('=')+1);
	$(searchUser(handle))


	if (here.indexOf('app') > 0 && handle === undefined){
		interface.logIn();
	};

	$('.search').click(function(){
		interface.newSearch();
		$('.instruct').hide();
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

	$('input').keyup(function(event){
	 	if(event.keyCode == 13){
	    	$('.search').click();
		}
	});

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

	function searchUser(name){
		people('/user/' + name).done(function(data){
			if (data){
				var pic = data.profile_picture;
				var name = data.full_name;
				var user = data.username;
				var ident = data.id;
				interface.displayUser(pic, name, user);

				dataFile.setReciprocation(data.follows, data.followers);

				display(data.follows, '.following');

				display(data.followers, '.followers');
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



