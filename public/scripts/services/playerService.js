(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

	var $q, $http;

	function playerService(_$http_, _$q_) {
		$http = _$http_;
		$q = _$q_;

        /* jshint validthis:true */
        this.currentTrack = null;
	}

    playerService.prototype.isPlayingTrack = function () {
        return !!this.currentTrack;
    };

    // normalize track object
    playerService.prototype.getTrackInfo = function (track) {
        return {
            id: track.id,
            title: track.title,
            description: track.description,
            stream_url: track.stream_url,
            artwork_url: track.artwork_url,
            artist: track.user.username,
            stream_location: track.stream_location
        };
    };

	speakerQueue.service('playerService', ['$http', '$q', playerService]);
}());
