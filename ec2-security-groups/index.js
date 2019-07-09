// load SDK
const AWS = require('aws-sdk');
// set region
AWS.config.update({region: 'us-west-2'});

/**
 * Utility function which maps an array of SecurityGroup objects and returns an array of json-api compatible objects
 * the SecurityGroup name
 * @param secGroupArr SecurityGroup object's array of SecurityGroups
 * @returns {String[]}
 */
const constructSecurityGroupsArray = (secGroupArr) => secGroupArr.map(secGroup => {
    return { id: secGroup.GroupId, type: "GroupObject", attributes: { GroupName: secGroup.GroupName }}
});

const fetchSecurityGroups = async () => {
    // Create EC2 service object
    const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
    // Retrieve security group descriptions. Note that this returns an AWS.request object (not a promise)
    const ec2GroupsRequests = ec2.describeSecurityGroups({});
    // await thennable promise of describeSecurityGroup request
    const ec2DataPromise = await (ec2GroupsRequests.promise());
    return ec2DataPromise;
};

module.exports = {constructSecurityGroupsArray, fetchSecurityGroups}