(function () {
    // TODO: add 'use strict' to every client side file (does it work on the server side?)
	var speakerQueue = angular.module('speakerQueue');

	function trackController() {
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
