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
                getOrCreateRoom('default');
                isInitialized = true;
                // Testing
                // populateTestRooms(client, collection);
                resolve();
            }, reject);
        }, reject);  
    });
}

function getOrCreateRoom(roomName) {
    return init().then(function () {
       return db.getOrCreateDocument(client, collection._self, {
           id: roomName
       }); 
    });
}

function removeRoom(roomName) {
    return init().then(function () {
        return db.deleteDocument(client, collection._self, roomName);
    });
}

// If roomId is not present, get all rooms
function getRooms() {
    return init().then(function () {
       return db.getDocuments(client, collection._self); 
    });
}

function onError(err) {
    console.error('error:', JSON.stringify(err));
}

// Testing
function populateTestRooms(client, collection) {
    db.getOrCreateDocument(client, collection._self, {
        id: 'speaker test',
        queue: ['one'],
        player: {
            trackTime: 120,
            isPlaying: false,
            track: {
                title: "hello"
            }
        }
    });
    db.getOrCreateDocument(client, collection._self, {
        id: 'jammin',
        queue: ['one', 'two'],
        player: {
            trackTime: 90,
            isPlaying: true,
            track: {
                title: "fuck you"
            }
        }
    });
}

module.exports = {
    init: init,
    getRooms: getRooms  
};