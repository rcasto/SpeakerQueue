(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');
    var $http;
    var socketService;

	function roomService(_$http_, _socketService_) {
        $http = _$http_;
        socketService = _socketService_;
        
        this.getRooms();
	}
    
    roomService.prototype.joinRoom = function (roomName) {
    };
    
    roomService.prototype.getRooms = function (roomName) {
        console.log('client is getting rooms');
       
        return $http.get('/api/rooms/').then(function (data) {
            return data && data.data;
        }, function (err) {
            console.error(JSON.stringify(err));
            return null;
        });
    };

	speakerQueue.service('roomService', ['$http', 'socketService', roomService]);    
}());