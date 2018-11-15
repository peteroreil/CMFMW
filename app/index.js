'use strict';
const express = require('express');
const service = require('./routes/index');
const datastore = require('./datastore/store');
const logger = require('./utilities/logger');
const morgan = require('morgan');
const config = require('config');

const PORT = config.server.port
const VERSION = config.service.api_version

const app = express();

app.use(morgan('combined', { stream: logger.stream }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(`/${VERSION}`, service)

function startApp() {
   return new Promise((res, rej) => {
        app.listen(PORT, (err) => {
            if(err) return rej(err)
            return res()
        }); 
    }); 
}

function logStarted() {
    logger.info('Service started....')
    logger.info(`listening on port: ${PORT}`)
}

datastore.connect(config)
    .then(startApp)
    .then(logStarted)
    .catch((err) => {
        logger.error("exiting...")
        logger.error(err.stack)
        process.exit(-1)
    });

