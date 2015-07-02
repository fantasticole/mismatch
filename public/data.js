;(function(){
	 var dataFile = {
	 	setReciprocation: function(arr, arrTwo){
	 		function contains(item, array){
	 			for (var i = 0; i < array.length; i++){
	 				if (item.username === array[i].username){
	 					return true;
	 				}
	 			}
	 			return false;
	 		};

	 		arr.forEach(function(person){
	 			person.reciprocate = contains(person, arrTwo);
	 		});

	 		arrTwo.forEach(function(person){
	 			person.reciprocate = contains(person, arr);
	 		});
	 	}
	 };
	 window.dataFile = dataFile;
})();