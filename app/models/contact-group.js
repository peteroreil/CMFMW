'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactGroupSchema = mongoose.Schema({
    group_name: {
        type: String,
        required: true
    },

    description: String,

    contacts: [
        { type: Schema.Types.ObjectId, ref: 'Contact' }
    ]
})

module.exports = mongoose.model('ContactGroup', ContactGroupSchema);