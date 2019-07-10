const lambda = require('../index');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
chai.use(chaiAsPromised);
const proxyquire = require('proxyquire');
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
    it("fail as our client submitted correct Accept with media params", async () => {
        const result = await lambda.handler({headers: {"Accept": "application/vnd.api+json; charset=utf-8", "Content-Type":"application/vnd.api+json" }}, {});
        result.should.have.property('statusCode').equal('406');
    });
    it("should succeed as we've successfully retrieved our security groups from our module", async () => {
        const sg1 = {"GroupId": "1", "GroupName": "security_group_1"};
        const sg2 = {"GroupId": "2", "GroupName": "security_group_2"};
        const secGroups = {SecurityGroups: [sg1, sg2]};

        const stubbedLambda = await proxyquire.noCallThru().load('../index', {
            'ec2-security-groups': {
                fetchSecurityGroups: async () => secGroups,
                constructSecurityGroupsArray: (data) => [
                    {id: 1, type: "GroupObject", attributes: {GroupName: "security_group_1"}},
                    {id: 2, type: "GroupObject", attributes: {GroupName: "security_group_2"}}]
            }
        });

        const result = await stubbedLambda.handler({headers: {"Content-Type":"application/vnd.api+json" }}, {});

        result.should.have.property('body').equal(
            '{"data":' +
            '[{"id":1,"type":"GroupObject","attributes":{"GroupName":"security_group_1"}},' +
            '{"id":2,"type":"GroupObject","attributes":{"GroupName":"security_group_2"}}' +
            '],"type":"array"}');
    });
    it("should succeed and return an array of size 0", async () => {
        const secGroups = {SecurityGroups: []};
        const stubbedLambda = await proxyquire.noCallThru().load('../index', {
            'ec2-security-groups': {
                fetchSecurityGroups: async () => secGroups,
                constructSecurityGroupsArray: (data) => []
            }
        });
        const result = await stubbedLambda.handler({headers: {"Content-Type":"application/vnd.api+json" }}, {});
        result.should.have.property('body').eql([]);
    });
    it("should fail as we thrown an error", async () => {
        const secGroups = {SecurityGroups: []};
        const stubbedLambda = await proxyquire.noCallThru().load('../index', {
            'ec2-security-groups': {
                fetchSecurityGroups: async () => { throw new Error() },
                constructSecurityGroupsArray: (data) => []
            }
        });
        const result = await stubbedLambda.handler({headers: {"Content-Type":"application/vnd.api+json" }}, {});
        result.should.have.property('statusCode').equal('500');
    });
});