'use strict';
const routes = require('express').Router();
const contactRoutes = require('./contact');
const contactGroupRoutes = require('./contact-group');
const healthcheck = require('./healthcheck');

routes.get('/ping', healthcheck.ping);

routes.post('/contact', contactRoutes.updateById);
routes.put('/contact', contactRoutes.updateById);
routes.put('/contact/:id', contactRoutes.updateById);
routes.get('/contact', contactRoutes.find);
routes.get('/contact/:id', contactRoutes.findById);
routes.delete('/contact/:id', contactRoutes.deleteById);

routes.post('/group', contactGroupRoutes.updateById);
routes.put('/group', contactGroupRoutes.updateById);
routes.put('/group/:id', contactGroupRoutes.updateById);
routes.get('/group', contactGroupRoutes.find);
routes.get('/group/:id', contactGroupRoutes.findById);
routes.delete('/group/:id', contactGroupRoutes.deleteById);


module.exports = routes;