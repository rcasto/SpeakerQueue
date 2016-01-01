(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

	function playerDirective(socketService) {
        return {
            restrict: 'EA',
            scope: {
                track: '=?'
            },
            templateUrl: '/partial-views/player.html',
            link: function (scope, elem, attrs, ctrl) {
                var audio = elem.find('audio');
                var audioElem = audio[0];
                
                function playSong(track) {
                    console.log('Now playing', track.title, 'by', track.artist);
                    scope.track = track;
                    audioElem.src = track.stream_location;
                }
                
                socketService.on('play-song', playSong);
                socketService.on('queue-state', function (queueInfo) {
                    if (queueInfo.currentTrack) {
                        playSong(queueInfo.currentTrack);
                    } 
                });

                audioElem.addEventListener('playing', function () {
                    console.log('playing playing');
                });
                audioElem.addEventListener('ended', function () {
                    console.log('track ended');
                });
                audioElem.addEventListener('error', function () {
                    console.log('An error occurred while playing');
                });
                audioElem.addEventListener('pause', function () {
                    console.log('track has been paused');
                });
                audioElem.addEventListener('timeupdate', function () {
                    console.log('track time has updated');
                });
                audioElem.addEventListener('seeking', function () {
                    console.log('track seeking has started');
                });
                audioElem.addEventListener('seeked', function () {
                    console.log('track seeking has completed');
                });
            }
        };
	}

	speakerQueue.directive('speakerPlayer', ['socketService', playerDirective]);
}());
