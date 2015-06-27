(function () {

	var speakerQueue = angular.module('speakerQueue');

    var queueService, socketService;
    var self;

	function queueController(_queueService_, _socketService_) {
        queueService = _queueService_;
        socketService = _socketService_;
        self = this;

        this.queue = queueService.getQueue();

        socketService.on('add-song', this.addTrack);
        socketService.on('remove-song', this.removeTrack);
	}

    queueController.prototype.addTrack = function (track) {
        console.log('Message: ' + track.title + ' added.');
    };

    queueController.prototype.removeTrack = function (track) {
        console.log('Message: ' + track.title + ' removed.');
    };

	speakerQueue.controller('queueController', ['queueService', 'socketService',  queueController]);

}());
