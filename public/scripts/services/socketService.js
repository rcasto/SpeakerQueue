(function () {

	var speakerQueue = angular.module('speakerQueue');

     var socket = io.connect('http://localhost:3000');

	function socketService() {
        this.events = ['add-song', 'remove-song', 'pause', 'play'];
	}

    socketService.prototype.isValidEvent = function (event) {
        this.events.map(function (val, i, arr) {
            if (val === event) {
                return true;
            }
        });
        return false;
    };

    socketService.prototype.emit = function (event) {
        if (this.isValidEvent(event)) {
            socket.emit(event);
        }
    };

	speakerQueue.service('socketService', socketService);

}());
