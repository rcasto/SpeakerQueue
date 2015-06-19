(function () {

	var speakerQueue = angular.module('speakerQueue');

	var $q, $http, $rootScope;
    var socketService;

	function queueService(_$http_, _$q_, _$rootScope_, _socketService_) {
		$http = _$http_;
		$q = _$q_;
        $rootScope = _$rootScope_;
        socketService = _socketService_;
	}

	queueService.prototype.addTrack = function (track) {
		var deferred = $q.defer();
		$http.post('/api/queue', track).then(function (response) {
            if (response.data.error) {
                deferred.reject(response.data);
            } else {
                deferred.resolve(response.data);
            }
            if (response.data.inQueue) {
                socketService.emit('add-song');
                $rootScope.$broadcast('TrackAdded', response.data.trackInfo);
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
