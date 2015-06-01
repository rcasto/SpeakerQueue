(function () {

	var speakerQueue = angular.module('speakerQueue');

	function queueController() {
		console.log("Queue Controller loaded");
	}

	speakerQueue.controller('queueController', queueController);

}());