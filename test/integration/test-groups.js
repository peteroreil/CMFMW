'use strict';
const Promise = require('bluebird');
const mongo = require('mongodb').MongoClient;
const expect = require('chai').expect;
const undertest = require('./service-under-test');
const mongoUnderTest = undertest.databaseURL;


describe('testing group endpoints', function() {

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

    afterEach('drop Group collection', function() {
        return mongoConnection.db()
            .collections()
            .then(collections => Promise.map(collections, collection => collection.drop()))
    });

    const contact = {
        forename: 'Peadar',
        surname: 'McGillicuddy',
        address: '123 LilliputianLane',
        email_address: 'pmg@gmail.com',
        mobile_prefix: '081',
        mobile_number: '1234567'
    };

    const contactGroup = {
        group_name: "test contact group",
        description: "optional description of a contact group"
    };

    it('should create a ContactGroup on POST /group', function() {
        return undertest.client.createGroup(contactGroup)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.haveOwnProperty('_id');
                expect(response.body.group_name).to.equal(contactGroup.group_name);
                expect(response.body.description).to.equal(contactGroup.description);
                expect(response.body.contacts).to.be.an('Array');
                expect(response.body.contacts.length).to.be.equal(0);
            });
    });


    it('should add a Contact to a ContactGroup on PUT /group', function() {
        return Promise.all([
            undertest.client.createContact(contact),
            undertest.client.createGroup(contactGroup)
        ]).spread((contactResp, contactGroupResp) => {
            let contactId = contactResp.body._id;
            let contactGroup = contactGroupResp.body;
            contactGroup.contacts.push(contactId);
            delete contactGroup.__v;
            return undertest.client.updateGroup(contactGroup);
        }).then((response) => {
            const statusCode = response.statusCode;
            const updatedGroup = response.body;
            expect(statusCode).to.equal(200);
            expect(updatedGroup.contacts.length).to.equal(1);
            expect(updatedGroup.contacts[0].forename).to.equal(contact.forename);
        });
    })

    it('should get ContactGroup on GET /group/:id', function() {
        let createdGroupId = null;

        return undertest.client.createGroup(contactGroup)
            .then(() => undertest.client.createGroup(contactGroup))
            .then(response => response.body._id)
            .then((groupId) => {
                createdGroupId = groupId; 
                return undertest.client.getContactGroup(groupId)
            }).then((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body._id).to.equal(createdGroupId);
                expect(response.body.group_name).to.equal(contactGroup.group_name);
                expect(response.body.description).to.equal(contactGroup.description);
            });
    });

    it('should get all ContactGroups on GET /group', function() {
        return Promise.all([
            undertest.client.createGroup(contactGroup),
            undertest.client.createGroup(contactGroup),
            undertest.client.createGroup(contactGroup)])
            .then(undertest.client.getGroups)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.instanceOf(Array);
                expect(response.body.length).to.equal(3);
            });
    });


    it('should update ContactGroup on PUT /group where `_id` sent in body', function() {
        let groupId = null;
        return undertest.client.createGroup(contactGroup)
            .then(response => response.body)
            .then((group) => {
                expect(group).to.haveOwnProperty('_id'); // ensure has '_id'
                groupId = group._id;
                const updatedGroup = {};
                updatedGroup._id = group._id;
                // Update all fields by reversing original contact
                updatedGroup.group_name = contactGroup.group_name.split('').reverse().join('');
                updatedGroup.description = contactGroup.description.split('').reverse().join('');

                return undertest.client.updateGroup(updatedGroup)
            }).then((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body._id).to.equal(groupId);
                // verify response is equal to reversed original
                expect(response.body.group_name).to.equal(contactGroup.group_name.split('').reverse().join(''));
                expect(response.body.description).to.equal(contactGroup.description.split('').reverse().join(''));
            });
    });

    it('PUT ContactGroup should be idempotent only `_id` sent in body', function() {
        return undertest.client.updateGroup(contactGroup)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                return undertest.client.updateGroup(response.body);
            }).then(undertest.client.getGroups)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.instanceOf(Array);
                expect(response.body.length).to.equal(1);
            });
    });

    it('PUT ContactGroup should create when no `_id` is sent - NOT Idempotent', function() {
        return undertest.client.updateGroup(contactGroup)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                delete response.body._id;
                return undertest.client.updateGroup(response.body);
            }).then(undertest.client.getGroups)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.instanceOf(Array);
                expect(response.body.length).to.equal(2);
            });
    });

    it('PUT ContactGroup should be idempotent when sent to /group/:id if NO `_id` sent in body', function() {
        return undertest.client.updateGroup(contactGroup)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                let id = response.body._id;
                delete response.body._id;
                return undertest.client.updateGroup(response.body, id);
            }).then(undertest.client.getGroups)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.instanceOf(Array);
                expect(response.body.length).to.equal(1);
            })
    });


    it('DELETE ContactGroup should delete contact group', function() {
        return undertest.client.createGroup(contactGroup)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
                let id = response.body._id;
                return undertest.client.deleteGroup(id);
            }).then(() => undertest.client.getGroups())
            .then((response) => {
                expect(response.statusCode).to.equal(404);
                expect(response.body).to.be.instanceOf(Array);
                expect(response.body.length).to.equal(0);
            })
    });

    it('DELETE ContactGroup should not delete contacts', function() {
        let contactIds = [];
        let groupId = null;

        return Promise.all([
            undertest.client.createContact(contact),
            undertest.client.createContact(contact),
            undertest.client.createContact(contact)
        ]).then((contactResponses) => Promise.map(contactResponses, contactResp => contactIds.push(contactResp.body._id)))
        .then(() => undertest.client.createGroup(contactGroup))
        .then((grpResp) => {
            groupId = grpResp.body._id;
            const group = grpResp.body;
            group.contacts = contactIds;
            return undertest.client.updateGroup(group);
        }).then(resp => {
            expect(resp.statusCode).to.equal(200);
        }).then(() => undertest.client.deleteGroup(groupId))
        .then(undertest.client.getContacts)
        .then((resp) => {
            expect(resp.statusCode).to.equal(200);
            expect(resp.body).to.be.an('Array');
            expect(resp.body.length).to.equal(3);
        })
    });
});