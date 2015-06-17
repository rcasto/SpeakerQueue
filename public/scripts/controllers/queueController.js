(function () {

	var speakerQueue = angular.module('speakerQueue');

	var $http, queueService;

	function queueController(_queueService_) {
        queueService = _queueService_;
	}

	speakerQueue.controller('queueController', queueController);

}());
