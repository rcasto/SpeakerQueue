var Promise = require('lie');

var soundCloud = require('./soundcloud');
var db = require('./speakerDb');

function addTrack(socket, track) {
    performRoomAction(socket, _addTrack, track);
}
function _addTrack(room, track) {
    return new Promise(function (resolve, reject) {
        console.log('Adding track to queue');
        room.queue.push(track); 
        resolve(room);
    });
}

function playTrack(socket, isPlaying) {
    console.log('Playing track');
    performRoomAction(socket, _playTrack, isPlaying);
}
function _playTrack(room, isPlaying) {
    return new Promise(function (resolve, reject) {
        room.player.isPlaying = isPlaying;
        resolve(room);
    });
}

function refreshTrack(socket, track) {
    performRoomAction(socket, _refreshTrack, track);
}
function _refreshTrack(room, track) {
    return new Promise(function (resolve, reject) {
        console.log('Refreshing track', track);
        soundCloud.getTrackLocation(track).then(function (freshTrack) {
            room.player.track = freshTrack;
            // This should be sent to all clients (or just send back to individual client)
            resolve(room);
        }, onError);
    });
}

function updateTrackTime(socket, playTime) {
    performRoomAction(socket, _updateTrackTime, playTime);
}
function _updateTrackTime(room, playTime) {
    return new Promise(function (resolve, reject) {
        room.player.playTime = playTime;
        resolve(room);
    });
}

function performRoomAction(socket, action) {
    console.log('room action started');
    var args = Array.prototype.slice.call(arguments, 2);
    db.getOrCreateRoom(getSocketRoom(socket)).then(function (room) {
        console.log('Room found');
        args.unshift(room);
        action.apply(null, args).then(function (newRoom) {
            console.log("room action complete")
            socket.broadcast.to(newRoom.id).emit('room-state', newRoom);
            db.updateRoom(newRoom);
        }, onError);
    }, onError);
}

// Assume people are only in room at a time
function getSocketRoom(socket) {
    if (socket && socket.rooms) {
        var rooms = Object.keys(socket.rooms);
        if (rooms.length >= 2) {
            return rooms[1];   
        }
    }
    return null;
}

function onError(err) {
    console.error(JSON.stringify(err));
}

module.exports = {
    addTrack: addTrack,
    playTrack: playTrack,
    refreshTrack: refreshTrack,
    updateTrackTime: updateTrackTime
};