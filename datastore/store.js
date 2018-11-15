'use strict';
const mongoose = require('mongoose');
const logger = require('../utilities/logger');

module.exports.connect = function(options) {
    return mongoose.connect(`mongodb://${options.database.user}:${options.database.pass}@${options.database.host}:${options.database.port}/${options.database.name}`, {
        useNewUrlParser: true,
        autoReconnect: true
    }).then(() => {
        logger.info('connection to datastore successful....')
    }).catch((err) => {
        logger.error('failed to connect to datastore....');
        logger.error(`failed with message: ${err.message}`)
        throw err;
    });
}
