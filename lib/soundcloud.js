(function () {
    "use strict";

    var Promise = require('lie');
    var Request = require('./util/http');
    var config = require('../config.json');

    // normalize track object
    function normalizeTrackObj(track) {
        return {
            id: track.id,
            title: track.title,
            description: track.description,
            stream_url: track.stream_url,
            artwork_url: track.artwork_url,
            artist: track.artist || (track.user && track.user.username),
            stream_location: track.stream_location
        };
    }

    function getTrackLocation(track) {
        track = normalizeTrackObj(track);
        return new Promise(function (resolve, reject) {
            if (track.stream_url) {
                Request.getJSON(track.stream_url + "?client_id=" + config.clientId + "&allow_redirects=False")
                    .then(function (data) {
                        if (data.location) {
                            track.stream_location = data.location;
                            resolve(track);
                        } else {
                            reject("No location returned for stream of track: " + JSON.stringify(data));
                        }
                    }, function (error) {
                        reject(error);
                    });
            } else {
                reject("No validstream for track: " + JSON.stringify(track));
            }
        });
    }
    
    function compareTracks(track1, track2) {
        return track1.id === track2.id;
    }

    // define exports
    module.exports = {
        normalizeTrackObj: normalizeTrackObj,
        getTrackLocation: getTrackLocation,
        compareTracks: compareTracks
    };
    
}());
