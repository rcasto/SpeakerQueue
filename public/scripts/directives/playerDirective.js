(function () {
    // TODO: add 'use strict' to every client side file (does it work on the server side?)
	var speakerQueue = angular.module('speakerQueue');

	function playerDirective() {
        return {
            restrict: 'EA',
            scope: {},
            controller: 'playerController',
            controllerAs: 'player',
            templateUrl: '/partial-views/player.html'
        };
	}

	speakerQueue.directive('speakerPlayer', [playerDirective]);

}());
