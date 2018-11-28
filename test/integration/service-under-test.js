'use strict';

/*
* Constructs the base Service URL used by integration tests
*/
const request = require('request-promise');
const config = require('config').test;
const service = config.service;
const database = config.database;

const HOSTNAME = service.hostname;
const PORT = service.port;
const API_VERSION = service.version;

const TEST_DB_HOST = database.host;
const TEST_DB_USER = database.user;
const TEST_DB_PASS = database.pass;
const TEST_DB_NAME = database.name;
const TEST_DB_PORT = database.port;

const serviceURL = `http://${HOSTNAME}:${PORT}/${API_VERSION}`;
const databaseURL = `mongodb://${TEST_DB_USER}:${TEST_DB_PASS}@${TEST_DB_HOST}:${TEST_DB_PORT}/${TEST_DB_NAME}`;

// a request wrapper around the service endpoint
const client = {};

client.createContact = function(contact) {
    return request({
        method: 'POST',
        uri: `${module.exports.serviceURL}/contact`,
        body: contact,
        json: true,
        resolveWithFullResponse: true
    });
}

client.getContact = function(contactId) {
    return request({
        uri: `${module.exports.serviceURL}/contact/${contactId}`,
        resolveWithFullResponse: true,
        json: true,
    });
}

client.getContacts = function(contacts) {
    return request({
        uri: `${module.exports.serviceURL}/contact`,
        resolveWithFullResponse: true,
        json: true,            
    });
}

client.updateContact = function(contact, id) {
    let resource = (id == null) ? 'contact' : `contact/${id}` 
    return request({
        method: 'PUT',
        uri: `${module.exports.serviceURL}/${resource}`,
        body: contact,
        json: true,
        resolveWithFullResponse: true
    });        
}

client.createGroup = function(contactGroup) {
    return request({
        method: 'POST',
        uri: `${module.exports.serviceURL}/group`,
        body: contactGroup,
        json: true,
        resolveWithFullResponse: true
    });
}

client.updateGroup = function(updatedGroup, id) {
    let resource = (id == null) ? 'group' : `group/${id}`
    return request({
        method: 'PUT',
        uri: `${module.exports.serviceURL}/${resource}`,
        body: updatedGroup,
        json: true,
        resolveWithFullResponse: true
    });    
}

client.getContactGroup = function(groupId) {
    return request({
        uri: `${module.exports.serviceURL}/group/${groupId}`,
        resolveWithFullResponse: true,
        json: true,            
    });   
}

client.getGroups = function() {
    return request({
        uri: `${module.exports.serviceURL}/group`,
        resolveWithFullResponse: true,
        simple: false,
        json: true,            
    });     
}

client.deleteGroup = function(id) {
    return request({
        method: 'DELETE',
        uri: `${module.exports.serviceURL}/group/${id}`,
        json: true,
        resolveWithFullResponse: true
    });    
}


module.exports.databaseURL = databaseURL;
module.exports.serviceURL = serviceURL;
module.exports.client = client;
