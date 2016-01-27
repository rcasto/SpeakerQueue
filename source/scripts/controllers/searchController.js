(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');
	var soundcloudService, socketService, roomService;

	function searchController(_soundcloudService_, _socketService_, _roomService_) {
		soundcloudService = _soundcloudService_;
        roomService = _roomService_;
        socketService = _socketService_;

		this.query = "";
		this.results = null;
	}

	searchController.prototype.selectTrack = function (track) {
        var room = roomService.getCurrentRoom();
        // There is the possiblity that the latest information from the server has not been received
        // There may exist a race condition among clients sending these messages
        // The last one is the winner
        if (room.player.track) {
            socketService.emit('add-song', track);
        } else {
            socketService.emit('play-song', track);
        }
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
	
	speakerQueue.controller('searchController', ['soundcloudService', 'socketService', 'roomService', searchController]);
}());
