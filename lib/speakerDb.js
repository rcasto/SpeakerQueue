"use strict";

var Promise = require('lie');

var db = require('./util/db');
var config = require('../config.json');

var DATABASE_ID = "speakerqueue";
var COLLECTION_ID = "rooms";

var client = null;
var database = null;
var collection = null;

function init() {
    client = db.getClient(config.dbEndpoint, config.dbKey);
    db.getOrCreateDatabase(client, DATABASE_ID).then (function (_database) {
        database = _database;
        db.getOrCreateCollection(client, database._self, COLLECTION_ID).then(function (_collection) {
            collection = _collection;
        }, onError);
    }, onError);
}

function createRoom(roomName) {
    
}

function removeRoom(roomName) {
    
}

// If roomId is not present, get all rooms
function getRooms(roomId) {
    
}

function onError(err) {
    console.error(JSON.stringify(err));
}

module.exports = {
    init: init,
    getRooms: getRooms  
};