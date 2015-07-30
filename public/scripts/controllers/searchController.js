(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

	var soundcloudService, socketService;

	function searchController(_soundcloudService_, _socketService_) {
		soundcloudService = _soundcloudService_;
        socketService = _socketService_;

        /* jshint validthis:true */
		this.query = "";
		this.results = null;
	}

	searchController.prototype.selectTrack = function (track) {
        socketService.emit('add-song', track);
		this.results = null;
	};

	searchController.prototype.relatedTracks = function (query) {
		if (query) {
			soundcloudService.search(query).then(function (tracks) {
				this.results = tracks;
			}.bind(this));
		} else {
			this.results = null;
		}
	};
	
	speakerQueue.controller('searchController', ['soundcloudService', 'socketService', searchController]);

}());
