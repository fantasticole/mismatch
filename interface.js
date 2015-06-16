;(function(){
	var interface = {
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
		}
	};
	window.interface = interface;
})();