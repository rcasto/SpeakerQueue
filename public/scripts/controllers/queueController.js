(function () {
    // TODO: add 'use strict' to every client side file (does it work on the server side?)
	var speakerQueue = angular.module('speakerQueue');

    var socketService;

	function queueController(_socketService_) {
        socketService = _socketService_;

        this.queue = [];

        socketService.on('queue-state', this.updateQueue.bind(this));
        socketService.on('add-song', this.addTrack.bind(this));
        socketService.on('remove-song', this.removeTrack.bind(this));
	}

    queueController.prototype.addTrack = function (track) {
        this.queue.push(track);
    };

    queueController.prototype.removeTrack = function (track) {
        console.log('Message: ' + track.title + ' removed.');
    };

    queueController.prototype.updateQueue = function (tracks) {
        this.queue = tracks;
    };

	speakerQueue.controller('queueController', ['socketService',  queueController]);

}());
