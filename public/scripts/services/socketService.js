(function () {
	var speakerQueue = angular.module('speakerQueue');

    // May want to abstract out connection string and events, user can register them with service or pass in default events
	function socketService() {
        // This is static for now will need to figure out how to make this dynamic
        // May need to pass up from server
        this.socket = io.connect('http://192.168.1.120:3000');
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
        this.socket.on(event, function () {
            cb();
        });
    };

	speakerQueue.service('socketService', [socketService]);

}());
