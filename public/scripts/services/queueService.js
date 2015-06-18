(function () {

	var speakerQueue = angular.module('speakerQueue');

	var $q, $http;
    var socketService;

	function queueService(_$http_, _$q_, _socketService_) {
		$http = _$http_;
		$q = _$q_;
        socketService = _socketService_;
	}

	queueService.prototype.addTrack = function (track) {
		var deferred = $q.defer();
		$http.post('/api/queue', track).then(function (data) {
			deferred.resolve(data);
            if (data && data.data && data.data.inQueue) {
                socketService.emit('add-song');
            }
		}, function (error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

    queueService.prototype.getQueue = function () {
        var deferred = $q.defer();
        $http.get('/api/queue/').then(function (data) {
            deferred.resolve(data.data);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

	speakerQueue.service('queueService', queueService);

}());
