(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue', ['ngRoute']);

	speakerQueue.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'views/home.html'
		})
	}]);

}());
