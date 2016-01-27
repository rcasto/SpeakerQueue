(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

	function playerDirective($timeout, socketService, roomService) {
        return {
            restrict: 'EA',
            scope: {
                track: '=?'
            },
            templateUrl: '/partial-views/player.html',
            link: function (scope, elem, attrs, ctrl) {
                var audio = elem.find('audio');
                var audioElem = audio[0];
                var playTimeTimer = null;
                
                function buildPlayerState(track, playTime, isPlaying) {
                    return {
                        track: track,
                        playTime: playTime,
                        isPlaying: isPlaying  
                    };
                }
                
                function playSong(playerState) {
                    console.log(`Now playing, ${playerState.track.title}, by, ${playerState.track.artist}`);
                    
                    scope.track = playerState.track;
                    
                    audioElem.currentTime = playerState.playTime || 0;
                    if (audioElem.src !== playerState.track.stream_location) {
                        audioElem.src = playerState.track.stream_location;
                    }
                    
                    if (playerState.isPlaying) {
                        if (audioElem.paused) {
                            audioElem.play(); 
                        }
                    } else {
                        if (!audioElem.paused) {
                            audioElem.pause();
                        }
                    }
                }
                
                socketService.on('room-state', function (room) {
                    playSong(room.player);
                });

                audioElem.addEventListener('play', function () {
                    console.log('track is now playing');
                    socketService.emit('play-song', !audioElem.paused);
                });
                audioElem.addEventListener('ended', function () {
                    console.log('track ended');
                });
                audioElem.addEventListener('error', function (error) {
                    scope.track.stream_location = null;
                    socketService.emit('refresh', scope.track);
                    console.error(JSON.stringify(error));
                });
                audioElem.addEventListener('pause', function () {
                    console.log('track has been paused');
                    socketService.emit('play-song', !audioElem.paused);
                });
                audioElem.addEventListener('timeupdate', function () {
                    console.log('track seeking has completed');
                    // socketService.emit('time-update', audioElem.currentTime);
                });
                
                scope.$on('$destroy', function () {
                   if (playTimeTimer) {
                       $timeout.cancel(playTimeTimer);
                   } 
                });
            }
        };
	}

	speakerQueue.directive('speakerPlayer', ['$timeout', 'socketService', 'roomService', playerDirective]);
}());
