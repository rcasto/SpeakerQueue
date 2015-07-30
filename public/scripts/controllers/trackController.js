(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

	function trackController() {
        /* jshint validthis:true */
        this.tracks = this.tracks || null;
        this.trackAction = this.trackAction || function () { };
        if (this.trackActionContext) {
            this.trackAction = this.trackAction.bind(this.trackActionContext);
        }
        if (this.tracks && !Array.isArray(this.tracks)) {
            this.tracks = [this.tracks];
        }
    }

	speakerQueue.controller('trackController', [trackController]);
}());
