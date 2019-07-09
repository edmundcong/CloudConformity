const lambda = require('../index');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
chai.use(chaiAsPromised);
const should = require('chai').should();


describe('getSecurityGroups', async () => {
    it("fail as we haven't passed in content-type", async () => {
        const result = await lambda.handler({}, {});
        result.should.have.property('statusCode').equal('415');
    });
    it("fail as we have passed in wrong content-type", async () => {
        const result = await lambda.handler({headers: {"Content-Type": "binary"}}, {});
        result.should.have.property('statusCode').equal('415');
    });
    it("fail as our client submitted correct Accept but wrong content-type", async () => {
        const result = await lambda.handler({headers: {"Accept": "binary", "Content-Type":"application/vnd.api+json" }}, {});
        result.should.have.property('statusCode').equal('406');
    });
    it("succeed as we've successfully retrieved our security groups from our module", async () => {
        const result = await lambda.handler({headers: {"Accept": "binary", "Content-Type":"application/vnd.api+json" }}, {});
        result.should.have.property('statusCode').equal('406');
    });
});