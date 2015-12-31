(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');
	var $q;

	function soundcloudService(_$q_, config) {
		$q = _$q_;

        // Could add client config route, so this setting could reside hidden behind server
		SC.initialize({
			client_id: config.clientId
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

	speakerQueue.service('soundcloudService', ['$q', 'config', soundcloudService]);
}());
