(function () {

	var speakerQueue = angular.module('speakerQueue');

    var queueService, socketService;
    var self;

	function queueController(_queueService_, _socketService_) {
        queueService = _queueService_;
        socketService = _socketService_;

        self = this;

        this.updateQueue();
        socketService.on('add-song', this.updateQueue);
	}

    queueController.prototype.updateQueue = function () {
        queueService.getQueue().then(function (data) {
            self.queue = data;
        }, function (error) {
            console.error(error);
        });
    };

	speakerQueue.controller('queueController', ['queueService', 'socketService',  queueController]);

}());
