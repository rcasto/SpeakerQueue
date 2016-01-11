var DocumentClient = require('documentdb').DocumentClient;
var Promise = require('lie');

function getClient(uri, key) {
    return new DocumentClient(uri, {
        masterKey: key
    });
}

function getOrCreateDatabase(client, dbId) {
    return getOrCreateById({
        id: dbId
    }, client.queryDatabases.bind(client), client.createDatabase.bind(client));
}

function getOrCreateCollection(client, dbUri, collectionId) {
    return getOrCreateById({
        id: collectionId
    }, client.queryCollections.bind(client, dbUri), client.createCollection.bind(client, dbUri));
}

// document object must contain id property
function getOrCreateDocument(client, collectionUri, document) {
    return getOrCreateById(document, client.queryDocuments.bind(client, collectionUri),
                           client.createDocument.bind(client, collectionUri));
}

function getDocuments(client) {
    var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id=@id',
        parameters: [{
            name: '@id',
            value: resourceDef.id
        }]
    };
    return new Promise(function (resolve, reject) {
        queryFunc(querySpec).toArray(function(err, results) {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                createFunc(resourceDef, function(err, created) {
                    if (err) {
                        return reject(err);
                    }
                    console.log('Resource', resourceDef.id, 'created!');
                    return resolve(created);
                });
            } else {
                console.log('Resource', resourceDef.id, 'found!');
                return resolve(results[0]);
            }
        });
    });
}

// Private function: assumes the "this" variable of queryFunc and createFunc is the DocumentClient
function getOrCreateById(resourceDef, queryFunc, createFunc) {
    var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id=@id',
        parameters: [{
            name: '@id',
            value: resourceDef.id
        }]
    };
    return new Promise(function (resolve, reject) {
        queryFunc(querySpec).toArray(function(err, results) {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                createFunc(resourceDef, function(err, created) {
                    if (err) {
                        return reject(err);
                    }
                    console.log('Resource', resourceDef.id, 'created!');
                    return resolve(created);
                });
            } else {
                console.log('Resource', resourceDef.id, 'found!');
                return resolve(results[0]);
            }
        });
    });
}

function deleteDatabase(client, dbId) {
    return getOrCreateDatabase(client, dbId).then(function (database) {
        client.deleteDatabase(database._self, function(err) {
            if (err) {
                return Promise.reject(err);
            }
            console.log("Database deleted!");
            return Promise.resolve();
        });
    }, function (err) {
        return Promise.reject(err);
    });
}

module.exports = {
    getClient: getClient,
    getOrCreateDatabase: getOrCreateDatabase,
    getOrCreateCollection: getOrCreateCollection,
    getOrCreateDocument: getOrCreateDocument,
    deleteDatabase: deleteDatabase
};