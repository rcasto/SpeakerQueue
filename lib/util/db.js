var DocumentClient = require('documentdb').DocumentClient;
var Promise = require('lie');

var idQueryString = 'SELECT * FROM root r WHERE r.id=@id';
var allQueryString = 'SELECT * from root';

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

function getAllDocuments(client, collectionUri) {
    return new Promise(function (resolve, reject) {
        client.readDocuments(collectionUri).toArray(function(err, results) {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

function updateDocument(client, collectionUri, document) {
    return new Promise(function (resolve, reject) {
        return getOrCreateById(document, client.queryDocuments.bind(client, collectionUri)).then(function (_document) {
            // Update document only if already present in database
            if (_document) {
                console.log('replacing document', document._self);
                 client.replaceDocument(document._self, document, function (err, replacement) {
                     if (err) {
                        console.log('Error:', JSON.stringify(err));
                        return reject(err);
                     }
                     console.log('document replaced');
                     return resolve(replacement);
                 });
            } else {
                return resolve(null);   
            }
        }); 
    });
}

function deleteDatabase(client, dbId) {
    return getOrCreateDatabase(client, dbId).then(function (database) {
        return deleteByResourceLink(database._self, client.deleteDatabase.bind(client));
    }, onPromiseError);
}

function deleteCollection(client, dbUri, collectionId) {
    return getOrCreateCollection(client, dbUri, collectionId).then(function (collection) {
        return deleteByResourceLink(collection._self, client.deleteCollection.bind(client));
    }, onPromiseError);
}

function deleteDocument(client, collectionUri, documentId) {
    return getOrCreateDocument(client, collectionUri,{
        id: documentId
    }).then(function (document) {
        return deleteByResourceLink(document._self, client.deleteDocument.bind(client));
    }, onPromiseError);
}

// Private functions: 
// assumes the "this" variable of queryFunc and createFunc is the DocumentClient
function getOrCreateById(resourceDef, queryFunc, createFunc) {
    var querySpec = {
        query: idQueryString,
        parameters: [{
            name: '@id',
            value: resourceDef.id
        }]
    };
    return new Promise(function (resolve, reject) {
        if (queryFunc) {
            queryFunc(querySpec).toArray(function(err, results) {
                if (err) {
                    return reject(err);
                }
                if (results.length === 0) {
                    if (createFunc) {
                        createFunc(resourceDef, function(err, created) {
                            if (err) {
                                return reject(err);
                            }
                            console.log('Resource', resourceDef.id, 'created!');
                            return resolve(created);
                        });
                    } else {
                        return resolve(null);
                    }
                } else {
                    console.log('Resource', resourceDef.id, 'found!');
                    return resolve(results[0]);
                }
            });
        } else {
            return resolve(null);
        }
    });
}

// assumes the "this" variable of deleteFunc is the DocumentClient
function deleteByResourceLink(resourceLink, deleteFunc) {
    return new Promise(function (resolve, reject) {
        deleteFunc(resourceLink, function(err) {
            if (err) {
                return reject(err);
            }
            console.log('Resource', resourceLink, 'deleted!');
            return resolve();
        });
    });
}

function onPromiseError(err) {
    return Promise.reject(err);
}

// Public facing api
module.exports = {
    getClient: getClient,
    getOrCreateDatabase: getOrCreateDatabase,
    getOrCreateCollection: getOrCreateCollection,
    getOrCreateDocument: getOrCreateDocument,
    getAllDocuments: getAllDocuments,
    updateDocument: updateDocument,
    deleteDatabase: deleteDatabase,
    deleteCollection: deleteCollection,
    deleteDocument: deleteDocument
};