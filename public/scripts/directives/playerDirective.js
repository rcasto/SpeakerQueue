(function () {
    "use strict";

	var speakerQueue = angular.module('speakerQueue');

	function playerDirective(socketService) {
        return {
            restrict: 'EA',
            scope: {},
            templateUrl: '/partial-views/player.html',
            link: function (scope, elem, attrs, ctrl) {
                var audio = elem.find('audio');
                var audioElem = audio[0];
                
                socketService.on('play-song', function (track) {
                    console.log('Now playing', track.title, 'by', track.artist);
                    audioElem.src = track.stream_location;
                });

                audioElem.src = "http://soundfox.net/audio/02_Maroon_5_-_Payphone_feat_Wiz_Khalifa.mp3";

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
