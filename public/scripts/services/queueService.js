(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

	var $q, $http;

	function queueService(_$http_, _$q_) {
		$http = _$http_;
		$q = _$q_;

        /* jshint validthis:true */
        this.queue = [];
	}

    queueService.prototype.addTrack = function (track) {
        if (track) {
            this.queue.push(track);
            return true;
        }
        return false;
    };

	speakerQueue.service('queueService', ['$http', '$q', queueService]);

}());
