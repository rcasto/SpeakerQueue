(function () {

	var speakerQueue = angular.module('speakerQueue');

	var $http, queueService, self;

	function queueController(_queueService_) {
        queueService = _queueService_;
        self = this;

        this.queue = [];

        this.updateQueue();
	}

    queueController.prototype.updateQueue = function () {
        queueService.getQueue().then(function (data) {
            self.queue = data;
        }, function (error) {
            console.error(error);
        });
    };

	speakerQueue.controller('queueController', queueController);

}());
