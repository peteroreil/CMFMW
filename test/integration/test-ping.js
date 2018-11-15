'use strict';
const request = require('request-promise');
const expect = require('chai').expect;
const serviceEndpoint = require('./service-under-test').serviceURL;

describe('when testing healtchecks', function() {
    it('the service should respond to ping requests', function() {
        return request(`${serviceEndpoint}/ping`)
            .then((response) => {
                const parsedResp = JSON.parse(response)
                expect(parsedResp.message).to.equal("pong");
            });
    });
})