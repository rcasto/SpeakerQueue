"use strict";

var Promise = require('lie');

var db = require('./util/db');
var config = require('../config.json');

var DATABASE_ID = "speakerqueue";
var COLLECTION_ID = "rooms";

var client = null;
var database = null;
var collection = null;
var isInitialized = false;

function init() {
    if (isInitialized) {
        return Promise.resolve();
    }
    return new Promise(function (resolve, reject) {
        client = db.getClient(config.dbEndpoint, config.dbKey);
        db.getOrCreateDatabase(client, DATABASE_ID).then (function (_database) {
            database = _database;
            db.getOrCreateCollection(client, database._self, COLLECTION_ID).then(function (_collection) {
                collection = _collection;
                getOrCreateRoom('default').then(function () {
                    resolve();
                }, reject);
                isInitialized = true;
            }, reject);
        }, reject);
    });
}

function getOrCreateRoom(roomName) {
    return init().then(function () {
       return db.getOrCreateDocument(client, collection._self, {
           id: roomName,
           queue: [],
           player: {
               playTime: 0,
               isPlaying: false,
               track: null
           }
       });
    });
}

function removeRoom(roomName) {
    return init().then(function () {
        return db.deleteDocument(client, collection._self, roomName);
    });
}

// If roomId is not present, get all rooms
function getRooms(roomId) {
    return init().then(function () {
       if (!roomId) {
           return db.getAllDocuments(client, collection._self);
       }
       return getOrCreateRoom(roomId); 
    });
}

function onError(err) {
    console.error('error:', JSON.stringify(err));
}

module.exports = {
    init: init,
    getRooms: getRooms,
    getOrCreateRoom: getOrCreateRoom,
    removeRoom: removeRoom
};