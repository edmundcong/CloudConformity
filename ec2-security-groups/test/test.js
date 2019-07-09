const ec2SecurityGroups = require('../index');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
chai.use(chaiAsPromised);
const proxyquire = require('proxyquire');
const should = require('chai').should();

describe('fetchSecurityGroups', async () => {
    it("should succeed and return an object of ec2 security groups", async () => {
        const awsStub = {}; // create our require()'d AWS object
        awsStub.config = {update: (arg) => {arg}}; // give it a config field with an update method
        // create a stub to avoid calling the AWS EC2 constructor
        awsStub.EC2 = sinon.stub();
        const ec2Object = {
            // stub out the call to the AWS SDK's describeSecurityGroups
            describeSecurityGroups: () => {
                return {
                    // stub out the call to the AWS object's promise
                    promise: () => {
                        return { id: "1", data: {"SecurityGroups": [
                                    {"GroupName": "sec_group_1", "GroupId": "1"},
                                    {"GroupName": "sec_group_2", "GroupId": "2"}
                                ]} }
                    }
                }
            }
        };
        // return the above object the first time we call our EC2 constructor
        awsStub.EC2.onCall(0).returns(ec2Object);
        const stubbedEc2SecurityGroups = await proxyquire.noCallThru().load('../index', {
            'aws-sdk': awsStub
        });
        const result = await stubbedEc2SecurityGroups.fetchSecurityGroups();
        result.should.have.property('data').eql({"SecurityGroups": [
                {"GroupName": "sec_group_1", "GroupId": "1"},
                {"GroupName": "sec_group_2", "GroupId": "2"}
            ]} );
    });
});

describe('constructSecurityGroupsArray', async () => {
    it("should return a well formatted object", async () => {
        const secGroup = [
            {GroupId: 1, GroupName: "group_sec_1"},
            {GroupId: 2, GroupName: "group_sec_2"},
            {GroupId: 3, GroupName: "group_sec_3"},
        ];
        const result = ec2SecurityGroups.constructSecurityGroupsArray(secGroup);
        result.should.eql(
            [
                {id: 1, type: "GroupObject", attributes: {GroupName: "group_sec_1"}},
                {id: 2, type: "GroupObject", attributes: {GroupName: "group_sec_2"}},
                {id: 3, type: "GroupObject", attributes: {GroupName: "group_sec_3"}},
            ]
        )
    });
    it("should return empty array", async () => {
        const result = ec2SecurityGroups.constructSecurityGroupsArray([]);
        result.should.eql([]);
    });
});