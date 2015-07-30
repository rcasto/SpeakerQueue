(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

	var $q, $http;

	function playerService(_$http_, _$q_) {
		$http = _$http_;
		$q = _$q_;

        /* jshint validthis:true */
        this.queue = [];
	}

    playerService.prototype.addTrack = function (track) {
        if (track) {
            this.queue.push(track);
            return true;
        }
        return false;
    };

	speakerQueue.service('playerService', ['$http', '$q', playerService]);
}());
