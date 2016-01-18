(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');
	var soundcloudService, socketService;

	function searchController(_soundcloudService_, _socketService_) {
		soundcloudService = _soundcloudService_;
        socketService = _socketService_;

		this.query = "";
		this.results = null;
	}

	searchController.prototype.selectTrack = function (track) {
        socketService.emit('select-song', track);
		this.results = null;
	};

	searchController.prototype.relatedTracks = function (query) {
		if (query) {
			soundcloudService.search(query).then(tracks => {
				this.results = tracks;
			});
		} else {
			this.results = null;
		}
	};
	
	speakerQueue.controller('searchController', ['soundcloudService', 'socketService', searchController]);
}());
