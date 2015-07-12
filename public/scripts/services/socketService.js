(function () {
	var speakerQueue = angular.module('speakerQueue');

    var $http, $q, $rootScope;

    // May want to abstract out connection string and events, user can register them with service or pass in default events
	function socketService(_$http_, _$q_, _$rootScope_) {
        $http = _$http_;
        $q = _$q_;
        $rootScope = _$rootScope_;

        this.initialize();
	}

    socketService.prototype.reset = function () {
        this.events = [];
        this.socket = null;
        this.connectionString = null;
    };

    socketService.prototype.initialize = function (events) {
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
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    socketService.prototype.isConnected = function () {
        return !!this.socket;
    };

    socketService.prototype.isValidEvent = function (event) {
        return this.events.some(function (val, i, arr) {
            return val.event === event;
        });
    };

    socketService.prototype.registerEvents = function () {
        this.events.filter(function (val, i, arr) {
            return !val.registered;
        }).map(function (val, i, arr) {
            val.registered = true;
            this.on(val.event, val.cb);
        }.bind(this));
    };

    socketService.prototype.emit = function (event, data) {
        if (this.isValidEvent(event)) {
            this.socket.emit(event, data);
        }
    };

    socketService.prototype.on = function (event, cb) {
        var eventEntry = {
            'event': event,
            'cb': cb,
            'registered': false
        };
        if (this.isConnected()) {
            eventEntry.registered = true;
            this.socket.on(event, function (data) {
                cb(data);
                $rootScope.$apply();
            });
            return true;
        }
        if (!this.isValidEvent(event)) {
            this.events.push(eventEntry);
        }
        return false;
    };

	speakerQueue.service('socketService', ['$http', '$q', '$rootScope', socketService]);

}());
