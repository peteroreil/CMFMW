'use strict';
const routes = require('express').Router();
const contactRoutes = require('./contact');
const contactGroupRoutes = require('./contact-group');
const healthcheck = require('./healthcheck');

routes.get('/ping', healthcheck.ping);

routes.post('/contact', contactRoutes.create);
routes.put('/contact', contactRoutes.updateById);
routes.put('/contact/:id', contactRoutes.updateById);
routes.get('/contact', contactRoutes.find);
routes.get('/contact/:id', contactRoutes.findById);
routes.delete('/contact/:id', contactRoutes.deleteById);

// TODO: write tests here
routes.post('/group', contactGroupRoutes.create);
routes.put('/group', contactGroupRoutes.updateById);
routes.put('/group/:id', contactGroupRoutes.updateById);
routes.get('/group', contactGroupRoutes.find);
routes.get('/group/:id', contactGroupRoutes.findById);
routes.delete('/group/:id', contactGroupRoutes.deleteById);

// TODO: write tests here
// routes.put('/group/:id/member', contactGroupRoutes.addContactToGroup);
// routes.delete('/group/:id/member/:mid', contactGroupRoutes.removeContactFromGroup);

module.exports = routes;