(function () {

	SC.initialize({
		client_id: "9cb398fe220f1bef54d28cc3f4a8a06a"
	});

	SC.stream("/tracks/293", function (sound) {
		console.dir(sound);
		sound.play();
	});

}());