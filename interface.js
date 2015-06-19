;(function(){
	var interface = {
		logIn: function(){
			$('.instruct').hide();
		$('.input').hide();
		$('.visitor').show();
		$('.visitor').html('<div class="login"><p class="notReal">Please <a href="https://instagram.com/oauth/authorize/?client_id=41a6e79d271549738e3294ad7c272bcd&redirect_uri=http://fantasticole.github.io/insta/app.html&response_type=token">log in</a> with Instagram<br>to use this service.</p></div>');
		},
		noHandle: function(){
			$('.visitor').show();
			$('.container').hide();
			$('.visitor').html('<p class="notReal">Please type a username.</p>');
		},
		newSearch: function(){
			$('.visitor').html('');
			$('.nfb').html('');
			$('.nf').html('');
			$('.following').html('');
			$('.followers').html('');
			$('.container').hide();
			$('.visitor').css('background-image', 'none');
		},
		displayUser: function(pic, name, user){
			$('.visitor').show();
			$('.visitor').css('background-image', 'url(' + pic + ')');
			$('.visitor').append('<div class="overlay"><p class="real">' + name + '</p><a href="https://instagram.com/'+ user +'/">' + user + '</a></div>');
			$('.container').show();
			$('.userFollows').html(user + ' Follows:');
			$('.userFollowing').html(user + '\'s Followers:');
		},
		noUser: function(){
			$('.container').hide();
			$('.visitor').css('background-image', 'none');
			$('.visitor').html('<p class="notReal">That user does not seem to exist.</p>');
		},
		mismatch: function(arr, div){
			for (var i = 0; i < arr.length; i++){
				$(div).append('<a href="https://instagram.com/' + arr[i] +'/">' + arr[i] + '</a><br>');
			}
		}
	};
	window.interface = interface;
})();