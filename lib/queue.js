var queue = [];

function addTrack(track) {
	queue.push(track);
	console.log("Track added");
	console.log(track["stream_url"]);
}

function nextTrack() {
	
}

function removeTrack(index) {

}

function trackCount() {
	return queue.length;
}

function moveTrack(track, index) {

}

function saveQueue(path) {

}

module.exports = {
	addTrack: addTrack,
	removeTrack: removeTrack,
	trackCount: trackCount,
	moveTrack: moveTrack,
	saveQueue: saveQueue
};