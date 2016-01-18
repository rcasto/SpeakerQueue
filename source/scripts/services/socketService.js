(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');
    var $http, $q, $rootScope;

	function socketService(_$http_, _$q_, _$rootScope_) {
        $http = _$http_;
        $q = _$q_;
        $rootScope = _$rootScope_;

        this.initialize();
	}

    socketService.prototype.reset = function () {
        this.initBuffer = [];
        this.socket = null;
        this.connectionString = null;
    };
    
    socketService.prototype.initialize = function () {
        this.reset();
        this.connect().then(function (connectionResult) {
            if (connectionResult) {
                console.log("Connected!");
            } else {
                console.error("Connection failed!");
            }
        });
    };

    socketService.prototype.connect = function () {
        return this.getConnectionString().then(connectionString => {
            this.socket = io.connect(connectionString);
            // Initialize events registered before connection
            this.initBuffer.forEach(eventInfo => {
                this.on(eventInfo.event, eventInfo.cb);
            });
            this.initBuffer = [];
            return true;
        }, function (err) {
            console.error(err);
            return false;
        });
    };

    socketService.prototype.getConnectionString = function () {
        if (this.connectionString) {
            return $q.resolve(this.connectionString)
        }
        return $http.get('/api/connect/').then(data => {
            this.connectionString = data && data.data && data.data.connectionString;
            return this.connectionString;
        }, function (err) {
            console.error(JSON.stringify(err));
            return null;
        });
    };

    socketService.prototype.isConnected = function () {
        return !!this.socket;
    };

    socketService.prototype.emit = function (event, data) {
        this.socket.emit(event, data);
    };

    socketService.prototype.on = function (event, cb) {
        if (this.socket) {
            this.socket.on(event, function (data) {
                console.log('Client received event: ', event);
                $rootScope.$apply(function () {
                    cb(data);
                });
            });
        } else {
            this.initBuffer.push({
                'event': event,
                'cb': cb
            });
        }
    };

	speakerQueue.service('socketService', ['$http', '$q', '$rootScope', socketService]);
}());