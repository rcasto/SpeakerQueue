(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

	function socketDirective(socketService) {
        return {
            restrict: 'EA',
            scope: {},
            link: function (scope, elem) {
				
            }
        };
	}

	speakerQueue.directive('speakerPlayer', ['socketService', socketDirective]);
}());
