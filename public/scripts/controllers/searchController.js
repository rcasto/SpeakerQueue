(function () {

	var speakerQueue = angular.module('speakerQueue');

	var soundcloudService, queueService, self;

	function searchController(_soundcloudService_, _queueService_) {
		self = this;
		soundcloudService = _soundcloudService_;
		queueService = _queueService_;

		this.query = "";
		this.results = null;
	}

	searchController.prototype.selectTrack = function (track) {
        if (queueService.isInQueue(track)) {
            return;
        }
		queueService.addTrack(track).then(function (track) {
            console.log('Track ' + track.title + ' added.');
		}, function () {
			console.error("failed to add track to queue");
		});
		// clear search results
		this.results = null;
	};

	searchController.prototype.relatedTracks = function (query) {
		if (query) {
			soundcloudService.search(query).then(function (tracks) {
				self.results = tracks;
			});
		} else {
			self.results = null;
		}
	};
	
	speakerQueue.controller('searchController', ['soundcloudService', 'queueService', searchController]);

}());
