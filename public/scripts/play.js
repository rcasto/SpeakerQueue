(function () {
	var tomahk = window.tomahkAPI;

	function findTrack(title, artist) {
		tomahk.Track(title, artist, {
			width: 300,
			height: 300,
			handlers: {
				onloaded: function () {
					console.log("Now loaded");
				},
				onended: function () {
					console.log("Track ended");
				},
				onplayable: function () {
					console.log("Now playable");
				},
				onresolved: function (resolver, result) {
					console.dir(resolver, result);
				},
				ontimeupdate: function (timeupdate) {
					console.dir(timeupdate);
				}
			}
		});
	}

	window.onload = function () {
		// findTrack('The Killers', 'Human');
	};

}());