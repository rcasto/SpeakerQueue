(function () {

	var speakerQueue = angular.module('speakerQueue', ['ngRoute']);

	speakerQueue.config(function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'views/home.html'
		})
	});

	speakerQueue.run(function () {

		SC.initialize({
			client_id: "9cb398fe220f1bef54d28cc3f4a8a06a"
		});

	});

}());