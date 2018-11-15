'use strict';
const Promise = require('bluebird');
const mongo = require('mongodb').MongoClient;
const expect = require('chai').expect;
const undertest = require('./service-under-test');
const mongoUnderTest = undertest.databaseURL;

describe('testing contacts endpoints', function() {

    let mongoConnection;

    before('connect to mongo', function() {
        return mongo.connect(mongoUnderTest, { useNewUrlParser: true })
            .then((mc) => {
                mongoConnection = mc;
            });
    });

    after('disconnect from mongo', function() {
        return mongoConnection.close(true);
    });

    afterEach('drop Contact collection', function() {
        return mongoConnection.db()
            .collection('contacts')
            .drop();
    });

    const contact = {
        forename: 'Peadar',
        surname: 'McGillicuddy',
        address: '123 LilliputianLane',
        email_address: 'pmg@gmail.com',
        mobile_prefix: '081',
        mobile_number: '1234567'
    };

    it('should create a Contact POST /contact', function() {
        return undertest.client.createContact(contact)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.haveOwnProperty('_id');
                expect(response.body.forename).to.equal(contact.forename);
                expect(response.body.surname).to.equal(contact.surname);
                expect(response.body.address).to.equal(contact.address);
                expect(response.body.email_address).to.equal(contact.email_address);
                expect(response.body.mobile_prefix).to.equal(contact.mobile_prefix);
                expect(response.body.mobile_number).to.equal(contact.mobile_number);
            });
    });

    it('should get Contact on GET /contact/:id', function() {
        let createdContactId = null;

        return undertest.client.createContact(contact)
            .then(response => response.body._id)
            .then((contactId) => {
                createdContactId = contactId; 
                return undertest.client.getContact(contactId)
            }).then((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body._id).to.equal(createdContactId);
                expect(response.body.forename).to.equal(contact.forename);
                expect(response.body.surname).to.equal(contact.surname);
                expect(response.body.address).to.equal(contact.address);
                expect(response.body.email_address).to.equal(contact.email_address);
                expect(response.body.mobile_prefix).to.equal(contact.mobile_prefix);
                expect(response.body.mobile_number).to.equal(contact.mobile_number);
            });
    });

    it('should get all contacts on GET /contacts', function() {
        return Promise.all([
            undertest.client.createContact(contact),
            undertest.client.createContact(contact),
            undertest.client.createContact(contact)])
            .then(() => {
                return undertest.client.getContacts()
            }).then((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.instanceOf(Array);
                expect(response.body.length).to.equal(3);
            });
    });


    it('should update Contact on PUT /contact where `_id` sent in body', function() {
        let contactId = null;
        return undertest.client.createContact(contact)
            .then(response => response.body)
            .then((contact) => {
                expect(contact).to.haveOwnProperty('_id'); // ensure has '_id'
                contactId = contact._id;
                const updatedContact = {};
                updatedContact._id = contact._id;
                // Update all fields by reversing original contact
                updatedContact.forename = contact.forename.split('').reverse().join('');
                updatedContact.surname = contact.surname.split('').reverse().join('');
                updatedContact.mobile_prefix = contact.mobile_prefix.split('').reverse().join('');
                updatedContact.mobile_number = contact.mobile_number.split('').reverse().join('');
                updatedContact.address = contact.address.split('').reverse().join('');
                updatedContact.email_address = contact.email_address.split('').reverse().join('');
                return undertest.client.updateContact(updatedContact)
            }).then((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body._id).to.equal(contactId);
                // verify response is equal to reversed original
                expect(response.body.forename).to.equal(contact.forename.split('').reverse().join(''));
                expect(response.body.surname).to.equal(contact.surname.split('').reverse().join(''));
                expect(response.body.address).to.equal(contact.address.split('').reverse().join(''));
                expect(response.body.email_address).to.equal(contact.email_address.split('').reverse().join(''));
                expect(response.body.mobile_prefix).to.equal(contact.mobile_prefix.split('').reverse().join(''));
                expect(response.body.mobile_number).to.equal(contact.mobile_number.split('').reverse().join(''));                
            });
    });

    it('PUT Contact should be idempotent only `_id` sent in body', function() {
        return undertest.client.updateContact(contact)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                return undertest.client.updateContact(response.body);
            }).then(undertest.client.getContacts)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.instanceOf(Array);
                expect(response.body.length).to.equal(1);
            });
    });

    it('PUT Contact should create when no `_id` is sent - NOT Idempotent', function() {
        return undertest.client.updateContact(contact)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                delete response.body._id;
                return undertest.client.updateContact(response.body);
            }).then(undertest.client.getContacts)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.instanceOf(Array);
                expect(response.body.length).to.equal(2);
            });
    });

    it('PUT Contact should be idempotent when sent to /contact/:id if NO `_id` sent in body', function() {
        return undertest.client.updateContact(contact)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                let id = response.body._id;
                delete response.body._id;
                return undertest.client.updateContact(response.body, id);
            }).then(undertest.client.getContacts)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.instanceOf(Array);
                expect(response.body.length).to.equal(1);
            })
    });
});
