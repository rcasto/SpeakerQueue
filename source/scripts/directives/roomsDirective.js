(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

	function roomsDirective(roomService) {
        const DEFAULT_ROOM = 'default';
        return {
            restrict: 'EA',
            scope: {},
            templateUrl: '/partial-views/rooms.html',
            link: function (scope) {
                roomService.getRooms().then(function (rooms) {
                    scope.rooms = rooms || [];
                }, function (err) {
                    scope.rooms = null;
                    scope.err = err;
                });
                // Join default room to start
                roomService.joinRoom(DEFAULT_ROOM);
            }
        };
	}

	speakerQueue.directive('speakerRooms', ['roomService', roomsDirective]);
}());
