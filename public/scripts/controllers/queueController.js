(function () {

	var speakerQueue = angular.module('speakerQueue');

	var $scope;
    var queueService, socketService;

	function queueController(_queueService_, _socketService_, _$scope_) {
        $scope = _$scope_;
        queueService = _queueService_;
        socketService = _socketService_;

        this.updateQueue();
        socketService.on('add-song', this.updateQueue);
	}

    queueController.prototype.updateQueue = function () {
        queueService.getQueue().then(data => {
            this.queue = data;
        }, function (error) {
            console.error(error);
        });
    };

	speakerQueue.controller('queueController', queueController);

}());
