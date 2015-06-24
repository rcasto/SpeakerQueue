(function () {

	var speakerQueue = angular.module('speakerQueue');

	var $q, $http;
    var socketService;

    var queue;

	function queueService(_$http_, _$q_, _socketService_) {
		$http = _$http_;
		$q = _$q_;
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
                socketService.emit('add-song', response.data.trackInfo);
            }
		}, function (error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

    queueService.prototype.getQueue = function () {
        var deferred = $q.defer();
        $http.get('/api/queue/').then(function (data) {
            queue = data.data;
            deferred.resolve(data.data);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    queueService.prototype.isInQueue = function (track) {
        if (queue) {
            return queue.some(function (val, i, arr) {
                return track.id === val.id;
            });
        }
        return false;
    };

	speakerQueue.service('queueService', ['$http', '$q', 'socketService', queueService]);

}());
