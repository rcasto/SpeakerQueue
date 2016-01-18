(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');
    var $http;
    var socketService;

	function roomService(_$http_, _socketService_) {
        $http = _$http_;
        socketService = _socketService_;
        
        this.currentRoom = null;
        
        // This is an ack from the server to confirm the room was joined
        socketService.on('room-state', room => {
            this.currentRoom = room;
        });
	}
    
    roomService.prototype.joinRoom = function (roomName) {
        socketService.emit('join-room', roomName);
    };
    
    roomService.prototype.getCurrentRoom = function () {
        return this.currentRoom;
    };
    
    roomService.prototype.getRooms = function (roomName = '') {
        console.log('client is getting rooms');
        
        return $http.get('/api/rooms/' + roomName).then(function (data) {
            return data && data.data;
        }, function (err) {
            console.error(JSON.stringify(err));
            return null;
        });
    };

	speakerQueue.service('roomService', ['$http', 'socketService', roomService]);    
}());