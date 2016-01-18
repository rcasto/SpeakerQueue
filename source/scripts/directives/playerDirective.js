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
                    console.log(`Now playing, ${track.title}, by, ${track.artist}`);
                    
                    scope.track = track;
                    audioElem.src = track.stream_location;
                }
                
                socketService.on('play-song', playSong);
                socketService.on('room-state', function (queueInfo) {
                    if (queueInfo.currentTrack) {
                        playSong(queueInfo.currentTrack);
                    }
                });

                audioElem.addEventListener('playing', function () {
                    socketService.emit('play-song', scope.track);
                });
                audioElem.addEventListener('ended', function () {
                    console.log('track ended');
                });
                audioElem.addEventListener('error', function (error) {
                    scope.track.refresh = true;
                    socketService.emit('select-song', scope.track);
                    console.error(JSON.stringify(error));
                });
                audioElem.addEventListener('pause', function () {
                    console.log('track has been paused');
                    socketService.emit('play-song', scope.track);
                });
                audioElem.addEventListener('timeupdate', function (event) {
                    console.log('track time has updated', JSON.stringify(event));
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
