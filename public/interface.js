;(function(){
	var backgrounds = ['url(loading/britney.gif)','url(loading/burger.gif)','url(loading/carlton.gif)','url(loading/cheez.gif)','url(loading/drop.gif)','url(loading/kanye.gif)','url(loading/lisa.gif)','url(loading/mrt.gif)','url(loading/nintendo.gif)','url(loading/pharrell.gif)','url(loading/stitch.gif)','url(loading/dino.gif)','url(loading/pika.gif)']

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
			$('.options').hide();
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
			$('.options').hide();
			$('.visitor').html('<p class="notReal">Please type a username.</p>');
		},
		userFollows: function(){
			$('.uf').css({'background-color':'rgba(250, 250, 250, 0.8)', 'color':'#000'});
			$('.ufb').css({'background-color':'#000', 'color':'#00FCDB'});
			$('.container').show();
			$('.left').show();
			$('.right').hide();
		},
		userFollowedBy: function(){
			$('.ufb').css({'background-color':'rgba(250, 250, 250, 0.8)', 'color':'#000'});
			$('.uf').css({'background-color':'#000', 'color':'#00FCDB'});
			$('.container').show();
			$('.right').show();
			$('.left').hide();
		},
		newSearch: function(){
			$('.loadImg').css('background-image', backgrounds[newBackground()]);
			$('.load').show();
			$('.instruct').hide();
			$('.input').hide();
			$('.visitor').hide();
			$('.visitor').html('');
			$('.following').html('');
			$('.followers').html('');
			$('.container').hide();
			$('.options').hide();
			$('.visitor').css('background-image', 'none');
		},
		displayUser: function(pic, name, user){
			$('.load').hide();
			$('.instruct').show();
			$('.input').show();
			$('.visitor').show();
			$('.visitor').css('background-image', 'url(' + pic + ')');
			$('.visitor').append('<div class="overlay"><p class="real">' + name + '</p><a href="https://instagram.com/'+ user +'/" target="_blank">' + user + '</a></div>');
			$('.userFollows').html(user + '<br>follows:');
			$('.userFollowing').html(user + '\'s<br>followers:');
			if ($(window).width() < 800){
				$('.options').show();
				$('.ufb').removeAttr('style');
				$('.uf').removeAttr('style');
				$('.container').hide();
			}
			else{
				$('.container').show();
			}
		},
		noUser: function(){
			$('.visitor').show();
			$('.container').hide();
			$('.options').hide();
			$('.visitor').css('background-image', 'none');
			$('.visitor').html('<p class="notReal">That user does not seem to exist.</p>');
		},
		resize: function(){
			$('.container').show();
			$('.right').show();
			$('.left').show();
		}
	};
	window.interface = interface;
})();