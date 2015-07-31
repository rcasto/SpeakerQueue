(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

	var soundcloudService, socketService, playerService;

	function searchController(_soundcloudService_, _socketService_, _playerService_) {
		soundcloudService = _soundcloudService_;
        socketService = _socketService_;
        playerService = _playerService_;

        /* jshint validthis:true */
		this.query = "";
		this.results = null;
	}

	searchController.prototype.selectTrack = function (track) {
        track = playerService.getTrackInfo(track);
        if (playerService.isPlayingTrack()) {
            socketService.emit('add-song', track);
        } else {
            socketService.emit('play-song', track);
        }
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
	
	speakerQueue.controller('searchController', ['soundcloudService', 'socketService', 'playerService', searchController]);
}());
