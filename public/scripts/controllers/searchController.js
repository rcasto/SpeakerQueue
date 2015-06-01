(function () {

	var speakerQueue = angular.module('speakerQueue');

	var soundcloudService, self;

	function searchController(_soundcloudService_) {
		self = this;
		soundcloudService = _soundcloudService_;

		this.query = "";
		this.results = null;
	}

	searchController.prototype.selectTrack = function (query) {
		// this must update the server and other clients in real time
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
	
	speakerQueue.controller('searchController', searchController);

}());