(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

	var $q, $http;

	function soundcloudService(_$http_, _$q_) {
		$http = _$http_;
		$q = _$q_;

        // Could add client config route, so this setting could reside hidden behind server
		SC.initialize({
			client_id: "9cb398fe220f1bef54d28cc3f4a8a06a"
		});
	}

	soundcloudService.prototype.search = function (query) {
		var deferred = $q.defer();
		SC.get('/tracks', {
			q: query,
			limit: 10
		}, function (tracks) {
			deferred.resolve(tracks);
		});
		return deferred.promise;
	};

	speakerQueue.service('soundcloudService', ['$http', '$q', soundcloudService]);

}());
