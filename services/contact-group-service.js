'use strict';
const ContactGroup = require('../models/contact-group');

const ContactGroupService = {};

ContactGroupService.createGroup = function(group) {
    const grp = new ContactGroup(group)
    return grp.save();
}

ContactGroupService.updateGroupById = function(id, group) {
    const update = {};

    return ContactGroup.findOneAndUpdate(
        { _id: id }, 
        group, 
        { new: true, upsert: true })
        .populate('contacts')
        .exec();
}

ContactGroupService.findGroups = function(query) {
    if(query && query.group_name) {
        return ContactGroup.find({ 
            group_name: new RegExp(query.group_name, "i")
        }).populate('contacts')
        .exec();
    }

    if(query && query.description) {
        return ContactGroup.find({ 
            description: new RegExp(query.description, "i")
        }).populate('contacts')
        .exec();
    } 

    return ContactGroup.find()
        .populate('contacts')
        .exec();
}

ContactGroupService.findGroupById = function(id) {
    return ContactGroup.findOne({ _id: id })
        .populate('contacts')
        .exec();
}

ContactGroupService.deleteGroupById = function(id) {
    return ContactGroup.deleteOne({ _id: id });
}

module.exports = ContactGroupService;