(function () {

	var speakerQueue = angular.module('speakerQueue');

	var $scope;
    var queueService, self;

	function queueController(_queueService_, _$scope_) {
        $scope = _$scope_;
        queueService = _queueService_;
        self = this;

        attachEvents($scope);
        this.updateQueue();
	}

    queueController.prototype.updateQueue = function () {
        queueService.getQueue().then(function (data) {
            self.queue = data;
        }, function (error) {
            console.error(error);
        });
    };

    function attachEvents(scope) {

        scope.$on('TrackAdded', function (event, track) {
            self.updateQueue();
        });

    }

	speakerQueue.controller('queueController', queueController);

}());
