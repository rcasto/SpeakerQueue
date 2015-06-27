(function () {

    /*
        New model is that the client will only grab the queue once and only once upon initial load.  The queue will be cached then.
        Will need an expiration on refreshing the queue from the server.

        It will be updated upon messages from the server as to when a client has added a track and when a track has ended on the server
    */

	var speakerQueue = angular.module('speakerQueue');

	var $q, $http;

	function queueService(_$http_, _$q_) {
		$http = _$http_;
		$q = _$q_;
	}

	queueService.prototype.addTrack = function (track) {
		var deferred = $q.defer();
		$http.post('/api/queue', track).then(function (response) {
            if (response.data.error) {
                deferred.reject(response.data);
            } else {
                deferred.resolve(response.data);
            }
		}, function (error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

    queueService.prototype.getQueue = function () {
        var deferred = $q.defer();
        // TODO: make sure this request gets cached.
        $http.get('/api/queue/').then(function (data) {
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

	speakerQueue.service('queueService', ['$http', '$q', queueService]);

}());
