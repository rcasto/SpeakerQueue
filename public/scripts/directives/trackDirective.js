(function () {
    // TODO: add 'use strict' to every client side file (does it work on the server side?)
	var speakerQueue = angular.module('speakerQueue');

	function trackDirective() {
        return {
            restrict: 'EA',
            scope: {
                tracks: '=',
                trackAction: '=',
                trackActionContext: '='
            },
            controller: 'trackController',
            controllerAs: 'trackr',
            bindToController: true,
            templateUrl: '/partial-views/track.html'
        };
	}

	speakerQueue.directive('speakerTrack', [trackDirective]);

}());
