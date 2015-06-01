(function () {

	var speakerQueue = angular.module('speakerQueue', ['ngRoute']);

	speakerQueue.config(function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'views/home.html'
		})
	});

}());