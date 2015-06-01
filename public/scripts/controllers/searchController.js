(function () {

	var speakerQueue = angular.module('speakerQueue');

	function searchController() {
		this.query = "";
		this.findTrack = findTrack;

	}

	function findTrack(query) {
		SC.get('/tracks', {
			q: query
		}, function (tracks) {
			console.dir(tracks);
		});
	};
	
	speakerQueue.controller('searchController', searchController);

}());