;(function(){
	var backgrounds = ['url(loading/britney.gif)','url(loading/burger.gif)','url(loading/carlton.gif)','url(loading/cheez.gif)','url(loading/drop.gif)','url(loading/kanye.gif)','url(loading/lisa.gif)','url(loading/mrt.gif)','url(loading/nintendo.gif)','url(loading/pharrell.gif)','url(loading/dino.gif)','url(loading/pika.gif)']

	function newBackground(){
		var current = Math.floor(Math.random()*backgrounds.length);
		return current;
	};
	var interface = {
		pageLoading: function(){
			$('.loadImg').css('background-image', backgrounds[newBackground()]);
			$('.instruct').hide();
			$('.input').hide();
			$('.visitor').hide();	
			$('.container').hide();
		},
		logIn: function(){
		$('.instruct').hide();
		$('.input').hide();
		$('.visitor').show();
		$('.visitor').html('<div class="login"><p class="notReal">Please <a href="/request_authorization">log in</a> with Instagram<br>to use this service.</p></div>');
		},
		noHandle: function(){
			$('.visitor').show();
			$('.container').hide();
			$('.visitor').html('<p class="notReal">Please type a username.</p>');
		},
		newSearch: function(){
			$('.loadImg').css('background-image', backgrounds[newBackground()]);
			$('.load').show();
			$('.instruct').hide();
			$('.input').hide();
			$('.visitor').hide();
			$('.visitor').html('');
			$('.container').hide();
			$('.visitor').css('background-image', 'none');
		},
		displayUser: function(pic, name, user){
			$('.load').hide();
			$('.instruct').show();
			$('.input').show();
			$('.visitor').show();
			$('.container').show();
			$('.visitor').css('background-image', 'url(' + pic + ')');
			$('.visitor').append('<div class="overlay"><p class="real">' + name + '</p><a href="https://instagram.com/'+ user +'/" target="_blank">' + user + '</a></div>');
		},
		noUser: function(){
			$('.visitor').show();
			$('.container').hide();
			$('.visitor').css('background-image', 'none');
			$('.visitor').html('<p class="notReal">That user does not seem to exist.</p>');
		},
		reciprocal: function(div, pic, user){
			$(div).append($('<div class="user">').html('<div class="followedBy"><div class="following"><hr/></div><hr/></div><div class="person"><img src=' + pic + '><a href="https://instagram.com/'+ user +'/" target="_blank">' + user + '</a></div>'));
		},
		youFollow: function(div, pic, user){
			$(div).append($('<div class="user">').html('<div class="followedBy" style="visibility:hidden"><div class="following" style="visibility:visible"><hr/></div></div><div class="personMM"><img src=' + pic + '><a href="https://instagram.com/'+ user +'/" target="_blank">' + user + '</a></div>'));
		},
		followsYou: function(div, pic, user){
			$(div).append($('<div class="user">').html('<div class="followedBy"><div class="notFollowing"></div><hr/></div><div class="personMM"><img src=' + pic + '><a href="https://instagram.com/'+ user +'/" target="_blank">' + user + '</a></div>'));
		}
	};
	window.interface = interface;
})();