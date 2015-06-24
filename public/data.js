;(function(){
	 var dataFile = {
		worker: function(tasks, allTasksDone) {
		  var results = {};
		  function aTaskDone(key, result) {
		    results[key] = result;
		    if (Object.keys(results).length === tasks.length) {
		      allTasksDone(results);
		    }
		  };

		  for (var i = 0; i < tasks.length; i++) {
		    tasks[i].fn(tasks[i].data, aTaskDone);
		  }
		},

		compare: function(oneArr, twoArr){
			var list = [];
			for (var x = 0; x < oneArr.length; x++){
				if (twoArr.indexOf(oneArr[x]) === -1){
					list.push(oneArr[x]);
				}
			}
			return list;
		},

	 	getFollowers: function(token, ident){
	 		makeArr("https://api.instagram.com/v1/users/" + ident + "/follows?access_token=" + token, [], '.following');
	 	}
	 };
	 window.dataFile = dataFile;
})();

