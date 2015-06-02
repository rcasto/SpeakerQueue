(function () {

	var speakerQueue = angular.module('speakerQueue');

	var $q, $http;

	function queueService(_$http_, _$q_) {
		$http = _$http_;
		$q = _$q_;
	}

	queueService.prototype.addTrack = function (track) {
		var deferred = $q.defer();
		$http.post('/api/queue', track).then(function (data) {
			deferred.resolve(data);
		}, function (error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	speakerQueue.service('queueService', queueService);

}());