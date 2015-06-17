(function () {
	var speakerQueue = angular.module('speakerQueue');

	function socketService() {
        this.socket = io.connect('http://localhost:3000');
        this.events = ['add-song', 'remove-song', 'pause', 'play'];
	}

    socketService.prototype.isValidEvent = function (event) {
        return this.events.some(function (val, i, arr) {
            return val === event;
        });
    };

    socketService.prototype.emit = function (event) {
        if (this.isValidEvent(event)) {
            this.socket.emit(event);
        }
    };

    socketService.prototype.on = function (event, cb) {
        this.events.push(event);
        this.socket.on(event, cb);
    };

	speakerQueue.service('socketService', socketService);

}());
