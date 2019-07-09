// load SDK
const AWS = require('aws-sdk');
// set region
AWS.config.update({region: 'us-west-2'});

const constructSecurityGroupsArray = (secGroupArr) => secGroupArr.map(e => e.GroupName);

exports.handler = async (event) => {
    try {
        // Create EC2 service object
        var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
        // Retrieve security group descriptions. Note that this returns an AWS.request object (not a promise)
        const ec2GroupsRequests = ec2.describeSecurityGroups({});
        // await thennable promise of describeSecurityGroup request
        const ec2DataPromise = await (ec2GroupsRequests.promise());
        if (ec2DataPromise.length == 0) {
            return {data: []}
        } else {
            return {data: constructSecurityGroupsArray(ec2DataPromise.SecurityGroups)};
        }
    } catch (error) {
        return {error: "Internal Server Error"};
    }
};