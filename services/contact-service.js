'use strict';
const Contact = require('../models/contact');

const ContactService = {};

ContactService.findContacts = function(query) {
    if(query && query.forename) {
        return Contact.find({ 
            forename: new RegExp(query.forename, "i")
        }).exec();
    }

    if(query && query.surname) {
        return Contact.find({ 
            surname: new RegExp(query.surname, "i")
        }).exec();
    } 

    return Contact.find()
        .exec();
}

ContactService.findContactById = function(id) {
    return Contact.findOne({ _id: id })
}

ContactService.createContact = function(contact) {
    const cntct = new Contact(contact)
    return cntct.save();
}

ContactService.updateContactById = function(id, contact) {
    return Contact.findOneAndUpdate({ _id: id }, contact, { new: true, upsert: true })
        .exec();
}

ContactService.deleteContactById = function(id) {
    return Contact.deleteOne({ _id: id });
}

module.exports = ContactService;