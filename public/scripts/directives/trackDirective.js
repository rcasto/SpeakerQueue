(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

	function trackDirective() {
        return {
            restrict: 'EA',
            scope: {
                tracks: '=',
                trackAction: '=?',
                trackActionContext: '=?'
            },
            templateUrl: '/partial-views/track.html',
            link: function (scope) {
                scope.tracks = scope.tracks || null;
                scope.trackAction = scope.trackAction || function () { };
                // Allows user to pass in custom context to track action
                if (scope.trackActionContext) {
                    scope.trackAction = scope.trackAction.bind(scope.trackActionContext);
                }
            }
        };
	}

	speakerQueue.directive('speakerTrack', [trackDirective]);
}());
