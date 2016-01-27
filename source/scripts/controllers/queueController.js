(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

    var socketService;

	function queueController(_socketService_) {
        socketService = _socketService_;
        
        this.queue = [];

        socketService.on('room-state', roomInfo => {
            this.updateQueue(roomInfo.queue);
        });
	}

    queueController.prototype.addTrack = function (track) {
        this.queue.push(track);
    };

    queueController.prototype.removeTrack = function (track) {
        for (var i = 0; i < this.queue.length; i++) {
            if (track.id === this.queue[i].id) {
                this.queue.splice(i, 1);
            }
        }
    };

    queueController.prototype.updateQueue = function (tracks) {
        this.queue = tracks;
    };

	speakerQueue.controller('queueController', ['socketService',  queueController]);
}());