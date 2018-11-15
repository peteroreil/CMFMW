'use strict';
const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
    forename: {
        type: String,
        required: true
    },

    surname: {
        type: String, 
        required: true
    },

    address: String,

    email_address: {
        type: String, 
        required: true
    },

    mobile_prefix: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 3
    },

    mobile_number: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 7
    }
})

module.exports = mongoose.model('Contact', ContactSchema);
