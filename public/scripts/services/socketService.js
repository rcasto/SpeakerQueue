(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

    var $http, $q, $rootScope;
    
    /*
        The data structure and things occuring in here need to looked into again
    */

    // May want to abstract out connection string and events, user can register them with service or pass in default events
	function socketService(_$http_, _$q_, _$rootScope_) {
        $http = _$http_;
        $q = _$q_;
        $rootScope = _$rootScope_;

        /* jshint validthis:true */
        this.initialize();
	}

    socketService.prototype.reset = function () {
        this.initBuffer = [];
        this.events = [];
        this.socket = null;
        this.connectionString = null;
    };

    // could make this initialize with some events from the get go
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
        return this.getConnectionString().then(function (connectionString) {
            this.socket = io.connect(connectionString);
            this.registerEvents();
            return true;
        }.bind(this), function (err) {
            console.error(err);
            return false;
        });
    };

    socketService.prototype.getConnectionString = function () {
        if (this.connectionString) {
            return $q.resolve(this.connectionString)
        }
        return $http.get('/api/connect/').then(function (data) {
            this.connectionString = data && data.data && data.data.connectionString;
            return this.connectionString;
        }.bind(this), function (err) {
            console.error(JSON.stringify(err));
            return null;
        });
    };

    socketService.prototype.isConnected = function () {
        return !!this.socket;
    };
    
    socketService.prototype.isEventRegistered = function (event) {
        return this.socket && this.socket.callbacks[event]        
    };

    socketService.prototype.isValidEvent = function (event) {
        return this.events.some(function (eventObj) {
            return eventObj.event === event;
        });
    };

    socketService.prototype.getEventInfo = function (event) {
        for (var i = 0; i < this.events.length; i++) {
            if (this.events[i].event === event) {
                return this.events[i];
            }
        }
        return null;
    };

    socketService.prototype.emit = function (event, data) {
        if (this.isValidEvent(event)) {
            this.socket.emit(event, data);
        }
    };

    socketService.prototype.on = function (event, cb) {
        if (this.socket) {
            this.socket.on(eventName, function (data) {
                $rootScope.$apply(function () {
                    cb(data);
                });
            });
        }
    };

	speakerQueue.service('socketService', ['$http', '$q', '$rootScope', socketService]);
}());
