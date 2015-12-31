(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue', ['ngRoute']);
    
    speakerQueue.factory('config', function () {
        return speakerQueueConfig;
    });

	speakerQueue.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'views/home.html'
		})
	}]);
	
}());