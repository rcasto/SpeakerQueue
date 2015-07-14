(function () {
    // TODO: add 'use strict' to every client side file (does it work on the server side?)
	var speakerQueue = angular.module('speakerQueue');

    var socketService;

	function playerController(_socketService_) {
        socketService = _socketService_;

        this.currentTrack = null;

        socketService.on('queue-state', function (queueInfo) {
            this.currentTrack = queueInfo.currentTrack;
        }.bind(this));
        socketService.on('play-song', this.setTrack.bind(this));
        socketService.on('end-song', this.setTrack.bind(this, null));
	}

    playerController.prototype.getCurrentTrack = function () {
        return this.currentTrack;
    };

    playerController.prototype.setTrack = function (track) {
        this.currentTrack = track;
    };

	speakerQueue.controller('playerController', ['socketService',  playerController]);

}());
