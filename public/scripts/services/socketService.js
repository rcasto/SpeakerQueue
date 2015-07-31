(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

    var $http, $q, $rootScope;

    // May want to abstract out connection string and events, user can register them with service or pass in default events
	function socketService(_$http_, _$q_, _$rootScope_) {
        $http = _$http_;
        $q = _$q_;
        $rootScope = _$rootScope_;

        /* jshint validthis:true */
        this.initialize();
	}

    socketService.prototype.reset = function () {
        this.events = [];
        this.socket = null;
        this.connectionString = null;
    };

    // could make this initialize with some events from the get go
    socketService.prototype.initialize = function () {
        this.reset();
        this.connect();
    };

    socketService.prototype.connect = function () {
        this.getConnectionString().then(function (connectionString) {
            this.socket = io.connect(connectionString);
            this.registerEvents();
        }.bind(this), function (err) {
            console.error(err);
        });
    };

    socketService.prototype.getConnectionString = function () {
        var deferred = $q.defer();
        $http.get('/api/connect/').then(function (data) {
            this.connectionString = data.data.connectionString;
            deferred.resolve(this.connectionString);
        }.bind(this), function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    socketService.prototype.isConnected = function () {
        return !!this.socket;
    };

    socketService.prototype.isValidEvent = function (event) {
        return this.events.some(function (eventObj) {
            return eventObj.event === event;
        });
    };

    socketService.prototype.getEventInfo = function (eventName) {
        for (var i = 0; i < this.events.length; i++) {
            if (this.events[i].event === eventName) {
                return this.events[i];
            }
        }
        return null;
    };

    socketService.prototype.registerEvents = function () {
        var self = this;
        this.events.filter(function (eventObj) {
            return !eventObj.registered;
        }).map(function (evenObj) {
            self.registerEvent(evenObj.event);
        });
    };

    socketService.prototype.emit = function (event, data) {
        if (this.isValidEvent(event)) {
            this.socket.emit(event, data);
        }
    };

    socketService.prototype.on = function (event, cb) {
        var eventEntry = this.getEventInfo(event);

        if (eventEntry) {
            eventEntry.callbacks.push(cb);
        } else {
            eventEntry = {
                'event': event,
                'callbacks': [cb],
                'registered': false
            };
            this.events.push(eventEntry);
        }

        if (this.isConnected()) {
            this.registerEvent(event);
            return true;
        }

        return false;
    };

    socketService.prototype.registerEvent = function (eventName) {
        var eventEntry = this.getEventInfo(eventName);
        if (!eventEntry) {
            eventEntry = {
                'event': eventName,
                'callbacks': [],
                'registered': false
            };
            this.events.push(eventEntry);
        }
        if (eventEntry.registered || eventEntry.callbacks.length === 0) {
            return;
        }
        this.socket.on(eventName, function (data) {
            eventEntry.callbacks.forEach(function (callback) {
                callback(data);
            });
            $rootScope.$apply();
        });
        eventEntry.registered = true;
    };

	speakerQueue.service('socketService', ['$http', '$q', '$rootScope', socketService]);
}());
