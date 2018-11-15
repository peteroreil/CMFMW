'use strict';
const ContactService = require('../services/contact-service');
const logger = require('../utilities/logger');

function update(id, contact) {
    if(id == null) return ContactService.createContact(contact)
    return ContactService.updateContactById(id, contact)
}

module.exports.create = (req, res) => {
    ContactService.createContact(req.body)
        .then((contact) => res.status(200).json(contact))
        .catch((err)  => { 
            logger.error(err.stack)
            res.status(500).json({ message: err.message });
        });
}

module.exports.find = (req, res) => {
    const query = req.query;
    ContactService.findContacts(query)
        .then((contacts) => {
            let status = 404;
            if(contacts.length) status = 200 
            res.status(status).json(contacts)
        }).catch((err) => { 
            logger.error(err.stack)
            res.status(500).send();
        });
}

module.exports.findById = (req, res) => {
    ContactService.findContactById(req.params.id)
        .then(contact => {
            let status = 404;
            if(contact) status = 200
            contact = contact || {};
            res.status(status).json(contact)
        }).catch((err)  => { 
            logger.error(err.stack)
            res.status(500).json({ message: err.message });
        });
}

module.exports.deleteById = (req, res) => {
    const id = req.params.id;
    ContactService.deleteContactById(id)
        .then((removed) => res.status(200).send())
        .catch((err) => {
            logger.error(err.stack)
            res.status(500).json({ message: err.message });            
        });
}

module.exports.updateById = (req, res) => {
    const contact = req.body;
    const id = contact._id || req.params.id;
    update(id, contact)
        .then((cntct) => res.status(200).json(cntct))
        .catch((err) => {
            logger.error(err.stack)
            res.status(500).json({ message: err.message });            
        });
}

