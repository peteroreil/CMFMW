'use strict';
const Promise = require('bluebird');
const GroupService = require('../services/contact-group-service');
const ContactService = require('../services/contact-service');


const logger = require('../utilities/logger');

function update(id, group) {
    if(id == null) return GroupService.createGroup(group)
    return GroupService.updateGroupById(id, group)
}

module.exports.updateById = (req, res) => {
    const group = req.body;
    const id = group._id || req.params.id;
    update(id, group)
        .then((grp) => res.status(200).json(grp))
        .catch((err) => {
            console.log(err.stack)
            res.status(500).json({ message: err.message });            
        });
}

module.exports.find = (req, res) => {
    const query = req.query;
    GroupService.findGroups(query)
        .then((groups) => {
            let status = 404;
            if(groups.length) status = 200 
            res.status(status).json(groups)
        }).catch((err) => { 
            logger.error(err.stack)
            res.status(500).send();
        });
}

module.exports.findById = (req, res) => {
    GroupService.findGroupById(req.params.id)
        .then(group => {
            let status = 404;
            if(group) status = 200
            group = group || {};
            res.status(status).json(group)
        }).catch((err)  => { 
            logger.error(err.stack)
            res.status(500).json({ message: err.message });
        });
}

module.exports.deleteById = (req, res) => {
    const id = req.params.id;
    GroupService.deleteGroupById(id)
        .then((removed) => res.status(200).send())
        .catch((err) => {
            logger.error(err.stack)
            res.status(500).json({ message: err.message });            
        });
}

module.exports.addContactToGroup = (req, res) => {

    Promise.join(ContactService.findContactById(req.body.contact_id),
        GroupService.findGroupById(req.params.id), 
        (contact, group) => {
            if(!(contact && group)) {
                return res.status(400).json({})
            }
            if(group.contacts.indexOf(contact._id) === -1) {
                group.contacts.push(contact._id)
            }
            return group.save()
                .then(grp => GroupService.findGroupById(grp._id));
        }).then((group) => {
            return res.status(200).json(group)
        }).catch((err) => {
            logger.error(err.stack)
            res.status(500).send()
        })   
}


// routes.delete('/group/:id/member/:mid', contactGroupRoutes.removeContactFromGroup);



